const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/account", (req, res) => {
  let account = req.body;

  fs.readFile("accounts.json", "utf8", (err, data) => {
    if (!err) {
      try {
        let json = JSON.parse(data);
        json = {
          id: json.nextId++,
          ...account,
        };
        json.accounts.push(account);
        fs.writeFile(
          "accounts.json",
          JSON.stringify(account, null, 2),
          (err) => {
            if (err) return res.send(err);
            res.send("post account");
          }
        );
      } catch (err) {
        res.status(400).send({ error: err.message });
      }
    }
  });
});

app.listen(3000, () => {
  try {
    fs.readFile("accounts.json", "utf8", (err) => {
      if (err) {
        const initialJson = {
          nextId: 1,
          accounts: [],
        };
        fs.writeFile(
          "accounts.json",
          JSON.stringify(initialJson, null, 2),
          (err) => console.log(err)
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
  console.log("API Started on Port 3000");
});
