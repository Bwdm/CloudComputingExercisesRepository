// require express and other modules
const express = require("express");
const { Mongoose } = require("mongoose");
const app = express();
// Express Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Static File Directory
app.use(express.static(__dirname + "/public"));

/************
 * DATABASE *
 ************/

const db = require("./models");
const BooksModel = require("./models/books");

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get("/", function homepage(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

/*
 * JSON API Endpoints
 */

app.get("/api", (req, res) => {
  // TODO: Document all your api endpoints below as a simple hardcoded JSON object.
  res.json({
    message: "Welcome to my app api!",
    documentationUrl: "", //leave this also blank for the first exercise
    baseUrl: "", //leave this blank for the first exercise
    endpoints: [
      {
        method: "GET",
        path: "/api",
        description: "Describes all available endpoints",
      },
      { method: "GET", path: "/api/profile", description: "Data about me" },
      {
        method: "GET",
        path: "/api/books/",
        description: "Get All books information",
      },
      {
        method: "POST",
        path: "/api/books/",
        description: "Add Book information to the database",
      },
      {
        method: "PUT",
        path: "/api/books/:id",
        description: "Update a book information based upon the specified ID",
      },
      {
        method: "DELTE",
        path: "/api/books/:id",
        description: "Delete a book based upon the specified ID",
      },
    ],
  });
});
// TODO:  Fill the values
app.get("/api/profile", (req, res) => {
  res.json({
    name: "Geralt of Rivia",
    homeCountry: "Vengerberg",
    degreeProgram: "Witcher from the School of the Wolf", //informatics or CSE.. etc
    email: "geralt.R@gmail.com",
    deployedURLLink: "", //leave this blank for the first exercise
    apiDocumentationURL: "", //leave this also blank for the first exercise
    currentCity: "unknown",
    hobbies: ["Drinking", "Fighting evil"],
  });
});
/*
 * Get All books information
 */
app.get("/api/books/", (req, res) => {
  /*
   * use the books model and query to mongo database to get all objects
   */
  db.books.find({}, function (err, books) {
    if (err) throw err;
    /*
     * return the object as array of json values
     */
    res.json(books);
  });
});
/*
 * Add a book information into database
 */
app.post("/api/books/", (req, res) => {
  /*
   * New Book information in req.body
   */
  console.log(req.body);
  const newBook = new BooksModel(req.body);
  newBook.save((err, book) => {
    res.json(book);
  });
});

/*
 * Update a book information based upon the specified ID
 */
app.put("/api/books/:id", (req, res) => {
  /*
   * Get the book ID and new information of book from the request parameters
   */
  const bookId = req.params.id;
  const bookNewData = req.body;
  console.log(`book ID = ${bookId} \n Book Data = ${bookNewData}`);

  BooksModel.findById(bookId, (err, book) => {
    book.title = bookNewData.title;
    book.author = bookNewData.author;
    book.releaseDate = bookNewData.releaseDate;
    book.genre = bookNewData.genre;
    book.rating = bookNewData.rating;
    book.language = bookNewData.language;

    book.save((err, updatedBook) => {
      res.json(updatedBook);
    });
  });
});

/*
 * Delete a book based upon the specified ID
 */
app.delete("/api/books/:id", (req, res) => {
  /*
   * Get the book ID of book from the request parameters
   */
  const bookId = req.params.id;
  BooksModel.findByIdAndRemove(bookId, (err, book) => {
    res.json(book);
  });
});

/**********
 * SERVER *
 **********/

// listen on the port 3000
app.listen(process.env.PORT || 80, () => {
  console.log("Express server is up and running on http://localhost:80/");
});
