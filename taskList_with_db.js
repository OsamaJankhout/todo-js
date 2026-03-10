console.log("Server has started");

const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the tasks list made by Osama Jankhout!");
});

app.get("/tasks", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tasks ORDER BY taskid ASC");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error getting the tasks:", error.message);
        res.status(500).json({ message: "Failed to get the tasks" });
    }
});

app.post("/tasks", async (req, res) => {
    try {
        const { desc } = req.body;

        if (!desc) {
            return res.status(400).json({ message: "A description is required" });
        }

        const result = await pool.query(
            "INSERT INTO tasks (description, checked) VALUES ($1, $2) RETURNING *",
            [desc, false]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating the task:", error.message);
        res.status(500).json({ message: "Failed to create task" });
    }
});

app.delete("/tasks/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const result = await pool.query(
            "DELETE FROM tasks WHERE taskid = $1 RETURNING *",
            [id]
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

app.patch("/tasks/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const result = await pool.query(
            "UPDATE tasks SET checked = true WHERE taskid = $1 RETURNING *",
            [id]
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
