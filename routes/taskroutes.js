const express = require("express");

const {body} = require('express-validator');

const router = express.Router();

const taskController = require("../controllers/taskcontroller");
const auth = require("../middleware/auth");

//protect all routes
router.use(auth);


//create tasks
router.post('/',[
    body('title').notEmpty().withMessage('Title is required'),
    body('status').optional().isIn(["todo","in progress","done"]),
    body('priority').optional().isIn(["low","medium","high"])
], taskController.createTask);

//get all tasks

router.get('/' , taskController.getAllTasks);

router.get('/:id' , taskController.getTask);

router.put('/:id' , [
    body('status').optional().isIn(["todo","in progress","done"]),
    body('priority').optional().isIn(["low","medium","high"])
] , taskController.updateTask);

router.delete('/:id' , taskController.deleteTask);

module.exports = router;