import jwt from 'jsonwebtoken';
import { keyJW } from '../config.js';

export default (req, res, next) => {
    // const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    const token = (req.cookies.token || '');
    const secKey = keyJW();

    if (token) {
        try {
            const decoded = jwt.verify(token, secKey);

            req.userId = decoded._id;
            next();
        } catch (err) {
            return res.status(404).json({
                message: 'Доступ запрещен',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Доступ запрещен',
        })
    }
}