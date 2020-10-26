const express = require("express");
const axios = require("axios");
let router = express.Router();

router.post("/", (req, res) => {
  console.log(req.body.url);
  console.log(req.body.params);
  console.log(req.body.headers);
  if (req.body.method === "GET") {
    axios
      .get(req.body.url, { params: req.body.params, headers: req.body.headers })
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response) res.json(error.response.data);
        else {
          res.status(500);
        }
      });
  } else {
    res.json({
      message: "POST method not supported currently. **Work in progress**",
    });
  }
});

module.exports = router;
