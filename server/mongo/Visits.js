// functions and schema for collection 'Visits'
const {getRandomDayInRange, getCollection} = require("./helpers");

const add_visit = async (docs) => {
    const collection = getCollection(process.env.COLL_VISITS);
//    TODO - Add definition
    }

const generate_visits = async (user) => {
    const collection = getCollection(process.env.COLL_VISITS);

}

/**
 *
 * @param users {String[]}
 * @param date_start {Date}
 * @param num_of_days {number} - The number of days in the date range.
 * @returns {Promise<number>}
 */
const generate = async (users, date_start, num_of_days) => {
    const collection =  getCollection(process.env.COLL_VISITS);
    let bulkOpArray = [];

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
            },
            username: {
                bsonType: 'string'},
            date: {
                bsonType: 'date'},
            estimation: {
                bsonType: 'number'}
        }, required: ['poi', 'username', 'date']
    }
};

module.exports = {schema, generate};
