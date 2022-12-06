import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Слишком короткий пароль').isLength({min: 5}),
]

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Слишком короткий пароль').isLength({min: 5}),
    body('name', 'Введите корректное имя').isLength({min: 2}),
    body('avatarUrl', 'Некорректная ссылка аватарки').optional().isString(),
]