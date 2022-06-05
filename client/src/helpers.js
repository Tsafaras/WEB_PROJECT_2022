import bcrypt from "bcryptjs";

const passwordCheck = password => {
    const has_number = /\d/.test(password);
    const has_uppercase = /[A-Z]/.test(password);
    const has_special = /[!@#$%^&*)(+=._-]/.test(password);
    return password.length > 7 && has_number && has_uppercase && has_special;
}
/**
 * Synchronous hashing function. Use case is for password only.
 * @param {String} to_hash what to hash.
 * @returns {String} the hashed result
 */
const hashIt = to_hash => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(to_hash, salt);
}

export {passwordCheck, hashIt};
