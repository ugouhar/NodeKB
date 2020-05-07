const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/nodekb");

let db = mongoose.connection;
//Check connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//Check for DB errors
db.on("error", err => {
  console.log(err);
});

//Init app
const app = express();
let Article = require("./models/article");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, "public")));

//Home route
app.get("/", (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Articles",
        articles: articles
      });
    }
  });
});

//Add route
app.get("/article/add", (req, res) => {
  res.render("add_articles", {
    title: "Add Articles"
  });
});

//Get single article
app.get("/article/:id", (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render("article", {
      article: article
    });
  });
});

//Add Submit Post Route,  adding article
app.post("/article/add", (req, res) => {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(err => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect("/");
  });
});

//Load edit form
app.get("/article/edit/:id", (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    let temp = article;
    res.render("edit_article", {
      article: temp
    });
  });
});

// Update Submit Post Route,  updating article
app.post("/article/edit/:id", (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = { _id: req.params.id };

  Article.updateOne(query, article, err => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect("/");
  });
});

//Deleting article
app.delete("/article/:id", function(req, res) {
  let query = { _id: req.params.id };

  Article.remove(query, function(err) {
    if (err) {
      console.log(err);
    }
    res.send("Success");
  });
});

//Server started
app.listen(3000, () => {
  console.log("Server started on port 3000...");
});

/*
  Doubts
  If position of add route and get single article functions
  are interchanged we get error in add article
*/
