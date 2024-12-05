const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    return res.render('index', { title: 'Home' });
});

router.get('/register', async (req, res) => {
    return res.render('register', { title: 'Register' });
});

router.get('/login', async (req, res) => {
    return res.render('login', { title: 'Login' });
});

router.get('/welcome', async (req, res) => {
    return res.render('welcome', { title: 'Welcome' });
});

router.get('/chooseRoute', async (req, res) => {
    return res.render('chooseRoute', { title: 'Choose Route' });
});

router.get('/about', async (req, res) => {
    return res.render('about', { title: 'About' });
});

router.get('/myprofile', async (req, res) => {
    return res.render('profile', { title: 'My Profile' });
});

router.get('/MyWorkouts', async (req, res) => {
    return res.render('MyWorkouts', { title: 'My Workouts' });
});

// Feature 3

router.get('/map', async (req, res) => {
    const id = req.query.id;  
    return res.render('mapScreen', { title: 'Map', id: id });
});

router.get('/list', async (req, res) => {
    return res.render('listView', { title: 'List' });
});


// router.get('/customer', auth, checkRole('customer'), async (req, res) => {
//     return res.render('customer', { title: 'Customer' });
// });

module.exports = router;