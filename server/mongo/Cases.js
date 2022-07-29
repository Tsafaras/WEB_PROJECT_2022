// functions and schema for collection 'Cases'
const {getRandomDayInRange, getCollection, excludeDays} = require("./helpers");
const sha256 = require('js-sha256').sha256;

/**
 * @param username {string}
 * @param date {Date}
 * @returns {Promise<*>}
 */
const declareCase = async (username, date) => {
    username = sha256(username);
    date = new Date(date);
    const collection = getCollection(process.env.COLL_CASES);
    let exclude = excludeDays(date);
    const result = await collection.updateOne({
            username: username,
            date: {$gt: exclude.minDay, $lt: exclude.maxDay}
        }, {$setOnInsert: {username: username, date: date}}, {upsert: true}
    )
    return result.upsertedCount;
};

/**
 * Generates cases in random dates (in [date_start, date_end]) for random users.
 * Either 1 or 33% of the users generate a case, whichever is higher.
 * @param users {String[]} - The list of users for which to generate cases.
 * @param date_start {Date} - Inclusive start of the date range.
 * @param num_of_days {number} - The number of days in the date range.
 */
const generate = async (users, date_start, num_of_days) => {
    const collection = getCollection(process.env.COLL_CASES);
    // how many to create
    const count = users.length >= 1 / parseInt(process.env.CASES_PERCENTAGE) ? Math.round(users.length * parseInt(process.env.CASES_PERCENTAGE)) : 1;

    let bulkOpArray = [];
    for (let i = 0; i < count; i++) {
        let onDay = getRandomDayInRange(date_start, num_of_days);
        let exclude = excludeDays(onDay);

        let doc = {
            username: users[i],
            date: onDay,
        }
        let singleOperation = {
            updateOne: {
                filter: {username: users[i], date: {$gt: exclude.minDay, $lt: exclude.maxDay}},
                update: {$setOnInsert: doc},
                upsert: true
            }
        }
        bulkOpArray.push(singleOperation);
    }

    const result = await collection.bulkWrite(bulkOpArray, {ordered: false})
        .catch(err => {
            console.log(err.result);
        });
    return result.nUpserted;
}

/**
 * Returns every case that contains the given username.
 * @param username {string}
 */
const caseHistory = async (username) => {
    const collection = getCollection(process.env.COLL_CASES);
    const cursor = collection.find({username: sha256(username)}).sort({date: 1}).project({date: 1, _id: 0});
    const found = await cursor.toArray();
    return found.map(x => x.date.toDateString());
}

/** The schema used for the collection's validation */
const schema = {
    $jsonSchema: {
        properties: {
            username: {
                bsonType: 'string'
            }, date: {
                bsonType: 'date'
            }
        }, required: ['username', 'date']
    }
};

module.exports = {schema, generate, declareCase, caseHistory, };
