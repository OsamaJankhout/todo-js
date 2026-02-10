//this is the task list where we will be storing all of our tasks
let tasks = [
    {id: 1, desc: "Buy milk", checked: false},
    {id: 2, desc: "Go home", checked: false},
    {id: 3, desc: "Drink milk", checked: false}
]

//an incremental counter for inserting new tasks
let nextId = 4;

//lists all the task(s) information 
function listTasks()
{
    if(tasks.length === 0)
    {
        console.log("The list is empty!");
        return;
    }

    for(let i = 0 ; i < tasks.length ; i++)
    {
        console.log("ID: ", tasks[i].id, "Desc: ", tasks[i].desc, "Checked: ", tasks[i].checked);
    }

    return; 
}

//insertion function to add new entries to the task list
function insertTask(desc)
{   
    console.log("Inserting new task...");
    tasks.push({id: nextId, desc: desc, checked: false}) ;
    nextId = nextId + 1;
    console.log("Task inserted successfully!");
    return; 
}

//function to check whether the task is checked or not. if not checked marks it as true. 
function isChecked(id)
{
  for(let i = 0 ; i < tasks.length ; i++)
  {
    if(id === tasks[i].id)
    {
        console.log("Checking task...");
        tasks[i].checked = true;
        console.log("Checking done!");
        return;
    }
  }

  console.log("Task not found!");
  return; 
}

//function to remove a task from the list of tasks. 
function removeTask(id)
{
    for(let i = 0 ; i < tasks.length ; i++)
  {
    if(id === tasks[i].id)
    {
       console.log("Deleting task...");
       tasks.splice(i, 1);
       console.log("Task deleted successfully!");
       return;
    }
  }

  console.log("Task not found!");
  return; 
}

listTasks();
insertTask("Milk drank");
isChecked(2);
removeTask(1);
listTasks();