require('dotenv').config();
require('./config/database').connect();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('./middleware/auth');
const User = require('./model/user');

const app = express();
app.use(express.json());

// Login function


// Register function
app.post('/register', async (req, res) => {


    try {
        const { firstName, lastName, email, password } = req.body

        // Validate user input
        if (!(email && password && firstName && lastName)) {
            res.status(400).send('The all input is required')
        }

        // check user in our database
        const oldUser = await User.findOne({ email })

        if (oldUser) {
            return res.status(409).send('User already exist. Please login')
        }

        // Encrypt user password
        enecryptPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: enecryptPassword
        });

        // Create token
        const token = jwt.sign(
            { userID: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h"
            }
        )

        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);

    } catch (err) {
        console.log(err);
    }   
})

// Login function
app.post('/login', async (req, res) => {

    try {
        // get user input
        const { email, password } = req.body

        // Validate user input
        if (!(email && password)) {
            res.status(400).send('The all input is required');
        }

        // Validate user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create Token
            const token = jwt.sign(
                { userID: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            )

            // Save Token
            user.token = token;
            res.status(200).json(user)
        }

        res.status(400).send("Invalid User");

    } catch (err) {
        console.log(err);
    }
    
})

app.post('/welcome', auth, (req, res) => {
    res.status(200).send('Welcome....!!')
})

module.exports = app;