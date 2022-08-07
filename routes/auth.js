const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const authController = require('../controllers/authController')

router.post('/register', authController.register)
router.post('/login', authController.login)

module.exports = router