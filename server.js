require ('dotenv').config();


const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require('./routes/authroutes');
const taskRoutes = require('./routes/taskroutes');
const app = express();


const port = process.env.port;

connectDB(process.env.mongoUri);


app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/tasks", taskRoutes);



app.get("/health" , (req,res) => {
    res.json({message : "server is up and running"});
});


app.listen(port , () => {
    console.log(`server stared at port : ${port}`);
});
