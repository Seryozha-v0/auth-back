import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ffmpeg from 'fluent-ffmpeg';

import { registerValidation, loginValidation } from './validations/auth.js';
import { musicValidation } from './validations/music.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';
import * as userController from './controllers/userController.js';
import * as musicController from './controllers/musicController.js';
import * as videoController from './controllers/videoController.js';
import { keyCookie } from './config.js';
import { videoValidation } from './validations/video.js';

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

const allowedOrigins = ['https://auth-front-eta.vercel.app', 'http://localhost:3000'];
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

app.use('/uploads', cors(corsOptionsDelegate), express.static('uploads'));

const storage = multer.diskStorage({
    destination: (req, __, cb) => {
        const subDir = req.originalUrl;
        cb(null, `uploads${subDir.replace(/\/upload/, '')}`);
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
        url: `/uploads/${req.originalUrl.replace(/\/upload/, '')}/${req.file.originalname}`,
    });
});
app.post('/upload/musics', checkAuth, upload.single('music'), (req, res) => {
    const file = `http://localhost:4400/uploads/${req.originalUrl.replace(/\/upload/, '')}/${req.file.originalname}`;

    ffmpeg.ffprobe(file, (err, meta) => {
        res.json({
            url: `/uploads/${req.originalUrl.replace(/\/upload/, '')}/${req.file.originalname}`,
            metaData: meta.format,
        });
    });
});
app.get('/musics', cors(corsOptionsDelegate), musicController.getAll);
app.get('/musics/:id', cors(corsOptionsDelegate), musicController.getOne);
app.post('/musics', cors(corsOptionsDelegate), checkAuth, musicValidation, musicController.create);
app.delete('/musics/:id', cors(corsOptionsDelegate), checkAuth, musicController.remove);
app.patch('/musics/:id', cors(corsOptionsDelegate), checkAuth, musicController.update);

app.post('/upload/videosPreview', checkAuth, upload.single('image'), (req, res) => {
    const file = `http://localhost:4400/uploads/${req.originalUrl.replace(/\/upload/, '')}/${req.file.originalname}`;

    ffmpeg.ffprobe(file, (err, meta) => {
        res.json({
            url: `uploads/${req.originalUrl.replace(/\/upload/, '')}/${req.file.originalname}`,
            metaData: meta.format,
        });
    })
});
app.post('/upload/videos', checkAuth, upload.single('video'), (req, res) => {
    const file = `http://localhost:4400/uploads/${req.originalUrl.replace(/\/upload/, '')}/${req.file.originalname}`;

    ffmpeg.ffprobe(file, (err, meta) => {
        res.json({
            url: `uploads${req.originalUrl.replace(/\/upload/, '')}/${req.file.originalname}`,
            metaData: meta.format,
        });
    })
});
app.get('/videos', cors(corsOptionsDelegate), videoController.getAll);
app.get('/videos/:id', cors(corsOptionsDelegate), videoController.getOne);
app.post('/videos', cors(corsOptionsDelegate), checkAuth, videoValidation, videoController.create);
app.delete('/videos/:id', cors(corsOptionsDelegate), checkAuth, videoController.remove);
app.patch('/videos/:id', cors(corsOptionsDelegate), checkAuth, videoController.update);

app.listen(process.env.PORT || 4400, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server is OK');
});

export default app;