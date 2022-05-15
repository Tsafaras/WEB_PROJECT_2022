// functions and schema for collection 'Users'
const Collection = require('mongodb').Collection;
const bcrypt = require('bcryptjs');

/**
 * @param {Collection} collection
 * @param {Object} doc
 */
const signup = async (collection, doc) => {
    if (await collection.findOne({username: doc.username}))
        return 'username';

    if (await collection.findOne({email: doc.email}))
        return 'email';

    await collection.insertOne(doc);
    return true;
};

/**
 * Checks for an existing user's credentials.
 * Checks for admin if no username is provided, because of how calling function is setup.
 * @param {Collection} collection
 * @param {Object} doc
 * @returns {Promise<boolean>}
 */
const login = async (collection, doc) => {
    const result = await collection.findOne({username: doc.username});
    if ( result === null)
        return false;

    return checkHash(doc.password, result.password);
};

const checkHash = (given, existing) => {
    return bcrypt.compareSync(given, existing);
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

const index = {
    username: 1,
    email: 1
}

module.exports = {schema, signup, login, index};
