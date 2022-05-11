const {MongoClient} = require('mongodb');

const Cases = require('./Cases')
const POIs = require('./POIs')
const Users = require('./Users')
const Visits = require('./Visits')

const coll_names = {
    Cases: Cases.schema,
    POIs: POIs.schema,
    Users: Users.schema,
    Visits: Visits.schema
}

class MongoBot {
    constructor() {
        this.client = new MongoClient('mongodb://localhost:27017');
    }

    /** Initializes MongoDB, establishing connection
     * and creating the collections that don't already exist
     */
    async init() {
        await this.client.connect();
        console.log('connected');

        this.db = this.client.db('WEB_PROJECT_2022');
        this.collections = {};

        for (const collNamesKey in coll_names) {
            if (await this.collExists(collNamesKey))
                this.collections[collNamesKey]
                    = this.db.collection(collNamesKey);
            else
                this.collections[collNamesKey]
                    = this.db.createCollection(collNamesKey, {
                    validator: coll_names[collNamesKey]
                });
        }
    }

    /**
     * Drops a collection and calls its constructor again, to assert its validator schema
     * @param {string} collection - The collection's name
     */
    async purge(collection) {
        // await this.db.dropCollection(collection);
        // if (collection === 'POIs')
        //     this.POIs = new POIs(this.db);
    //    TODO - Add definition. Drops POIs collection.
    }

    /**
     * Checks if a collection exists
     * @param {string} collection - The collection's name
     */
    async collExists(collection) {
        return await this.db.listCollections({name: collection}, {
            nameOnly: true
        }).hasNext();
    }
}

module.exports = new MongoBot();
