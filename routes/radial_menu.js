let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// connect to Radial Model
let Radial = require('../models/radial_menu');

let radialController = require('../controllers/radial_menu');

/* GET Route for the Radial List page - READ Operation */
router.get('/',  radialController.displayRadialList);

/* GET Route for displaying the Add page - CREATE Operation */
router.get('/add', radialController.displayAddPage);

/* POST Route for processing the Add page - CREATE Operation */
router.post('/add', radialController.processAddPage);

/* GET Route for displaying the Edit page - UPDATE Operation */
router.get('/edit/:id', radialController.displayEditPage);

/* POST Route for processing the Edit page - UPDATE Operation */
router.post('/edit/:id', radialController.processEditPage);

/* GET to perform  Deletion - DELETE Operation */
router.get('/delete/:id', radialController.performDelete);

module.exports = router;