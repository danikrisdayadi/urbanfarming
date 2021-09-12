import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import logger from 'morgan';
import systemRouter from './routes/systemRouter.js';
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import { ensureAuth, ensureGuest } from './utils/sociallogin.js';

const __dirname = path.resolve();
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

dotenv.config({ path: path.resolve(__dirname, './.env') });

const app = express();
app.use(logger('dev'));
app.use(express.json({ limit: '5mb' }));

mongoose.connect(
    process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// connect.then((db) => {
//     console.log("Connected correctly to server");
// }, (err) => { console.log(err); });


app.use(express.static('public'))
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}))
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    })
)
  // Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Declare Routes
app.use('/users', userRouter);
app.use('/systems', systemRouter);
app.use('/', authRouter);


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running...`)
});
