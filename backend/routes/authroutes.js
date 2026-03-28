const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const authController = require("../controllers/authcontroller");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Register and Login APIs
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rishabh
 *               email:
 *                 type: string
 *                 example: rishabh@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User ban gaya, token mila
 *       400:
 *         description: Validation error ya email already exists
 */
router.post('/register', [
    body('name')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
        .trim()
        .escape(),
    body('email')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .trim(),
], authController.register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login 
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: rishabh@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful, token mila
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', [
    body('email')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .trim(),
], authController.login);


/**
 * @swagger
 * /api/v1/auth/google:
 *   post:
 *     summary: Login or Register with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [credential]
 *             properties:
 *               credential:
 *                 type: string
 *                 description: Google ID token received from frontend
 *                 example: eyJhbGciOiJSUzI1NiIsImtpZ...
 *     responses:
 *       200:
 *         description: Returns JWT token — works for both new and existing users
 *       400:
 *         description: Invalid or missing Google token
 */
router.post('/google', authController.googleAuth);





/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Check your profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Token nahi hai
 */
router.get('/me', auth, authController.getMe);

module.exports = router;