const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    balance: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model("User", UserSchema);

app.get("/", (req, res) => {
    res.send("Cloud Banking API Running");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({
            success: true,
            message: "User Registered"
        });

    } catch (error) {
        res.status(500).json(error);
    }
});

app.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User Not Found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            "banksecret",
            { expiresIn: "1d" }
        );

        res.json({
            token,
            balance: user.balance
        });

    } catch (error) {
        res.status(500).json(error);
    }
});

app.post("/deposit", async (req, res) => {
    const { email, amount } = req.body;

    const user = await User.findOne({ email });

    user.balance += amount;

    await user.save();

    res.json({
        balance: user.balance
    });
});

app.post("/withdraw", async (req, res) => {
    const { email, amount } = req.body;

    const user = await User.findOne({ email });

    user.balance -= amount;

    await user.save();

    res.json({
        balance: user.balance
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});