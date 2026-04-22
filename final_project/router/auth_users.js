const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //Code to check is the username is valid
  let userWithSameName = users.filter((user) => {
     return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password) => { //returns boolean
    // Code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
      return(user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
      return true;
    } else {
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
 const username = req.body.username;
 const password = req.body.password;

 // Check if username or password is missing
 if (!username || !password) {
  return res.status(404).json({ message: "Error logging in" });
 }

 // Authenticate user
 if (authenticatedUser(username, password)) {
  // Generate JWT access token
  let accessToken = jwt.sign({
    data: password
  }, 'access', {expiresIn: 60 * 60 });

  // Store access token and username in session
  req.session.authorization = {
    accessToken, username
  }
  return res.status(200).json({message: "User successfully logged in"});
 }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  let review = req.query.review || req.body.reviews;

  if (books[isbn]) { // Check if book review exists
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "Review added or updated successfully",
      reviews: books[isbn].reviews
    });
  } else {
    res.status(404).json({message: "Unable to find book!"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Extract the isbn from the request URL
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    // Delete review from 'books' object
    delete books[isbn].reviews[username];
    return res.status(200).json({
      message: "Review updated successfully",
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
