import VideoModel from '../models/Video.js';

export const getAll = async (req, res) => {
    try {
        const videos = await VideoModel.find().populate({
            path: 'user',
            select: 'name',
        }).exec();

        res.json(videos);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Произошла ошибка (video)',
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const videoId = req.params.id;

        VideoModel.findOneAndUpdate(
            {
                _id: videoId,
            },
            {
                $inc: { watchedCount: 1 }
            },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Произошла ошибка (video)',
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Видео не найдено',
                    })
                }

                res.json(doc);
            }
        )
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Произошла ошибка (video)',
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new VideoModel({
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            videoSrc: req.body.videoSrc,
            user: req.userId,
        });

        const video = await doc.save();

        res.json(video);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Произошла ошибка (video)',
        });
    }
}

export const remove = async (req, res) => {
    try {
        const videoId = req.params.id;

        VideoModel.findOneAndDelete(
            {
                _id: videoId,
            },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Не удалось удалить видео',
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Видео не найдено',
                    })
                }

                res.json({
                    succes: true,
                });
            }
        )
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Произошла ошибка (video)',
        });
    }
}

export const update = async (req, res) => {
    try {
        const videoId = req.params.id;

        await VideoModel.findByIdAndUpdate(
            {
                _id: videoId,
            },
            {
                title: req.body.title,
                imageUrl: req.body.imageUrl,
                videoSrc: req.body.videoSrc,
                user: req.userId,
            },
        )

        res.json({
            succes: true,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Произошла ошибка (video)',
        });
    }
}