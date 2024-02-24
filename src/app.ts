import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { UserRequest } from './types/types';
import router from './routes/index';
import errors from './errors/serverError';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: UserRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65cdab8b70d8a34696407e5c',
  };
  next();
});

app.use('/', router);
app.use(errors);

app.listen(PORT);
