var express = require('express');
var router = express.Router();
const controllers = require('../controllers/api')

/* GET users listing. */
router.get('/posts', controllers.posts);
router.get('/photos', controllers.photos);

module.exports = router;