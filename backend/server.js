require ('dotenv').config();

const setupSwagger = require('./swagger');
const express = require("express");
const cors = require("cors"); // ✅ added
const connectDB = require("./config/db");
const authRoutes = require('./routes/authroutes');
const taskRoutes = require('./routes/taskroutes');
const errorHandler = require('./middleware/errorhandler');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

const port = process.env.port;

connectDB(process.env.mongoUri);

app.use(express.json());

//  CORS middleware
app.use(cors({
    origin: "*",
    credentials: true
}));

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/admin", adminRoutes);

app.get("/health" , (req,res) => {
    res.json({message : "server is up and running"});
});

setupSwagger(app);
app.use(errorHandler);

app.listen(port , () => {
    console.log(`server started at port : ${port}`);
});