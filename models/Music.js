import mongoose from "mongoose";

const MusicSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        autor: {
            type: String,
            required: true,
        },
        imageUrl: String,
        musicUrl: {
            type: String,
            required: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        listenedCount: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Music', MusicSchema);