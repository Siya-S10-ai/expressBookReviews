const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if(!isValid(username)) {
      // Add the new user to the users array Li01Tu02Bo03
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message:"User already exists!"});
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
  try{
    const result = await Promise.resolve(books);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const keys = Object.keys(books);
  const author = req.params.author;
  const result = keys.filter((key) => books[key]["author"] === author)
  .map((key) => ({...books[key], isbn: key}));
  res.send(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const keys = Object.keys(books);
  const title = req.params.title;
  const result = keys.filter((key) => books[key]["title"] === title)
  .map((key) => ({...books[key], isbn: key}));
  res.send(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const review = req.params.isbn;
  res.send(books[review]["reviews"]);
});



module.exports.general = public_users;
