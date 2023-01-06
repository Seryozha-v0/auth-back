import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        imageUrl: String,
        videoSrc: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        watchedCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timeseries: true,
    },
);

export default mongoose.model('Video', VideoSchema);