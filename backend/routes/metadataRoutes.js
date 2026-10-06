const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Laboratories
router.get('/laboratories', async (req, res, next) => {
  try {
    const rows = await db.query('SELECT * FROM laboratories ORDER BY id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

// Categories
router.get('/categories', async (req, res, next) => {
  try {
    const rows = await db.query('SELECT * FROM categories ORDER BY id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

// Users
router.get('/users', async (req, res, next) => {
  try {
    const rows = await db.query('SELECT * FROM users ORDER BY id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
