import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { registerValidation, loginValidation } from './validations/auth.js';
import { musicValidation } from './validations/music.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';
import * as userController from './controllers/userController.js';
import * as musicController from './controllers/musicController.js';
import { keyCookie } from './config.js';

mongoose
    .connect(
        'mongodb+srv://admin:q12345678@cluster0.3fzjy4o.mongodb.net/auth?retryWrites=true&w=majority',
        { maxPoolSize: 10 }
    )
    .then(() => {
        console.log('DB is OK');
    })
    .catch((err) => {
        console.log('DB error', err);
    });


const app = express();
app.use(express.json());

const allowedOrigins = ['http://localhost:3000', 'https://auth-front-eta.vercel.app'];
const corsOptionsDelegate = (req, cb) => {
    const origin = req.header('Origin');
    let corsOptions;
    
    if (allowedOrigins.indexOf(origin) !== -1) {
        corsOptions = { origin: true, credentials: true }
    } else {
        corsOptions = { origin: false, credentials: true }
    }
    cb(null, corsOptions)
}

const cookieKey = keyCookie();
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

const upload = multer({ storage });

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.post('/auth/register', cors(corsOptionsDelegate), registerValidation, handleValidationErrors, userController.register);
app.post('/auth/login', cors(corsOptionsDelegate), loginValidation, handleValidationErrors, userController.login);
app.get('/auth/me', cors(corsOptionsDelegate), checkAuth, userController.getMe);
app.get('/auth/logout', cors(corsOptionsDelegate), userController.logOut);


app.post('/upload/musicImage', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});
app.post('/upload/music', checkAuth, upload.single('music'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});
app.get('/musics', cors(corsOptionsDelegate), musicController.getAll);
app.get('/musics/:id', cors(corsOptionsDelegate), musicController.getOne);
app.post('/musics', cors(corsOptionsDelegate), checkAuth, musicValidation, musicController.create);
app.delete('/musics/:id', cors(corsOptionsDelegate), checkAuth, musicController.remove);
app.patch('/musics/:id', cors(corsOptionsDelegate), checkAuth, musicController.update);

app.listen(process.env.PORT || 4400, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server is OK');
});

export default app;