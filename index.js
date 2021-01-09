const express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var fs = require("fs");
var QRCode = require("qrcode");

const PORT = 8888;

var app = express();
app.set("view engine", "html");
app.use(bodyParser.json({ limit: "50mb" }));
// parse requests of content-type - application/json
//app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true, keepExtensions: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(function (req, res, next) {
  //allow cross origin requests
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PUT, OPTIONS, DELETE, GET"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const logger = function (req, res, next) {
  //console.log(req)
  next();
};

app.use(logger);

app.get("/", (req, res) => {
  templatePath = path.join(__dirname + "/code.html");
  fs.readFile(templatePath, { encoding: "utf-8" }, function (err, data) {
    // data = data.replace(/##qUrl/g, url);
    res.send(data);
  });
});

app.post("/generateQR", (req, res) => {
  QRCode.toDataURL(
    // "https://xd.adobe.com/view/0cff449d-b942-4099-9f35-513e59e46105-59ac/?fullscreen",
    req.body.qrCodeURL,
    { scale: 15 },
    function (err, url) {
      templatePath = path.join(__dirname + "/code.html");
      fs.readFile(templatePath, { encoding: "utf-8" }, function (err, data) {
        data = data.replace(/##qUrl/g, url);
        res.send(data);
      });
    }
  );
});

app.listen(PORT, () => console.log("QR Code generation on the port: " + PORT));
