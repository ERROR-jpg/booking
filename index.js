import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from './routes/auth.js';
import usersRoute from './routes/users.js';
import hotelsRoute from './routes/hotels.js';
import roomsRoute from './routes/rooms.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


try{
   await mongoose.connect(process.env.MONGO, {usenewUrlParser: true, useUnifiedTopology: true});
    console.log('Connected to MongoDB');
}catch(error){
    throw error;
}

app.get("", (req, res) => {
    res.send("Hello World");
    });


    
mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
});

mongoose.connection.on("connected", () => {
    console.log("connected to MongoDB");
});

app.use(cookieParser());
app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/hotels', hotelsRoute);
app.use('/api/rooms', roomsRoute);

app.use((err, req, res, next)=>{
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
});


app.listen(process.env.PORT || 3000,()=>console.log("Listening port 3000"));