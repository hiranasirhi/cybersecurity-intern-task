const express = require('express');
const router = express.Router();
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserDAO = require('../data/user-dao').UserDAO;

function AuthHandler(db) {
    const users = new UserDAO(db);

    router.post('/signup', async (req, res) => {
        const { username, email, password } = req.body;

        if (!validator.isEmail(email)) return res.status(400).send('Invalid email');
        if (!validator.isAlphanumeric(username)) return res.status(400).send('Invalid username');
        if (!validator.isStrongPassword(password)) return res.status(400).send('Weak password');

        const hashedPassword = await bcrypt.hash(password, 10);

        users.addUser({ username, email, password: hashedPassword }, (err) => {
            if (err) return res.status(500).send('Error creating user');
            res.status(201).send('User created');
        });
    });

    router.post('/login', async (req, res) => {
        const { email, password } = req.body;

        users.getUserByEmail(email, async (err, user) => {
            if (err || !user) return res.status(401).send('User not found');
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).send('Invalid credentials');

            const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1h' });
            res.send({ token });
        });
    });

    return router;
}

module.exports = AuthHandler;
