// functions and schema for collection 'Visits'
const {
    getCollection, nextDay, skipTime, getRandomIntInclusive, findNearPOI, runAggregate
} = require("./helpers");
const {sha256} = require("js-sha256");

/**
 * Registers a check in under the username that makes the request, upon the date of the request, on the desired poi.
 * @param username {string}
 * @param date {Date}
 * @param poi {string}
 * @param people {number | null}
 * @returns {Promise<*>}
 */
const checkIn = async (username, poi, date, people) => {
    username = sha256(username);
    date = new Date(date);
    const collection = getCollection(process.env.COLL_VISITS);

    let query = {username: username, date: date, poi: poi}
    if (people) query['visitors_est'] = people;

    const result = await collection.updateOne({
        username: username, date: date,
    }, {
        $setOnInsert: query
    }, {
        upsert: true
    })
    return result.upsertedCount;
};

/**
 * Returns every visit that contains the given username.
 * @param username {string}
 */
const visitHistory = async (username) => {
    const agg = [{
        $match: {
            username: sha256(username)
        }
    }, {
        $lookup: {
            from: process.env.COLL_POIS, localField: 'poi', foreignField: 'id', as: 'result'
        }
    }, {
        $unwind: {
            path: '$result'
        }
    }, {
        $project: {
            _id: 0, poi: '$result.name', date: 1, address: '$result.address'
        }
    }]
    return await runAggregate(process.env.COLL_VISITS, agg);
}

/**
 *
 * @param users {String[]}
 * @param date_start {Date}
 * @param num_of_days {number} - The number of days in the date range.
 * @returns {Promise<*>}
 */
const generate = async (users, date_start, num_of_days) => {
    const POIs = getCollection(process.env.COLL_POIS);
    let allPOIs = POIs.find({}, {projection: {_id: 0, id: 1, coordinates: 1}});
    allPOIs = await allPOIs.toArray();
    if (allPOIs.length === 0) return {noPOIs: true}

    const collection = getCollection(process.env.COLL_VISITS);

    const minPerDay = Math.ceil(users.length * parseInt(process.env.VISITS_PER_USER) / num_of_days);
    const minPerDayPerUser = Math.ceil(minPerDay / users.length);
    let onDay = skipTime(date_start);

    let bulkOpArray = [];
    for (let i = 0; i < num_of_days; i++) {
        for (const user of users) {
            let randomPOI = getRandomIntInclusive(allPOIs.length - 1)
            let currentPOI = allPOIs[randomPOI];
            let timestamp = onDay;
            let visitCount = getRandomIntInclusive(minPerDayPerUser + 5);

            let j = 0;
            do {
                let singleOperation = {
                    updateOne: {
                        filter: {username: user, date: timestamp}, update: {
                            $setOnInsert: {
                                username: user, date: timestamp, poi: currentPOI.id
                            }
                        }, upsert: true
                    }
                }
                bulkOpArray.push(singleOperation);
                let calculations = findNearPOI(currentPOI, allPOIs, timestamp);
                if (calculations.break) break;
                currentPOI = calculations.poi;
                timestamp = calculations.time;
            } while (j++ < visitCount)

        }
        onDay = nextDay(onDay);
    }

    const result = await collection.bulkWrite(bulkOpArray, {ordered: false})
        .catch(err => {
            console.log(err.result);
        });
    return result.nUpserted;
}

/** The schema used for the collection's validation */
const schema = {
    $jsonSchema: {
        properties: {
            poi: {
                bsonType: 'string'
            }, username: {
                bsonType: 'string'
            }, date: {
                bsonType: 'date'
            }, estimation: {
                bsonType: 'number'
            }
        }, required: ['poi', 'username', 'date']
    }
};

module.exports = {schema, generate, checkIn, visitHistory,};
