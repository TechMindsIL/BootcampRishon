const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    return res.render('index', { title: 'Home' });
});

router.get('/chooseRoute', async (req, res) => {
    return res.render('chooseRoute', { title: 'chooseRoute' });
});

router.get('/login', async (req, res) => {
    return res.render('login', { title: 'login' });
});

router.get('/welcome', async (req, res) => {
    return res.render('welcome', { title: 'welcome' });
});

router.get('/register', async (req, res) => {
    return res.render('register', { title: 'register' });
});

// Feature 3

router.get('/map', async (req, res) => {
    const id = req.query.id;  
    return res.render('mapScreen', { title: 'Map', id: id });
});


router.get('/index1', async (req, res) => {
    return res.render('index1', { title: 'index' });
});

router.get('/list', async (req, res) => {
    return res.render('listView', { title: 'List' });
});
router.get('/MyWorkouts', async (req, res) => {
    return res.render('MyWorkouts', { title: 'MyWorkouts' });
});

router.get('/about', async (req, res) => {
    return res.render('about', { title: 'About' });
});

// router.get('/customer', auth, checkRole('customer'), async (req, res) => {
//     return res.render('customer', { title: 'Customer' });
// });

module.exports = router;