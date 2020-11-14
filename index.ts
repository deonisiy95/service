const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();
const bodyParser = require('body-parser');
require('./src/models');
const routes = require('./routes');

app.use(bodyParser.json());
app.use(routes);

mongoose
  .connect(config.DATABASE_URL, {useNewUrlParser: true})
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`Server listening on port ${config.PORT}...`);
    });
  })
  .catch(() => {
    console.log('Error connect db');
  });
