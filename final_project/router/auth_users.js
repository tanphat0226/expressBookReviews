const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    console.log(username, password);

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required." });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "secretKey", { expiresIn: '1h' });
        req.session.token = token;
        return res.status(200).json({ message: "Login successful!", token });
    } else {
        return res.status(401).json({ message: "Invalid login credentials." });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username; // Get username from the decoded token

    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review added successfully!" });
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
