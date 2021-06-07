// Require Middleware
const { body, validationResult } = require('express-validator');

exports.loginVS = [
    body('username').trim().escape(),
    body('password').trim().escape(),
    (req, res, next) => next()
];

exports.noteVS = [
    body('name').trim().escape(),
    body('body').optional().escape(),
    body('previousName').optional().escape(),
    (req, res, next) => next()
];