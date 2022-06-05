// functions and schema for collection 'Users'
const {getCollection} = require("./helpers");

/**
 * @param {Object} doc
 */
const signup = async (doc) => {
    const collection = getCollection(process.env.COLL_USERS);
    if (await collection.findOne({username: doc.username})) return 'username';

    if (await collection.findOne({email: doc.email})) return 'email';

    await collection.insertOne(doc);
    return true;
};

/**
 * Checks for an existing user's credentials.
 * Checks for admin if no username is provided, because of how calling function is setup.
 * @param {String} username
 * @returns {Promise<boolean>}
 */
const login = async (username) => {
    const collection = getCollection(process.env.COLL_USERS);
    const result = await collection.findOne({username: username});
    if (result === null) return false;

    return result.password;
    // return checkHash(doc.password, result.password);
};

/**
 * Creates a bunch of users.
 * @param {Array} docs
 * @returns {Promise<number>}
 */
const generate = async (docs) => {
    const collection = getCollection(process.env.COLL_USERS);
    let bulkOpArray = [];

    for (let doc of docs) {
        let singleOperation = {
            updateOne: {
                filter: {$or: [{username: doc.username}, {email: doc.email}]},
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

const changeCred = async (username, field, newValue) => {
    const collection = getCollection(process.env.COLL_USERS);
    let doc = {};
    doc[field] = newValue;
    await collection.updateOne({username: username}, {$set: doc});
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

const index = [[{
    username: 1
}, {
    unique: true, name: "UniqueUsername"
},], [{
    email: 1
}, {
    unique: true, name: "UniqueEmail"
},]]

module.exports = {schema, signup, login, generate, changeCred, index};
