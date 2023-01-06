import { body } from 'express-validator';

export const videoValidation = [
    body('title', 'Введите название').isString(),
    body('imageUrl', 'Некорректная ссылка на картинку').optional().isString(),
    body('videoSrc', 'Некорректная ссылка на видео').optional().isString(),
]