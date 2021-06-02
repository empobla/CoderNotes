const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const mongooseBcrypt = require('mongoose-bcrypt');

const noteSubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Note name is required.',
        trim: true
    },
    body: String
}, { _id: false });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'Username is required.',
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: 'Password is required',
        bcrypt: true
    },
    notes: [noteSubSchema]
});

userSchema.plugin(mongooseBcrypt);
userSchema.plugin(passportLocalMongoose, { usernameField: 'username' });

module.exports = mongoose.model('User', userSchema);