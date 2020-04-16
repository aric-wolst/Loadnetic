const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateEmail(user) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    user.email = !isEmpty(user.email) ?  user.email : "";
    user.name = !isEmpty(user.name) ?  user.name : "";

    // Email checks
    if (Validator.isEmpty(user.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(user.email)) {
        errors.email = "Email is invalid";
    } else if (Validator.isEmpty(user.name)) {
        errors.name = "Name field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};