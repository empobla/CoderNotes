// Require models
const User = require('../models/user');

// Require packages
const Passport = require('passport');

exports.rootGet = (req, res) => {
    if (!req.user) return res.redirect('/login');
    res.render('index', { title: 'Coder Notes' });
};

exports.loginGet = (req, res) => res.render('login', { title: 'Coder Notes: Login' });

exports.loginPost = Passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
});

exports.signupPost = async (req, res, next) => {
    try {
        //  if (validationErrors.length) return res.render('users/register', { title: 'Gira: Registro', errors: validationErrors });

        console.log('gothere')
        const newUser = new User(req.body);
        User.register(newUser, req.body.password, function (err) {
            if (!err) return next();
            
            console.log('Error while registering.', err);
            return next(err);
        });
    } catch(error) {
        next(error);
    }
};

exports.logoutGet = (req, res) => {
    req.logout();
    res.redirect('/');
};

exports.saveNotePost = async (req, res, next) => {
    try {

        const uniqueNoteName = await User.aggregate([
            { $match: { _id: req.user._id } }, 
            { $project: { _id: 0, notes: 1 } }, 
            { $unwind: { path: '$notes' } }, 
            { $match: { 'notes.name': req.body.name } }
        ]);

        if (uniqueNoteName.length !== 0) return res.status(409).send('Note name is not unique, please change the note\'s name');
        
        const user = req.user;
        user.notes.push({ name: req.body.name, body: req.body.body });
        await User.findByIdAndUpdate(user._id, user, { new: true });
        res.status(201).send('Note saved!');
    } catch(error) {
        console.error('Error saving note: ', error);
        res.status(500).send('Could not save the note, please try again.');
    }
};

exports.quickSaveNotePost = async (req, res, next) => {
    try {
        await User.updateOne(
            { _id: req.user._id, 'notes.name': req.body.name },
            { $set: { 'notes.$.body': req.body.body } },
            { new: true }
        );
        
        res.status(201).send('Note quicksaved!');
    } catch(error) {
        console.error('Error quicksaving note: ', error);
        res.status(500).send('Could not quicksave the note, please try again.');
    }
};

exports.updateNotePost = async (req, res, next) => {
    try {
        await User.updateOne(
            { _id: req.user._id, 'notes.name': req.body.previousName },
            { $set: { 'notes.$.name': req.body.name, 'notes.$.body': req.body.body } },
            { new: true }
        );
        
        res.status(201).send('Note updated!');
    } catch(error) {
        console.error('Error updating note: ', error);
        res.status(500).send('Could not update the note, please try again.');
    }
};

exports.deleteNotePost = async (req, res, next) => {
    try {
        await User.updateOne(
            { _id: req.user._id },
            { $pull: { notes: { name: req.body.name } } },
            { multi: false }
        );

        res.status(201).send('Note deleted!');
    } catch(error) {
        console.error('Error deleting note: ', error);
        res.status(500).send('Could not delete the note, please try again.');
    }
};

exports.notesGet = async (req, res, next) => {
    try {
        const notes = await User.aggregate([
            { $match: { _id: req.user._id } },
            { $project: { notes: 1 } },
            { $unwind: { path: '$notes' } },
            { $sort: { 'notes.name': -1 } },
            { $group: { 
                _id: '$_id', 
                notes: { $push: '$notes.name' } 
            } },
            { $project: { _id: 0 } }
        ]);

        res.render('notes', { title: 'Coder Notes: View Notes', notes: notes.length !== 0 ? notes[0].notes : [] });
    } catch(error) {
        next(error);
    }
};

exports.noteGet = async (req, res, next) => {
    try {
        const note = await User.aggregate([
            { $match: { _id: req.user._id } }, 
            { $project: { _id: 0, notes: 1 } }, 
            { $unwind: { path: '$notes' } }, 
            { $match: { 'notes.name': req.params.noteName } }
        ]);

        res.render('index', { title: `Coder Notes: ${note.name}`, note: note[0].notes });
    } catch(error) {
        next(error);
    }
};