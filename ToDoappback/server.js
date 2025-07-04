require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
//instance
const app = express();
app.use(express.json())
app.use(cors())
//sample in memory storage
//let todos=[];

//connecting mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log('DB connected')
})
.catch((err)=>{
    console.log(err)
})
//creating schema
const todosSchema =new mongoose.Schema({
    title:{
        required:true,//mongoose will not consider the field is present or not so if you want something to be necessarily present you should create it as the obj and set the required type to ture and type of the obj
        type:String
    },
    description:String
})

//creating model
const todoModel=mongoose.model('Todo',todosSchema);
//define a route
app.post('/todos',async (req,res)=>{
    const  {title , description} =req.body;
    //const newTodo={
    //     id:todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);
    try{
        const newTodo =new todoModel({title,description})//we cant directly push the obj to the db so we save the obj in newTodo and call the function save which save the data in the dB
        await newTodo.save();
        res.status(201).json(newTodo);
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:error.message});
    }
})
//Get all items

app.get('/todos',async (req,res)=>{// this code will return the promise so we need to add the await keyword and set the function to async
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
    }

})

//update a todo item
app.put("/todos/:id",async (req,res)=>{
    try {
        const  {title , description} =req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title,description},//this will basically return the old data so but we need the updated data so we need to add this line
            {new:true}
        )
        if(!updatedTodo){
            return res.status(404).json({message:"Todo not found"})
        }
        res.json(updatedTodo)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
})
//delete a todo item
app.delete("/todos/:id",async(req,res)=>{
    try {
        const id=req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }

})
//start the server
const port= process.env.PORT || 8000;
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
app.listen(port,()=>{
    console.log("Server listening to port "+port);
})
