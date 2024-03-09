require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 3000;
const connect = require('./db');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const moment = require('moment');
connect();

const User = require('./schemas/User')
const Task = require('./schemas/Task')

app.use(bodyParser.json());

// Create a new user
app.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;
    if (email.length < 5 || password.length < 5 || username.length < 5) {
        return res.status(200).send("input lnegth too short");
    }
    else {
        const doesExist = await User.findOne({ username: username });
        if (doesExist) {
            return res.status(200).send("user exists");
        }
        try {
            const user = new User({
                email,
                username,
                password
            })
            await user.save();
            return res.status(200).send(user);
        } catch (error) {
            return res.status(200).send("failed");
        }
    }
})

//login user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(200).send("user not found");
        }
        else if (user.password === password) {
            jwt.sign(
                { user },
                secretKey,
                {
                    expiresIn: "86400s"
                },
                (err, token) => {
                    if (err) {
                        return res.status(400).send("token not generated");
                    }
                    return res.status(200).send({
                        "user": user,
                        "token": token
                    })
                }
            )
        }
        else {
            return res.status(200).send("password incorrect");
        }
    } catch (error) {
        return res.status(200).send("server error");
    }
})

//create a task
app.post('/task/:userId', verifyToken, async (req, res) => {
    jwt.verify(req.token, secretKey, async (err, authData) => {
        if (err) {
            return res.status(200).send("token not verified");
        }
        else {
            const { userId } = req.params;
            const { title, category } = req.body;
            try {
                const task = new Task({
                    title: title,
                    category: category,
                    createdByUser: userId,
                    dueAt: moment().format('YYYY-MM-DD')
                })
                await task.save();
                return res.status(200).send(task);
            } catch (error) {
                return res.status(200).send("failed to save task");
            }
        }
    })
})

//edit task
app.post('/edit-task/:taskId', verifyToken, async (req, res) => {
    jwt.verify(req.token, secretKey, async (err, authData) => {
        if (err) {
            return res.status(200).send("token not verified");
        }
        else {
            const { taskId } = req.params;
            const { title, category } = req.body;
            try {
                const task = await Task.findByIdAndUpdate(
                    taskId,
                    {
                        title: title,
                        category: category,
                        dueAt: moment().format('YYYY-MM-DD')
                    }
                );
                return res.status(200).send(task);
            } catch (error) {
                return res.status(200).send("failed to update task");
            }
        }
    })
})


//fetch all users tasks
app.post('/task/:userId/:taskName', verifyToken, async (req, res) => {
    jwt.verify(req.token, secretKey, async (err, authData) => {
        if (err) {
            return res.status(200).send("token not verified");
        }
        else {
            const { userId, taskName } = req.params;
            if (taskName === "All") {
                try {
                    const tasks = await Task.find({ createdByUser: userId });
                    return res.status(200).send(tasks);
                } catch (error) {
                    return res.status(200).send("failed to fetch tasks");
                }
            }
            else {
                try {
                    const tasks = await Task.find({ createdByUser: userId, category: taskName });
                    return res.status(200).send(tasks);
                } catch (error) {
                    return res.status(200).send("failed to fetch tasks");
                }
            }
        }
    })
})

//delete a task
app.delete('/task/:taskId', verifyToken, async (req, res) => {
    jwt.verify(req.token, secretKey, async (err, authData) => {
        if (err) {
            return res.status(200).send("token not verified");
        }
        else {
            const { taskId } = req.params;
            try {
                const task = await Task.findByIdAndDelete(taskId);
                return res.status(200).send("task deleted successfully");
            } catch (error) {
                return res.status(200).send("failed to delete task");
            }
        }
    })
})

//update task status
app.post('/set-completed/:taskId', verifyToken, async (req, res) => {
    jwt.verify(req.token, secretKey, async (err, authData) => {
        if (err) {
            return res.status(200).send("token not verified");
        }
        else {
            const { taskId } = req.params;
            try {
                const task = await Task.findByIdAndUpdate(taskId, { status: "completed" });
                return res.status(200).send("task updated successfully");
            } catch (error) {
                return res.status(200).send("failed to update task");
            }
        }
    })
})

//search task title
app.post('/search-task/:userId/:taskName', verifyToken, async (req, res) => {
    jwt.verify(req.token, secretKey, async (err, authData) => {
        if (err) {
            return res.status(200).send("token not verified");
        }
        else {
            const { userId, taskName } = req.params;
            try {
                const tasks = await Task.find({ createdByUser: userId});
                const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(taskName.toLowerCase()));
                return res.status(200).send(filteredTasks);
            } catch (error) {
                return res.status(200).send("failed to fetch tasks");
            }
        }
    })
})



function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else {
        res.status(200).send("token not found");
    }
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});