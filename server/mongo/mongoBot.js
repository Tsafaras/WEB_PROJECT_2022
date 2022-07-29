const {MongoClient} = require('mongodb');
const sha256 = require('js-sha256').sha256;

const Cases = require('./Cases')
const POIs = require('./POIs')
const Users = require('./Users')
const Visits = require('./Visits')
const {hashIt, getCollection, runAggregate, rewindTime, nextDay} = require("./helpers");

const coll_names = {
    Cases: {
        schema: Cases.schema,
    }, POIs: {
        schema: POIs.schema,
    }, Users: {
        schema: Users.schema,
    }, Visits: {
        schema: Visits.schema,
    },
}

class MongoBot {
    constructor() {
        this.client = new MongoClient('mongodb://localhost:27017');
    }

    /** Initializes MongoDB, establishing connection
     * and creating the collections that don't already exist
     */
    init = async () => {
        await this.connectOn();

        this.db = this.client.db('WEB_PROJECT_2022');

        for (const collNamesKey in coll_names) {
            if (!await this.collExists(collNamesKey)) {
                await this.db.createCollection(collNamesKey, {
                    validator: coll_names[collNamesKey].schema,
                });
            }
        }
        // await this.db.collection('Users').createIndex({username: 1, email: 1}, {unique: true});
        await this.db.collection('Users').createIndex(...Users.index[0]);
        await this.db.collection('Users').createIndex(...Users.index[1]);
        await this.db.collection('POIs').createIndex(...POIs.index[0]);
        await this.db.collection('POIs').createIndex(...POIs.index[1]);
        await this.db.collection('POIs').createIndex(...POIs.index[2]);
        await this.connectOff();
    };

    connectOn = async () => {
        await this.client.connect();
        console.log('connected');
    };

    connectOff = async () => {
        await this.client.close();
        console.log('disconnected');
    };

    /**
     * Drops a collection and calls its constructor again, to force its validator schema.
     */
    purge = async () => {
        let collToPurge = [{name: 'POIs', schema: POIs.schema}, {name: 'Visits', schema: Visits.schema}, {
            name: 'Cases', schema: Cases.schema
        }];

        for (const element of collToPurge) {
            await this.db.dropCollection(element.name)
            await this.db.createCollection(element.name, {
                validator: element.schema
            })
        }
    };

    /**
     * Returns a specific collection.
     * @param coll_name {string} - The collection we want
     * @returns a MongoDB Collection
     */
    getCollection = (coll_name) => {
        return this.db.collection(coll_name);
    }

    /**
     * Finds and returns the number of documents in 'Cases' and 'Visits' collection,
     * based on respective filters passed as parameters, and the number of visits made from an active case.
     * @param startDate {Date}
     * @param endDate {Date}
     * @returns {Promise<[{x: string, y: number},{x: string, y: number},{x: string, y: *}]>}
     */
    getCount = async (startDate, endDate) => {
        return [{
            x: 'Visits', y: await getCollection(process.env.COLL_VISITS).countDocuments(endDate),
        }, {
            x: 'Cases', y: await getCollection(process.env.COLL_CASES).countDocuments(startDate),
        }, {
            x: 'Visits from active cases', y: await this.getActive(),
        }]
    }

    getActive = async () => {
        const agg = [{
            $project: {
                _id: 0, date: 1, username: 1, minDay: {
                    $dateSubtract: {
                        startDate: '$date', unit: 'day', amount: 7
                    }
                }, maxDay: {
                    $dateAdd: {
                        startDate: '$date', unit: 'day', amount: 14
                    }
                }
            }
        }, {
            $lookup: {
                from: process.env.COLL_VISITS, localField: 'username', foreignField: 'username', as: 'visits'
            }
        }, {
            $project: {
                visits: {
                    $filter: {
                        input: '$visits', as: 'visit', cond: {
                            $and: [{
                                $gt: ['$$visit.date', '$minDay']
                            }, {
                                $lt: ['$$visit.date', '$maxDay']
                            }]
                        }
                    }
                }
            }
        }, {
            $match: {
                $expr: {
                    $gt: [{
                        $size: '$visits'
                    }, 0]
                }
            }
        }, {
            $unwind: {
                path: '$visits'
            }
        }, {
            $count: 'count'
        }];
        const count = await runAggregate(process.env.COLL_CASES, agg);
        return count[0].count;
    }

    getCategories = async () => {
        return [{
            name: 'By visits', data: await this.categoriesByVisits()
        }, {
            name: 'By active cases', data: await this.categoriesByActiveCases()
        }]
    }

