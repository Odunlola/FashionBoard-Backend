
// DEPENDENCIES
// get .env variables
require("dotenv").config();
const PORT = process.env.PORT || 4000;
// import express
const express = require("express");
// create application object
const app = express();
const brandRouter = require("./controllers/brands")
const userController = require('./controllers/users');

// import middleware
const cors = require("cors"); 
const morgan = require("morgan");


// MiddleWare

app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging

const {brands} = require('./models/brands')

app.use(express.json()); // parse json bodies

app.use("/brands", brandRouter);
app.use('', userController);

// create a test route
app.get("/", (req, res) =>  {
  res.json(brands)
})

app.use("/brands", brandRouter);
app.use('', userController);

app.get('/*', (req, res) => {
    res.json({comment: "This is a bad URL"});
})


// LISTENER
app.listen(PORT, () => {
  console.log(`$ 💲 ＄ Server is listening to PORT ${PORT} 🤑 💵 💰`)
})