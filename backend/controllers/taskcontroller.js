const Task = require("../models/tasks");

const { validationResult } = require("express-validator");

//create task

exports.createTask = async (req , res ,next ) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty())
        {
           return res.status(400).json({errors : errors.array()});
        }

        let {title,description,status,priority,dueDate} = req.body;

        const task = new Task ({
            user : req.user.id,
            title,
            description,
            status,
            priority,
            dueDate

        });

        await task.save();
        res.status(201).json(task);


    }
    catch(err)
    {
        next(err);
    }
};



//get single task

exports.getTask = async (req,res,next) => {
    try {
        const task = await Task.findOne({_id : req.params.id , user : req.user.id});
        if(!task)
        {
           return res.status(404).json({message : "Task not found"});
        }

        res.json(task);
    }
    catch(err)
    {
        next(err);
    }
};

// update task

exports.updateTask = async (req,res,next) => {
    try {
        const updates = req.body;
        const task = await Task.findOneAndUpdate({_id : req.params.id, user : req.user.id} , updates , {new :true});

        if(!task)
        {
            return res.status(404).json({message : " Task not Found "});
        }

        //if status is changed to done from todo or in progress then
        if(updates.status ==='done' && !task.completedAt)
        {
            task.completedAt = new Date();
            await task.save()
        }

        res.json(task);
    }
    catch(err)
    {
        next(err);
    }
};


// delete task

exports.deleteTask = async (req,res,next) => {
    try{
        const task = await Task.findOneAndDelete({_id : req.params.id , user : req.user.id});
        if(!task)
        {
            return res.status(404).json({message : "Task not Found"});
        }

        res.json(task);
    }
    catch(err)
    {
        next(err);
    }
};





//get all tasks

exports.getAllTasks = async(req,res,next) => {
    try {
        const userId = req.user.id;
        const {status , priority, q} = req.query;
        const filter = {user : userId};

        if(status) filter.status = status;
        if(priority) filter.priority = priority;
        if(q)
        {
            filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter).sort({createdAt : -1});

    res.json({tasks});
    }
    catch(err)
    {
        next(err);
    }

};