    categoriesByVisits = async () => {
        const agg = [{
            $lookup: {
                from: process.env.COLL_POIS, localField: 'poi', foreignField: 'id', as: 'pois'
            }
        }, {
            $project: {
                type: '$pois.types', _id: 0
            }
        }, {
            $unwind: {path: '$type'}
        }, {
            $unwind: {path: '$type'}
        }, {
            $group: {
                _id: '$type', y: {$count: {}}
            }
        }, {
            $project: {
                _id: 0, x: '$_id', y: '$y'
            }
        }, {
            $sort: {x: 1}
        }];
        return await runAggregate(process.env.COLL_VISITS, agg);
    }

    categoriesByActiveCases = async () => {
        const agg = [{
            $project: {
                _id: 0, date: 1, minDay: {
                    $dateSubtract: {
                        startDate: '$date', unit: 'day', amount: 14
                    }
                }, maxDay: {
                    $dateAdd: {
                        startDate: '$date', unit: 'day', amount: 7
                    }
                }, username: 1, poi: 1
            }
        }, {
            $lookup: {
                from: process.env.COLL_CASES, localField: 'username', foreignField: 'username', as: 'cases'
            }
        }, {
            $project: {
                cases: {
                    $filter: {
                        input: '$cases', as: 'case', cond: {
                            $and: [{
                                $gt: ['$$case.date', '$minDay']
                            }, {
                                $lt: ['$$case.date', '$maxDay']
                            }]
                        }
                    }
                }, poi: 1
            }
        }, {
            $lookup: {
                from: process.env.COLL_POIS, localField: 'poi', foreignField: 'id', as: 'poi'
            }
        }, {
            $project: {
                type: {
                    $arrayElemAt: ['$poi.types', 0]
                }, cases: {
                    $size: '$cases'
                }
            }
        }, {
            $unwind: {
                path: '$type'
            }
        }, {
            $group: {
                _id: '$type', y: {
                    $count: {}
                }, cases: {
                    $sum: '$cases'
                }
            }
        }, {
            $project: {
                _id: 0, x: '$_id', y: '$cases'
            }
        }, {
            $sort: {x: 1}
        }];

        return await runAggregate(process.env.COLL_VISITS, agg);
    }

