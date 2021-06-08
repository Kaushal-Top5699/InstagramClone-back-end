const mongoose = require('mongoose')
require('mongoose-long')(mongoose)
var Long = mongoose.Schema.Types.Long
const Schema = mongoose.Schema

const postSchema = new Schema({
    postImage: {
        type: String,
        default: "Image link"
    },
    caption: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    userProfileImage: {
        type: String,
        required: true,
        default: 'Image Link'
    },
    postLikes: [{
        likerUID: {
            type: Schema.Types.ObjectId,
            default: "No Value yet"
        }
    }],
    date: {
        type: String,
        required: true
    },
    userID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    comments: [{
        comment: {
            type: String,
            default: "No Comments"
        }
    }],
    timestamp: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const Post = mongoose.model('Post', postSchema)

module.exports = Post
