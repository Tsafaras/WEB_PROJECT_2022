const subDays = require("date-fns/subDays");
const addDays = require("date-fns/addDays");
const getRandomIntInclusive = (max) => {
    return Math.floor(Math.random() * (max + 1));
};

const getRandomDayInRange = (date_start, num_of_days) => {
    let whichDay = getRandomIntInclusive(num_of_days);
    return new Date(date_start + whichDay * process.env.MILISEC_IN_A_DAY);
}

const getCollection = (coll_name) => {
    return require('./mongoBot').getCollection(coll_name);
}

/**
 * Calculates a date range period that covers `num_of_days` before and after `dateReference`
 * and formats it for a MongoDB filter
 * @param dateReference {Date}
 * @returns {{minDay, maxDay}} The date range period in question.
 */
const excludeDays = (dateReference) => {
    let minDay = subDays(dateReference, process.env.CASE_DAYS_EXLUDE);
    let maxDay = addDays(dateReference, process.env.CASE_DAYS_EXLUDE);

    return {minDay: minDay, maxDay: maxDay};
}

module.exports = {getRandomIntInclusive, getRandomDayInRange, getCollection, excludeDays, };
