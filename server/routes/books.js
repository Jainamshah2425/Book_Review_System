const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// GET all books
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBook);

module.exports = router;