const express = require('express')
const router = new express.Router()
const Post = require('../models/post')
const auth = require('../middleware/auth')
const mongoose = require('mongoose')
require('mongoose-long')(mongoose)
const { Types: { Long } } = mongoose

const getDate = function () {
    var date = new Date()
    var formattedString = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()
    return formattedString
}

//REST API to create a new post
router.post('/new-post', auth, async (req, res) => {
    const post = new Post({
        ...req.body,
        username: req.user.username,
        userProfileImage: req.user.profileImage,
        userID: req.user._id,
        date: getDate(),
        timestamp: Number(new Date().getTime().toString())
    })
    req.user.posts += 1
    await req.user.save()

    try {
        await post.save()
        res.status(201).send(post)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/get-post', auth, async (req, res) => {

    try {
        const post = await Post.find({ _id: req.query['id'] })
        res.status(200).send(post[0])

    } catch (error) {
        res.status(400).send(error)
    }

})

//REST API to view all posts
router.get('/view-all-posts', auth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        const timestamp = Number(req.query.timestamp.toString())

        if (timestamp == 0) {

            const posts = await Post.find().sort({ timestamp: -1 }).limit(limit)
            const postUID = []
            posts.forEach(element => {
                postUID.push(element._id)
            })

            res.status(201).send({
                posts: postUID,
                timestamp: posts.length > 0 ? posts[posts.length - 1].timestamp : -1
            })

        } else {

            //console.log(await Post.where('timestamp').lt('1623176318096').sort({ timestamp: -1 }).limit(limit))

            const posts = await Post.where('timestamp').lt(timestamp.toString()).sort({ timestamp: -1 }).limit(limit)
            const postUID = []
            posts.forEach(element => {
                postUID.push(element._id)
            })

            res.status(201).send({
                posts: postUID,
                timestamp: posts.length > 0 ? posts[posts.length - 1].timestamp : -1
            })
        }

    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
})

module.exports = router