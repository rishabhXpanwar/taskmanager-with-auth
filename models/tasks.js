const  mongoose  = require("mongoose");

const taskSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId , ref : 'User', required : true
    },
    title : {
        type : String, trim : true , required : true
    },
    description : {
        type : String , trim : true,
    },
    status : {
        type : String , enum : ["todo","in progress","done"], default : "todo"
    },
    priority : {
        type : String , enum : ["low","medium","high"], default : "medium"
    },
    dueDate : Date,
    completedAt : Date,
},
{
    timestamps:true
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;