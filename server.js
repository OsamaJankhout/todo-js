console.log("Server has stared");
//imports the express library and stores it inside a variable called 'express'
const express = require('express');
//this is the server everything will happen through it 
const app = express();
//this is the middleware. it handles requests that contain JSON in the body and parses it in the req.body().
app.use(express.json());

//list of tasks. 
let tasks = [
    {id: 1, desc: "Buy milk", checked: false},
    {id: 2, desc: "Go home", checked: false},
    {id: 3, desc: "Drink milk", checked: false}
]

let nextId = 4;

app.get("/", (req, res) => {
    res.send("Welcome to the tasks list made by Osama Jankhout!");
});


//will return the list of tasks for the user based on the request if wanted to go to /tasks and the status is set to 200
app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

app.post("/tasks", (req, res) => {
  
    const {desc} = req.body;

    if(!desc){
        return res.status(400).json({message: "A description is required"});
    }

    const newTask = {
        id: nextId,
        desc: desc,
        checked: false
    };

    tasks.push(newTask);
    nextId++;

    res.status(201).json(newTask);

    return newTask
});

app.delete("/tasks/:id", (req, res) => {//since we're deleting a specific task we need an ID in the URL
    const id = parseInt(req.params.id); //we convert the string to an int

    const taskIndex = tasks.findIndex(tasks => tasks.id === id);

    if(taskIndex === -1){
        return res.status(404).json({message: "Task was not found"});
    }

    tasks.splice(taskIndex, 1);

    res.status(200).json({message: "Task deleted successfully"});
});

app.patch("/tasks/:id", (req, res) => {//since we're deleting a specific task we need an ID in the URL
    const id = parseInt(req.params.id); //we convert the string to an int

    const taskIndex = tasks.find(tasks => tasks.id === id);

    if(!taskIndex){
        return res.status(404).json({message: "Task was not found"});
    }

   taskIndex.checked = true; 

   res.status(200).json(tasks);
});

//this is the port in which will be listening for requests.
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


//testing: 

//GET: 
//paste the URL with /tasks


//POST: 
/*
{
  "desc": "Study Express"
}
*/


//DELETE AND PATCH: 
//put the URL  with the ID you want to delete like /tasks/2