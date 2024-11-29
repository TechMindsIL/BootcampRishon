const express = require("express");
const auth = require('../middleware/auth'); // Import the auth middleware
const checkRole = require('../middleware/role'); // Import the role middleware
const router = express.Router();

router.use(auth, checkRole('admin'));

// Protected routes
// Feature 6
router.get('/', async (req, res) => {
    return res.render('admin', { title: 'Admin' });
});

router.get('/add-new-route', async (req, res) => {
    return res.render('manageRoute', { title: 'Add Route' });
});
router.get('/update-route', async (req, res) => {
    return res.render('manageRoute', { title: 'Update Route' });
});

router.get('/add-new-route/places', async (req, res) => {
    return res.render('manageRoutePlaces', { title: 'Add Route`s Places' });
});
router.get('/update-route/places', async (req, res) => {
    return res.render('manageRoutePlaces', { title: 'Update Route`s Places' });
});

// Feature 7
router.get('/manage-activities', async (req, res) => {
    return res.render('manageActivities', { title: 'Manage Activities' });
});
router.get('/add-new-activity', async (req, res) => {
    return res.render('addActivity', { title: 'Add Activity' });
});
router.get('/edit-activity', async (req, res) => {
    return res.render('editActivity', { title: 'Edit Activity' });
});

// Feature 8
router.get('/create-tags', async (req, res) => {
    return res.render('createTags', { title: 'Create Tags' });
});

module.exports = router;