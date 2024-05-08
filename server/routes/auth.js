import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { isAuthenticated } from '../middleware/jwt.js';

dotenv.config();
const router = express.Router();
const saltRounds = 10;

router.post('/signup', (req, res, next) => {
    const { email, password } = req.body;
    // console.log('body', req.body);
    if (email === "" || password === "") {
        res.status(401).json({ message: 'Provide email and password' });
        return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Provide a valid email address." });
        return;
    }
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({
            message:
                "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
        });
        return;
    }

    User.findOne({ email })
        .then((foundUser) => {
            if (foundUser) {
                res.status(400).json({ message: "User already exists" });
                return;
            }
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            return User.create({ email, password: hashedPassword });
        })
        .then((createdUser) => {
            const { email, password, _id } = createdUser;
            res.status(201).json({ email, _id })
        })
        .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (email === "" || password === "") {
        res.status(400).json({ message: "Provide username and password" })
        return;
    }

    User.findOne({ email })
        .then((foundUser) => {
            if (!foundUser) {

                res.status(401).json({ message: "User not found." });
                return;
            }

            const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

            if (passwordCorrect) {
                const { _id, email } = foundUser;
                const payload = { _id, email };

                const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
                    algorithm: "HS256",
                    expiresIn: "6h",
                });
                res.status(200).json({ authToken: authToken });
            } else {
                res.status(401).json({ message: "Unable to authenticate the user" });
            }
        })
        .catch((err) => next(err));
});

router.get("/logout", isAuthenticated, (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).render("/logout", { message: err.message });
            return;
        }
        res.redirect("/")
    });
});

router.put('/update', isAuthenticated, (req, res, next) => {
    const userId = req.payload._id;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({
            message: "New password is required."
        });
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
            message: "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter."
        });
    }

    User.findById(userId)
    .then(foundUser => {
        if(!foundUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedNewPassword = bcrypt.hashSync(newPassword, salt);
        foundUser.password = hashedNewPassword;

        return foundUser.save();
    })
    .then(updateUser => {
        res.status(200).json({message: "User information updated successfully", user: updateUser });
    })
    .catch(err => next(err));
})



router.get("/verify", isAuthenticated, (req, res, next) => {

    // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and is made available on `req.payload`
    res.status(200).json(req.payload);
    // Send back the token payload object containing the user data
});

export default router;
