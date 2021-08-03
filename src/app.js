const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode.js");
const forecast = require("./utils/forecast.js");

const app = express();

// Define paths for Express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Justin Santos",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Justin Santos",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    message: "I need your help!",
    name: "Justin Santos",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }

  geocode(
    req.query.address,
    (error, { longitude, latitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forecast(longitude, latitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

// Specific Route error handler
app.get("/help/*", (req, res) => {
  res.render("error", {
    title: "404",
    name: "Justin",
    errorMsg: "Help article not found",
  });
});

// Error Handler
app.get("*", (req, res) => {
  res.render("error", {
    title: "404",
    name: "Justin Santos",
    errorMsg: "Page not found",
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
