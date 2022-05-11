// functions and schema for collection 'Users'

async function add_user(doc) {
//    TODO - Add definition
}

/** The schema used for the collection's validation */
const schema = {
    $jsonSchema: {
        properties: {
            username: {
                bsonType: 'string', uniqueItems: true
            }, password: {
                bsonType: 'string', minLength: 8
            }, email: {
                bsonType: 'string', uniqueItems: true
            }
        }, required: ['username', 'password', 'email']
    }
};

module.exports = {schema};
