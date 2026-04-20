// server.js

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    dbName: "USERLOGIN"
})
.then(() => console.log("MongoDB Connected to USERLOGIN"))
.catch((err) => console.log("Mongo Error:", err));

// Schema
const userSchema = new mongoose.Schema({
    name: String,
    password: String
}, {
    versionKey: false
});

// Exact collection = user
const User = mongoose.connection.model("user", userSchema, "user");

// Signup API
app.post("/signup", async (req, res) => {
    try {
        console.log("Signup Request:", req.body);

        const name = req.body.name.trim();
        const password = req.body.password.trim();

        const existingUser = await User.findOne({ name: name });

        if (existingUser) {
            return res.json({
                msg: "User already exists"
            });
        }

        const user = await User.create({
            name: name,
            password: password
        });

        console.log("Inserted:", user);

        res.json({
            msg: "Signup successful"
        });
// new
    } catch (err) {
        console.log("Insert Error:", err);

        res.status(500).json({
            msg: "Failed to signup"
        });
    }
});

// Login API
app.post("/login", async (req, res) => {
    try {
        const name = req.body.name.trim();
        const password = req.body.password.trim();

        const user = await User.findOne({
            name: name,
            password: password
        });

        if (user) {
            res.json({
                msg: "Login successful"
            });
        } else {
            res.json({
                msg: "Invalid name or password"
            });
        }

    } catch (err) {
        console.log(err);
        res.json({
            msg: "Login failed"
        });
    }
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});