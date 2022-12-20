import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

//validation
import { validationResult } from 'express-validator';

//Models import
import UserModel from '../models/User.js';


export const register =  async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }


        const emailCheck = await UserModel.findOne({email: req.body.email});

        if (emailCheck) {
            return res.status(403).json({
                message: 'Электронная почта уже используется!',
            });
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            name: req.body.name,
            passwordHash: hash
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, 
        'secretKey47839',
        {
            expiresIn: '14d',
        });

        const {passwordHash, ...userData} = user._doc;

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1209600,
            path: '/'
        });
        res.json({
            ...userData,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать пользователя'
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return req.status(404).json({
                message: 'Неверный логин или пароль',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return req.status(400).json({
                message: 'Неверный логин или пароль',
            })
        }

        const token = jwt.sign({
            _id: user._id,
        }, 
        'secretKey47839',
        {
            expiresIn: '14d',
        });

        const {passwordHash, ...userData} = user._doc;

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1209600,
            path: '/'
        });
        res.json({
            ...userData,
        });

    } catch (err) {
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }

        const {passwordHash, ...userData} = user._doc;

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        });
    }
};

export const logOut = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Произошла ошибка, повторите попытку'
        });
    }
}