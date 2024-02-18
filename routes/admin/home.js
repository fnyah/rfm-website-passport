const express = require('express');
const multer = require('multer');
const methodOverride = require('method-override');
const asyncHandler = require('../../middleware/asyncHandler');
const { makeGridFsStorage } = require('../../utils/gridfsStorageutil');
const {
  createTextPost,
  deletePhotoLink,
  editTextPost,
  deleteTextPost,
  uploadPhoto,
  editPhotoPost,
  getHomeContent,
  getImageByFilename
} = require('../../controllers/admin-controllers/adminHomeController');
const isAuth = require('../authMiddleware').isAuth;

const router = express.Router();

// Set up multer for file uploads
const storage = makeGridFsStorage(process.env.MONGO_URI, 'uploads');
const upload = multer({ storage });

router.use(express.json());
router.use(methodOverride('_method'));

// Photo link routes
router.get('/photos/new', isAuth, (req, res) => res.render('admin-home/home-photo-link/newPhotoLink'));
router.post('/upload', isAuth, upload.single('file'), asyncHandler(uploadPhoto));
router.get('/photos/edit/:id', isAuth, async (req, res) => {
  const photos = await PhotoLinkInfo.findById(req.params.id);
  res.render('admin-home/home-photo-link/photoLinkEdit', { photos });
});
router.put('/photos/edit/:id', isAuth, upload.single('file'), asyncHandler(editPhotoPost));
router.delete('/photos/:id', isAuth, asyncHandler(deletePhotoLink));

// Home content routes
router.get('/', isAuth, asyncHandler(getHomeContent));
router.get('/image/:filename', asyncHandler(getImageByFilename));
router.get('/new', isAuth, (req, res) => res.render('admin-home/new', { posts: new HomeInfo() }));
router.get('/:id', isAuth, async (req, res) => {
  const posts = await HomeInfo.findById(req.params.id);
  res.render('admin-home/show', { posts });
});
router.get('/edit/:id/', isAuth, async (req, res) => {
  const posts = await HomeInfo.findById(req.params.id);
  res.render('admin-home/edit', { posts });
});

// CRUD operations for text posts
router.put('/:id', isAuth, asyncHandler(editTextPost));
router.post('/', isAuth, asyncHandler(createTextPost));
router.delete('/:id', isAuth, asyncHandler(deleteTextPost));

module.exports = router;
