const express = require("express");
const { body } = require('express-validator');
const router = express.Router();
const taskController = require("../controllers/taskcontroller");
const auth = require("../middleware/auth");

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task CRUD APIs
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Apni saari tasks dekho
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in progress, done]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Title ya description mein search karo
 *     responses:
 *       200:
 *         description: Tasks ki list
 */
router.get('/', taskController.getAllTasks);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Nayi task banao
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Assignment complete karo
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [todo, in progress, done]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Task ban gayi
 */
router.post('/', [
    body('title').notEmpty().withMessage('Title is required'),
    body('status').optional().isIn(["todo", "in progress", "done"]),
    body('priority').optional().isIn(["low", "medium", "high"])
], taskController.createTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Ek task dekho
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task nahi mili
 */
router.get('/:id', taskController.getTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Task update karo
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [todo, in progress, done]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Task update ho gayi
 */
router.put('/:id', [
    body('status').optional().isIn(["todo", "in progress", "done"]),
    body('priority').optional().isIn(["low", "medium", "high"])
], taskController.updateTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Task delete karo
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task delete ho gayi
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;