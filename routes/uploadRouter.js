const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.route('/')
.options(cors.corsWithOptions,(req, res) => res.sendStatus(200))
.get(cors.cors,authenticate.verifyUser, authenticate.verifyAdmin, (req,res) => {
    res.statusCode = 403;
    res.end('Get operation not supported on /imageUPload')
})
.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'),(req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json(req.file);
})
.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /imageUPload')
})
.delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res) => {
    res.statusCode = 403;
    res.end('Delete operation not supported on /imageUPload')
});
module.exports = uploadRouter;