var express = require('express');
var router = express.Router();

// Require controllers
const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.rootGet);

router.post('/savenote', indexController.saveNotePost);
router.post('/quicksavenote', indexController.quickSaveNotePost);
router.post('/updatenote', indexController.updateNotePost);
router.post('/deletenote', indexController.deleteNotePost);

router.get('/notes', indexController.notesGet);
router.get('/notes/:noteName', indexController.noteGet);

router.get('/login', indexController.loginGet)
router.post('/login', indexController.loginPost);

router.post('/signup', 
  indexController.signupPost,
  indexController.loginPost
);

router.get('/logout', indexController.logoutGet);

module.exports = router;
