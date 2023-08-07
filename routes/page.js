const express = require('express')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
const { Post, User } = require('../models')

const router = express.Router()

router.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.followerCount = req.user ? req.user.Followers.length : 0
    res.locals.followingCount = req.user ? req.user.Followings.length : 0
    res.locals.followerIdList = req.user ? req.user.Followings.map(f=>f.id) : []
    next()
})

router.get('/profile', isLoggedIn, (req, res)=> {
    res.render('profile', {title: '내 정보 - NodeBird'})
})

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {title: '회원가입 - NodeBird'})
})

router.get('/', (req, res, next) => {
    const twits = []
    res.render('main', {
        title: 'NodeBird',
        twits,
    })
})

router.get('/', async(req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick']
            }, 
            order: [['createAt', 'DESC']]
        })
        res.render('main', {
            title: 'NodeBird',
            twits: posts
        })
    } catch (err) {
        console.error(err)
        next(err)
    }
})
module.exports = router