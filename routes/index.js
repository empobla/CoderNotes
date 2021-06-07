var express = require('express');
var router = express.Router();

// Require controllers
const indexController = require('../controllers/indexController');
const validationController = require('../controllers/validationController');

/* GET home page. */
router.get('/', indexController.rootGet);

router.post('/savenote', validationController.noteVS, indexController.saveNotePost);
router.post('/quicksavenote', validationController.noteVS, indexController.quickSaveNotePost);
router.post('/updatenote', validationController.noteVS, indexController.updateNotePost);
router.post('/deletenote', validationController.noteVS, indexController.deleteNotePost);

router.get('/notes', indexController.notesGet);
router.get('/notes/:noteName', indexController.noteGet);

router.get('/login', indexController.loginGet)
router.post('/login', validationController.loginVS, indexController.loginPost);

router.post('/signup',
  validationController.loginVS,
  indexController.signupPost,
  indexController.loginPost
);

router.get('/logout', indexController.logoutGet);

module.exports = router;
