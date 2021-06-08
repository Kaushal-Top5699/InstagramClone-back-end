const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')


//REST API for user-signUP
router.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {

        const existingUser = await User.findEmail(req.body.email)
        if (existingUser) {
            return res.status(400).send('User already exists')
        }
        await user.save()
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

//REST API for user login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

//REST API for user logout
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send('Logout Successfully!')
    } catch (error) {
        res.status(500).send(error)
    }
})

//REST API for user profile
router.get('/me', auth, async (req, res) => {

    try {
        // const _id = req.user.id
        // const user = await User.find({ userID: _id })
        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }

})

//REST API for listing all users
router.get('/all-users', auth, async (req, res) => {

    try {
        var users = await User.find({ _id: { $ne: req.user._id } })
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
})

// users = users.filter((user) => {
//     console.log(user._id, req.user._id)
//     console.log(user._id != req.user._id)
//     return user._id.toString() != req.user._id.toString()
// })

router.post('/view-user', auth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.body._id })
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.status(200).send(user)

    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router