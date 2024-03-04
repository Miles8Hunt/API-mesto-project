import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { createUser, login } from './controllers/users';
import { requestLogger, errorLogger } from './middlewares/loggers';
import auth from './middlewares/auth';
import router from './routes/index';
import serverError from './errors/serverError';
import userRequest from './middlewares/validation/userRequestValidation';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', userRequest.loginValidation, login);
app.post('/signup', userRequest.createUserValidation, createUser);

app.use(auth);

app.use('/', router);
app.use(errorLogger);
app.use(errors());
app.use(serverError);

app.listen(PORT);
