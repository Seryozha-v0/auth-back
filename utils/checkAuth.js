import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    // const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    const token = (req.cookies.token || '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secretKey47839');

            req.userId = decoded._id;
            next();
        } catch (err) {
            return res.status(404).json({
                message: 'Доступ запрещен',
            });
        }
    } else {
        return res.status(405).json({
            message: 'Доступ запрещен',
        })
    }
}