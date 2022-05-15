const {MongoClient} = require('mongodb');

const Cases = require('./Cases')
const POIs = require('./POIs')
const Users = require('./Users')
const Visits = require('./Visits')

const coll_names = {
    // Cases: {
    //     schema: Cases.schema,
    //     index: Cases.index,
    // },
    // POIs: {
    //     schema: POIs.schema,
    //     index: POIs.index,
    // },
    Users: {
        schema: Users.schema,
        index: Users.index,
    },
    // Visits: {
    //     schema: Visits.schema,
    //     index: Visits.index,
    // },
}

class MongoBot {
    constructor() {
        this.client = new MongoClient('mongodb://localhost:27017');
    }

    /** Initializes MongoDB, establishing connection
     * and creating the collections that don't already exist
     */
    init = async () => {
        await this.client.connect();
        console.log('connected');

        this.db = this.client.db('WEB_PROJECT_2022');

        for (const collNamesKey in coll_names) {
            if (!await this.collExists(collNamesKey))
                await this.db.createCollection(collNamesKey, {
                    validator: coll_names[collNamesKey].schema,
                });
        }
        // await this.db.collection('Users').createIndex({username: 1, email: 1}, {unique: true});
        await this.db.collection('Users').createIndex({username: 1}, {unique: true});
        await this.db.collection('Users').createIndex({email: 1}, {unique: true});
    };

    /**
     * Drops a collection and calls its constructor again, to assert its validator schema.
     * Works only for the POIs collection, as it is the only use-case of a 'drop'.
     */
    purge = async () => {
        let coll_name = 'POIs';
        await this.db.dropCollection(coll_name);
        await this.db.createCollection(coll_name, {
            validator: coll_names.POIs
        })
    };

    /**
     * Checks if a collection exists
     * @param {string} collection - The collection's name
     */
    collExists = async collection => await this.db.listCollections({name: collection}, {
        nameOnly: true
    }).hasNext();

    /**
     * @param {string} username
     * @param {string} password
     * @returns {Promise<boolean>}
     */
    login = async (username, password) => {
        const query = {
            username: username,
            password: password
        };
        return await Users.login(this.db.collection('Users'), query);
    };

    signup = async (username, password, email) => {
        const query = {
            username: username,
            password: password,
            email: email
        };
        return await Users.signup(this.db.collection('Users'), query);
    }
}

module.exports = new MongoBot();
