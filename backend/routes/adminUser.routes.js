const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminUser.controller');



router.post('/', controller.create);       // POST /api/adminUsers   → create user
router.post('/login', controller.login);   // POST /api/adminUsers/login → login user
module.exports = router;
