let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// connect to Radial Model
let Radial = require('../models/radial_menu');

let radialController = require('../controllers/radial_menu');

let authRequired = require('../config/auth');

/* GET Route for the Radial List page - READ Operation */
router.get('/', authRequired, radialController.displayRadialList);

/* GET Route for displaying the Add page - CREATE Operation */
router.get('/add', authRequired, radialController.displayAddPage);

/* POST Route for processing the Add page - CREATE Operation */
router.post('/add', authRequired, radialController.processAddPage);

/* GET Route for displaying the Edit page - UPDATE Operation */
router.get('/edit/:id', authRequired, radialController.displayEditPage);

/* POST Route for processing the Edit page - UPDATE Operation */
router.post('/edit/:id', authRequired, radialController.processEditPage);

/* GET Route for displaying the View Content - UPDATE Operation */
router.get('/content/:id/:number', authRequired, radialController.displayContentPage);

/* POST Route for processing Text Speech  */
router.post('/content/:id/:number', authRequired, radialController.processContentPage);

/* GET to perform Deletion - DELETE Operation */
router.get('/delete/:id', authRequired, radialController.performDelete);

/* GET Route for the Radial List page - READ Operation */
router.get('/category/:category', authRequired, radialController.displayCategory);

/* GET to perform Share - SHARE Operation */
router.get('/share/:id/:email', authRequired, radialController.performShare);

/* GET to add a new Category - Create Operation */
router.get('/add-category/:newcat', authRequired, radialController.addCategory);

/* GET to delete a Category - Delete Operation */
router.get('/delete-category/:newcat', authRequired, radialController.deleteCategory);

module.exports = router;