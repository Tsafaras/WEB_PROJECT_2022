// functions and schema for collection 'Cases'

async function add_case(doc) {
//    TODO - Add definition
}

/** The schema used for the collection's validation */
const schema = {
    $jsonSchema: {
        properties: {
            username: {
                bsonType: 'string'
            }, date: {
                bsonType: 'timestamp'
            }
        }, required: ['username', 'date']
    }
};

module.exports = {schema};
