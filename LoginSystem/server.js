const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/users");
const port = 8000;
const upload = require("express-fileupload");
const fs = require("fs");

//MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/usersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`MongoDB connected`);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload());

//Get routes
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/file", (req, res) => {
  res.render("file");
});
app.get("/uploadedData", (req, res) => {
  res.render("uploadedData");
});
app.get("/download", (req, res) => {
  res.render("download");
});
app.get("/downloadFile", (req, res) => {
  res.download("./uploads/abc.pdf");
});

// Post routes
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let a = 6;
  let b = Math.random() * 10 ** a;
  const pass = Math.floor(b);

  const newUser = new User({
    email: email,
    password: password,
    pass: pass,
  });
  newUser.save((err) => {
   err ? console.log(`Error: ${err}`) : res.send("Successfully created user");
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }, (err, FoundResults) => {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      if (FoundResults.password === password) {
        fs.appendFile("userData.txt", email, (err, data) => {
          console.log(`Error: ${err}`);
        });
        res.render("file");
      } else {
        res.send("incorrect Email or Password");
      }
    }
  });
});

//Logic for uploading Files
app.post("/file", (req, res) => {
  if (req.files) {
    var file = req.files.file;
    var fileName = file.name;

    file.mv("./uploads/" + fileName, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.render("download");
      }
    });

    fs.appendFile("userData.txt", fileName, (err, data) => {
      console.log(`Error: ${err}`);
    });
  }
});

app.post("/download", (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;

  User.findOne({ email: email }, (err, FoundResults) => {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      if (FoundResults.pass === pass) {
        //  res.send("code matched")
        res.render("uploadedData");
      } else {
        res.send("Secret code is not matching............Try again");
      }
    }
  });
});

//For Server Start
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
