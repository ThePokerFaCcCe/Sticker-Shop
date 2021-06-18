const express = require('express');
const router = express.Router();

// const bodyParser = require('body-parser');
const multer = require('multer');
upload = multer({ dest: _config.path.IMGPATH });

const items = require("./items");
const category = require('./category');
const homepage = require('./homepage');
const comment = require('./comment');

// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(upload.array());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use((req, res, next) => {
    if (req.user) {
        if (req.user.rank === 'admin') {
            req.categories.shift();
            next();
            return
        }
    }
    res.send("NO-PERM");
})


router.get("/", (req, res) => {
    res.render('admin/dashboard', { user: req.user });
})
router.use('/item', items);
router.use("/category", category);
router.use("/homepage", homepage);
router.use("/comment", comment);





module.exports = router;