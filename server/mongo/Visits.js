// functions and schema for collection 'Visits'

async function add_visit(doc) {
//    TODO - Add definition
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
            timestamp: {
                bsonType: 'timestamp'},
            estimation: {
                bsonType: 'number'}
        }, required: ['poi', 'username', 'timestamp', 'estimation']
    }
};

module.exports = {schema};
