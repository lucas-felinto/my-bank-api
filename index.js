const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/account", (req, res) => {
  fs.writeFile("accounts.json", JSON.stringify(req.body, null, 2), (err) => {
    console.log(err);
  });
});

app.listen(3000, () => {
  console.log("API Started on Port 3000");
});
