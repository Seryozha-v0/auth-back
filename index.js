import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { registerValidation, loginValidation } from './validations/auth.js';

//utils
import {checkAuth, handleValidationErrors} from './utils/index.js';

//controllers
import * as userController from './controllers/userController.js'

mongoose
    .connect(
        'mongodb+srv://admin:q12345678@cluster0.3fzjy4o.mongodb.net/auth?retryWrites=true&w=majority', 
        {maxPoolSize: 10}
    )
    .then(() => {
        console.log('DB is OK');
    })
    .catch((err) => {
        console.log('DB error', err);
    });


const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


const cookieKey = 'gfryw439829wjdaskdjfhbr321';
app.use(cookieParser(cookieKey));

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage});

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.post('/auth/register', registerValidation, handleValidationErrors, userController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, userController.login);
app.get('/auth/me', checkAuth, userController.getMe);
app.get('/auth/logout', userController.logOut);

app.listen(process.env.PORT || 4400, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server is OK');
});

