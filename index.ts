import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config';
const app = express();
import './src/models';
import routes from './routes';
import csp from './src/middleware/csp';

app.use(bodyParser.json());
app.use(csp);
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
