const express = require('express');
const router = express.Router();
const controller = require('../controllers/searchLog.controller');
const upload = require('../utils/multer');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', upload.single('file'), controller.create);
router.put('/:id', upload.single('file'), controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
