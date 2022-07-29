const {subDays, addDays, addMinutes} = require('date-fns');
const bcrypt = require("bcryptjs");
const haversine = require('haversine-distance');

const getRandomIntInclusive = (max) => {
    return Math.floor(Math.random() * (max + 1));
};

const getRandomDayInRange = (date_start, num_of_days) => {
    let whichDay = getRandomIntInclusive(num_of_days);
    return new Date(date_start + whichDay * parseInt(process.env.MILISEC_IN_A_DAY));
};

const getCollection = (coll_name) => {
    return require('./mongoBot').getCollection(coll_name);
};

/**
 * Calculates a date range period that covers `num_of_days` before and after `dateReference`
 * and formats it for a MongoDB filter
 * @param dateReference {Date}
 * @returns {{minDay, maxDay}} The date range period in question.
 */
const excludeDays = (dateReference) => {
    let minDay = subDays(dateReference, parseInt(process.env.CASE_DAYS_EXLUDE));
    let maxDay = addDays(dateReference, parseInt(process.env.CASE_DAYS_EXLUDE));

    return {minDay: minDay, maxDay: maxDay};
};

const nextDay = date => {
    return skipTime(date, parseInt(process.env.MINS_IN_A_DAY));
}

const skipTime = (date, minutes = parseInt(process.env.NIGHT_OUT_START)) => {
    return addMinutes(date, minutes);
}

const rewindTime = (date, num_of_days) => {
    return subDays(date, num_of_days);
}

const findNearPOI = (currentPOI, allPOIs, timestamp) => {
    const maxDistance = getRandomIntInclusive(1000 + parseInt(process.env.MAX_DISTANCE));
    let poolPOIs = allPOIs.filter(x => x !== currentPOI && haversine(x.coordinates, currentPOI.coordinates) < maxDistance);
    const newPOI = poolPOIs[getRandomIntInclusive(poolPOIs.length - 1)];
    if (!newPOI) return {
        break: true
    }
    const distance = Math.ceil(haversine(newPOI.coordinates, currentPOI.coordinates));

    const walkTime = Math.ceil(distance / parseInt(process.env.WALK_SPEED));
    const stayTime = getRandomIntInclusive(parseInt(process.env.MIN_STAY_TIME) + parseInt(process.env.MAX_STAY_TIME));
    timestamp = skipTime(timestamp, stayTime + walkTime);

    return {
        poi: newPOI, time: timestamp
    }
}

const runAggregate = async (collection, agg) => {
    const coll = getCollection(collection)
    let aggCursor = coll.aggregate(agg);
    return await aggCursor.toArray();
}

const checkHash = (given, existing) => {
    return bcrypt.compareSync(given, existing);
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

module.exports = {
    getRandomIntInclusive,
    getRandomDayInRange,
    getCollection,
    excludeDays,
    skipTime,
    checkHash,
    hashIt,
    nextDay,
    findNearPOI,
    runAggregate,
    rewindTime
};