    possibleContact = async (username, date) => {
        const agg = [{
            $match: {
                date: {
                    $gte: rewindTime(date, 7)
                }, username: sha256(username)
            }
        }, {
            $lookup: {
                from: process.env.COLL_VISITS, 'let': {
                    user_visited: '$username', date_visited: '$date', poi_visited: '$poi'
                }, pipeline: [{
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ['$poi', '$$poi_visited']
                            }, {
                                $ne: ['$username', '$$user_visited']
                            }, {
                                $lte: [{
                                    $abs: {
                                        $dateDiff: {
                                            startDate: '$date', endDate: '$$date_visited', unit: 'hour'
                                        }
                                    }
                                }, 2]
                            }]
                        }
                    }
                }], as: 'other_visitors'
            }
        }, {
            $match: {
                $expr: {
                    $gt: [{
                        $size: '$other_visitors'
                    }, 0]
                }
            }
        }, {
            $unwind: {
                path: '$other_visitors'
            }
        }, {
            $lookup: {
                from: process.env.COLL_CASES, 'let': {
                    other_person: '$other_visitors.username', other_date: '$other_visitors.date'
                }, pipeline: [{
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ['$username', '$$other_person']
                            }, {
                                $lte: [{
                                    $dateDiff: {
                                        startDate: '$date', endDate: '$$other_date', unit: 'day'
                                    }
                                }, 7]
                            }]
                        }
                    }
                }], as: 'case'
            }
        }, {
            $match: {
                $expr: {
                    $gt: [{$size: '$case'}, 0]
                }
            }
        }, {
            $lookup: {
                from: 'POIs', localField: 'poi', foreignField: 'id', as: 'poi'
            }
        }, {
            $project: {
                _id: 0, date: 1, poi: {
                    $arrayElemAt: ['$poi.name', 0]
                }, address: {
                    $arrayElemAt: ['$poi.address', 0]
                }
            }
        }];

        return await runAggregate(process.env.COLL_VISITS, agg);
    }

    hourByHour = async (date) => {
        date = new Date(date);
        return {
            simple: await this.hourByHourSimple(date),
            active: await this.hourByHourActive(date)
        }
    }

    hourByHourSimple = async (date) => {
        const agg = [{
            $match: {
                $and: [{
                    date: {
                        $gte: date
                    }
                }, {
                    date: {
                        $lt: nextDay(date)
                    }
                }]
            }
        }, {
            $addFields: {
                hour: {
                    $hour: '$date'
                }
            }
        }, {
            $group: {
                _id: '$hour', count: {
                    $count: {}
                }
            }
        }, {
            $project: {
                _id: 0, x: '$_id', y: '$count'
            }
        }, {
            $sort: {
                x: 1
            }
        }]

        return await runAggregate(process.env.COLL_VISITS, agg);
    }

    hourByHourActive = async (date) => {
        const agg = [{
            $match: {
                $and: [{
                    date: {
                        $gte: date
                    }
                }, {
                    date: {
                        $lt: nextDay(date)
                    }
                }]
            }
        }, {
            $lookup: {
                from: process.env.COLL_CASES, localField: 'username', foreignField: 'username', as: 'cases'
            }
        }, {
            $addFields: {
                hour: {
                    $hour: '$date'
                }, cases: {
                    $cond: {
                        'if': {
                            $gt: [{
                                $size: '$cases'
                            }, 0]
                        }, then: 1, 'else': 0
                    }
                }
            }
        }, {
            $group: {
                _id: '$hour', count: {
                    $sum: {
                        $add: '$cases'
                    }
                }
            }
        }, {
            $project: {
                _id: 0, x: '$_id', y: '$count'
            }
        }, {
            $sort: {
                x: 1
            }
        }]

        return await runAggregate(process.env.COLL_VISITS, agg);
    }

    dayByDay = async (dateStart, dateEnd) => {
        dateStart = new Date(dateStart);
        dateEnd = new Date(dateEnd);
        return {
            simple: await this.dayByDaySimple(dateStart, dateEnd),
            active: await this.dayByDayActive(dateStart, dateEnd)
        }
    }

    dayByDaySimple = async (dateStart, dateEnd) => {
        const agg = [{
            $match: {
                $and: [{
                    date: {
                        $gte: dateStart
                    }
                }, {
                    date: {
                        $lte: dateEnd
                    }
                }]
            }
        }, {
            $addFields: {
                day: {
                    $dayOfMonth: '$date'
                }
            }
        }, {
            $group: {
                _id: '$day', count: {
                    $count: {}
                }
            }
        }, {
            $project: {
                _id: 0, x: '$_id', y: '$count'
            }
        }, {
            $sort: {
                x: 1
            }
        }]

        return await runAggregate(process.env.COLL_VISITS, agg);
    }

    dayByDayActive = async (dateStart, dateEnd) => {
        const agg = [{
            $match: {
                $and: [{
                    date: {
                        $gte: dateStart
                    }
                }, {
                    date: {
                        $lte: dateEnd
                    }
                }]
            }
        }, {
            $lookup: {
                from: process.env.COLL_CASES, localField: 'username', foreignField: 'username', as: 'cases'
            }
        }, {
            $addFields: {
                day: {
                    $dayOfMonth: '$date'
                }, cases: {
                    $cond: {
                        'if': {
                            $gt: [{
                                $size: '$cases'
                            }, 0]
                        }, then: 1, 'else': 0
                    }
                }
            }
        }, {
            $group: {
                _id: '$day', count: {
                    $sum: {
                        $add: '$cases'
                    }
                }
            }
        }, {
            $project: {
                _id: 0, x: '$_id', y: '$count'
            }
        }, {
            $sort: {
                x: 1
            }
        }]

        return await runAggregate(process.env.COLL_VISITS, agg);
    }

    /**
     * Checks if a collection exists
     * @param {string} collection - The collection's name
     */
    collExists = async collection => await this.db.listCollections({name: collection}, {
        nameOnly: true
    }).hasNext();

    generate = async (num_of_users, date_start, date_end) => {
        let docs = [];
        let usersHashed = []
        const num_of_days = (date_end - date_start) / process.env.MILISEC_IN_A_DAY + 1;

        for (let i = 1; i <= num_of_users; i++) {
            let username = 'user' + i;
            usersHashed.push(sha256(username));
            let email = username + '@user.com';
            let password = hashIt(email.charAt(0).toUpperCase() + email.slice(1));
            docs.push({
                username: username, password: password, email: email,
            })
        }
        const usersDocs = await Users.generate(docs);
        const casesDocs = await Cases.generate(usersHashed, date_start, num_of_days);
        const visitsDocs = await Visits.generate(usersHashed, date_start, num_of_days);
        return {
            users: usersDocs, cases: casesDocs, visits: visitsDocs
        }
    }
}

module.exports = new MongoBot();
