const router = require('express').Router();
const { sendResponse, parseUser } = require('../utilities/Middleware');
const llamaRoutes = require('./llama');

router.use('/api', llamaRoutes);

module.exports = router;
