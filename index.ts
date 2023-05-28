import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config';
import './pathAlias';
import './src/models';
import routes from './routes';
import csp from './src/middleware/csp';

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(csp);
app.use(routes);

mongoose
  .connect(config.DATABASE_URL)
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`Server listening on port ${config.PORT}...`);
    });
  })
  .catch(() => {
    console.log('Error connect db');
  });
