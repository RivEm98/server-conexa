var express = require('express');
var router = express.Router();
const controllers = require('../controllers/users')

/* GET users listing. */
router.get('/', controllers.users);
router.post('/', controllers.create);
router.post('/login', controllers.login);

module.exports = router;
