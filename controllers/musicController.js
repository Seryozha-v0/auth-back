import MusicModel from '../models/Music.js';

export const getAll = async (req, res) => {
    try {
        const musics = await MusicModel.find(/*{}, {_id: 1, title: 1, autor: 1, imageUrl: 1}*/).populate({
            path: 'user',
            select: 'name',
        }).exec();

        res.json(musics);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Произошла ошибка (musicAll)',
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const musicId = req.params.id;

        MusicModel.findOneAndUpdate(
            {
                _id: musicId,
            },
            {
                $inc: { listenedCount: 1 }
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Произошла ошибка (MusicOneErr)',
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Музыка отсутствует',
                    })
                }

                res.json(doc);
            }
        )
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Произошла ошибка (musicAll)',
        });
    }
}

export const remove = async (req, res) => {
    try {
        const musicId = req.params.id;

        MusicModel.findOneAndDelete(
            {
                _id: musicId,
            },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Не удалось удалить музыку',
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Музыка отсутствует',
                    })
                }

                res.json({
                    success: true,
                })
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Произошла ошибка (musicAll)',
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new MusicModel({
            title: req.body.title,
            autor: req.body.autor,
            imageUrl: req.body.imageUrl,
            musicUrl: req.body.musicUrl,
            metaData: req.body.metaData,
            user: req.userId,
        });

        const music = await doc.save();

        res.json(music);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Произошла ошибка (music)',
        });
    }
}

export const update = async (req, res) => {
    try {
        const musicId = req.params.id;

        await MusicModel.findByIdAndUpdate(
            {
                _id: musicId,
            },
            {
                title: req.body.title,
                autor: req.body.autor,
                imageUrl: req.body.imageUrl,
                musicUrl: req.body.musicUrl,
                user: req.userId,
            },
        )

        res.json({
            success: true,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Произошла ошибка (music)',
        });
    }
}