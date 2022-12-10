export default (req, res, next) => {
    try {
        const email = (req.body.email);
        console.log(email);
        next();
    } catch (error) {
        return res.status(403).json({
            message: 'Пользователь с таким emial существует!'
        })
    }
}