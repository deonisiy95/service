import express from 'express';
import mongoose from 'mongoose';
import config from './config';
import bodyParser from 'body-parser';
const app = express();
import './src/models';
import routes from './routes';

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
