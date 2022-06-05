const {MongoClient} = require('mongodb');
const sha256 = require('js-sha256').sha256;

const Cases = require('./Cases')
const POIs = require('./POIs')
const Users = require('./Users')
const Visits = require('./Visits')
const bcrypt = require("bcryptjs");

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
        await POIs.add_POI( body);
    }

    /**
     * Drops a collection and calls its constructor again, to assert its validator schema.
     * Works only for the POIs collection, as it is the only use-case of a 'drop'.
     */
    purge = async () => {
        let collToPurge = [
            {name: 'POIs', schema: POIs.schema},
            {name: 'Visits', schema: Visits.schema},
            {name: 'Cases', schema: Cases.schema}
        ];

        for (const element of collToPurge) {
            await this.db.dropCollection(element.name)
            await this.db.createCollection(element.name, {
                validator: element.schema
            })
        }
    };

    /**
     * Returns a specific collection.
     * @param coll_name {string} - The collection we want
     * @returns a MongoDB Collection
     */
    getCollection = (coll_name) => {
        return this.db.collection(coll_name);
    }

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
        return checkHash(password, await Users.login(username));
    };

    signup = async (username, password, email) => {
        const query = {
            username: username,
            password: password,
            email: email
        };
        return await Users.signup(query);
    }

    generate = async (num_of_users, date_start, date_end) => {
        let docs = [];
        let usersHashed = []
        const num_of_days = (date_end - date_start) / process.env.MILISEC_IN_A_DAY + 1;

        for (let i = 1; i <= num_of_users; i++) {
            let username = 'user' + i;
            usersHashed.push(sha256(username));
            let email = username + '@user.com';
            let password = hashIt(email.charAt(0).toUpperCase() + email.slice(1));
            docs.push({
                username: username,
                password: password,
                email: email,
            })
        }
        const usersDocs = await Users.generate(docs);
        const casesDocs = await Cases.generate(usersHashed, date_start, num_of_days);
        // await Visits.generate(usersHashed, date_start, num_of_days);
    }
}

/**
 * Synchronous hashing function. Use case is for password only.
 * @param {String} to_hash what to hash.
 * @returns {String} the hashed result
 */
const hashIt = (to_hash) => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(to_hash, salt);
}

const checkHash = (given, existing) => {
    return bcrypt.compareSync(given, existing);
}

module.exports = new MongoBot();
