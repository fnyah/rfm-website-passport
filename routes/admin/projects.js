const express = require('express');
const router = express.Router();
const Projects = require('../../models/Projects');
const multer = require('multer');
const methodOverride = require('method-override');
const isAuth = require('../authMiddleware').isAuth;
const asyncHandler = require('../../middleware/asyncHandler');
const { makeGridFsStorage } = require('../../utils/gridfsStorageutil');
const {
    uploadProject,
    getProjects,
    editProject,
    deleteProject,
    editProjectPhotos
} = require('../../controllers/admin-controllers/adminProjectsController');

// Setup GridFS storage engine for multer
const storage = makeGridFsStorage(process.env.MONGO_URI, 'projectphotos');
const upload = multer({ storage });

// Apply common middlewares
router.use(express.json()); // bodyParser.json() is now built-in in Express
router.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
router.use(methodOverride('_method'));

// Routes for projects management
router.get('/', isAuth, asyncHandler(getProjects));
router.get('/new', isAuth, (req, res) => res.render('admin-projects/new', { projects: new Projects() }));
router.get('/:id', isAuth, asyncHandler(async (req, res) => {
    const projects = await Projects.findById(req.params.id);
    res.render('admin-projects/show', { projects });
}));
router.get('/edit/:id', isAuth, asyncHandler(async (req, res) => {
    const projects = await Projects.findById(req.params.id);
    res.render('admin-projects/edit', { projects });
}));

// File upload route
router.post('/', isAuth, upload.any('file'), asyncHandler(uploadProject));

// Project modification routes
router.put('/:id', isAuth, upload.any('file'), asyncHandler(editProject));
router.delete('/:id', isAuth, asyncHandler(deleteProject));

// Route to edit project photos specifically
router.post('/:id', isAuth, asyncHandler(editProjectPhotos));

module.exports = router;
