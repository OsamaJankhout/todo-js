//test
console.log("Server has started");

//pre-requirties for the code to function properly
console.log("Server has started");

require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logAction = require('./logs');

app.use(express.json());

//middleware for security
const authMiddleware = (req, res, next) => {

    try {
        //get the token from the header
        const authHeader = req.headers['authorization'];

        if(!authHeader){
            return res.status(401).json({message: "No token  provided"});
        }

    //format
    const token  = authHeader.split(" ")[1];
    
    if(!token){
        return res.status(401).json({message: "Invalid token format"});

    }

    //verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //attach the user info into the request
    req.user = decoded; 

    next();
}
    catch (error){
    return res.status(401).json({message: " invalid or expired token"});
    }
};

app.get("/", (req, res) => {
    res.send("Welcome to the tasks list made by Osama Jankhout!");
});

app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY taskid ASC');

        await logAction(
            'GET_TASKS',
            req.method,
            req.originalUrl,
            'SUCCESS',
            `Returned ${result.rows.length} task(s)`
        );

        res.status(200).json(result.rows);
    } catch (err) {
        await logAction(
            'GET_TASKS',
            req.method,
            req.originalUrl,
            'ERROR',
            err.message
        );

        res.status(500).json({ message: 'Error retrieving tasks' });
    }
});

app.post("/tasks", authMiddleware, async (req, res) => {
    try {
        const { desc } = req.body;
        const userid = req.user.userid; 

        if (!desc) {
            return res.status(400).json({ message: "A description is required" });
        }

        const result = await pool.query(
            "INSERT INTO tasks (description, checked, userid) VALUES ($1, $2, $3) RETURNING *",
            [desc, false, userid]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating the task:", error.message);
        res.status(500).json({ message: "Failed to create task" });
    }
});

app.delete("/tasks/:id", authMiddleware,async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userid = req.user.userid; 

        const result = await pool.query(
            "DELETE FROM tasks WHERE taskid = $1 AND userid = $2 RETURNING *",
            [id, userid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({
            message: "Task deleted successfully",
            deletedTask: result.rows[0]
        });
    } catch (error) {
        console.error("Error deleting the task:", error.message);
        res.status(500).json({ message: "Failed to delete the task." });
    }
});

app.patch("/tasks/:id", authMiddleware,async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userid = req.user.userid; 

        const result = await pool.query(
            "UPDATE tasks SET checked = true WHERE taskid = $1 AND userid = $2 RETURNING *",
            [id, userid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({
            message: "Task updated successfully",
            updatedTask: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating the task:", error.message);
        res.status(500).json({ message: "Failed to update the task." });
    }
});

app.post("/", async (req, res) => {
try {
    const {username, email, password} = req.body; 
    
    // we want to check for any missing fields 
    if(!username || !email || !password){
    return res.status(400).json({message: "All fields are required input!"});
    }

    //check for duplicated emails
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if(existingUser.rows.length > 0){
        return res.status(400).json({message: "The email already exists"});
    }

    //hash the password for security 
    const hashedPass = await bcrypt.hash(password, 10);

    //all conditions are met = insert the user
    const newUser = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING userid, username, email", [username, email, hashedPass]
    );

    //response

    res.status(201).json({message: "user registered successfully", user: newUser.rows[0]});


}
    catch(error) {
        console.error("Error registering the user: ", error.message);
        res.status(500).json({message: "Failed to register user"});
      }
});

app.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body; 

        //check for missing fields 
        if(!email || !password) {
            return res.status(400).json({message: "Email or password were not provided"});
        }

        //check if the user exists in the DB 
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if(result.rows.length === 0){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const user = result.rows[0];

        //compare the password with the hasehed password stored in the DB 
        const match = await bcrypt.compare(password, user.password);

        if(!match)
        {
            return res.status(400).json({message: "invalid email or password"});        
        }
    
        //create a token for the logged user
        const token = jwt.sign(
            {
                userid: user.userid,
                email: user.email
            },
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        //respond back to the user
        res.status(200).json({message: "Login successful",
            token: token, 
            user: { 
                userid: user.userid,
                username: user.username,
                email: user.email
            }
        });
    }

    catch(error){
      console.error("Error logging the user in:", error.message);
      res.status(500).json({message: "Failed to log you in"});
    }
});

const PORT = 3006;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
