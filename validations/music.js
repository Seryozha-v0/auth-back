import { body } from 'express-validator';

export const musicValidation = [
    body('title', 'Введите название').isString(),
    body('autor', 'Введите имя автора или название группы').isString(),
    body('imageUrl', 'Некорректная ссылка на картинку').optional().isString(),
    body('musicUrl', 'Некорректная ссылка на музыку').optional().isString(),
]