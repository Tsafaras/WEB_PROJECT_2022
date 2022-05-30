const {MongoClient} = require('mongodb');

const Cases = require('./Cases')
const POIs = require('./POIs')
const Users = require('./Users')
const Visits = require('./Visits')

const coll_names = {
    Cases: {
        schema: Cases.schema,
    },
    POIs: {
        schema: POIs.schema,
    },
    Users: {
        schema: Users.schema,
    },
    Visits: {
        schema: Visits.schema,
    },
}

class MongoBot {
    constructor() {
        this.client = new MongoClient('mongodb://localhost:27017');
    }

    /** Initializes MongoDB, establishing connection
     * and creating the collections that don't already exist
     */
    init = async () => {
        await this.connectOn();

        this.db = this.client.db('WEB_PROJECT_2022');

        for (const collNamesKey in coll_names) {
            if (!await this.collExists(collNamesKey)) {
                await this.db.createCollection(collNamesKey, {
                    validator: coll_names[collNamesKey].schema,
                });
            }
        }
        // await this.db.collection('Users').createIndex({username: 1, email: 1}, {unique: true});
        await this.db.collection('Users').createIndex(...Users.index[0]);
        await this.db.collection('Users').createIndex(...Users.index[1]);
        await this.db.collection('POIs').createIndex(...POIs.index[0]);
        await this.db.collection('POIs').createIndex(...POIs.index[1]);

        await this.connectOff();
    };

    connectOn = async () => {
        await this.client.connect();
        console.log('connected');
    };

    connectOff = async () => {
        await this.client.close();
        console.log('disconnected');
    };

    upload = async (body) => {
        await POIs.add_POI(this.db.collection('POIs'), body);
    }

    /**
     * Drops a collection and calls its constructor again, to assert its validator schema.
     * Works only for the POIs collection, as it is the only use-case of a 'drop'.
     */
    purge = async () => {
        let collToPurge = [{name: 'POIs', schema: POIs.schema},
            {name: 'Visits', schema: Visits.schema}, {name: 'Cases', schema: Cases.schema}
        ];

        for (const element of collToPurge) {
            await this.db.dropCollection(element.name)
            await this.db.createCollection(element.name, {
                validator: element.schema
            })
        }
        // for (const collToPurgeKey in collToPurge) {
        //     console.log(collToPurge);
        //     await this.db.dropCollection(collToPurgeKey.name)
        //     await this.db.createCollection(collToPurgeKey.name, {
        //         validator: collToPurgeKey.schema
        //     })
        // }
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
