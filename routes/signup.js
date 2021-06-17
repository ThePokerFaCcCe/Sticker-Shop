const express = require('express');
const router = express.Router();



// const bodyParser = require('body-parser');
// const multer = require("multer");
// const upload = multer();

const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(upload.array());


router.use((req, res, next) => {
    if (req.user) {
        res.render('signup', { loggedIn: "ابتدا از حساب کاربری خود خارج شوید", ...req.important });
    } else {
        next()
    }
})


router.get('/', (req, res) => {
    res.render('signup', { ...req.important });
});


router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.post("/",
    body('email', 'لطفا ایمیل معتبر  وارد کنید').trim().isEmail(),
    body('pass', 'رمز عبور باید بین ۶ تا ۳۰ کلمه باشد').isLength({ max: 30, min: 6 }),
    body("name", "حداقل یک حرف برای نام وارد کنید").notEmpty(),
    async (req, res) => {
        let error = [];
        const validerr = validationResult(req);
        if (validerr.isEmpty()) {
            try {
                const name = req.body.name;
                const password = await bcrypt.hash(req.body.pass, 10);
                const email = req.body.email;

                const user = await User.findOne({ where: { email: email } });
                if (!user) {
                    await User.create({ name: name, password: password, email: email });
                    res.redirect("/login");
                } else {
                    error.push({ msg: `ایمیل ${email} قبلا ثبت شده` });
                }
            } catch (e) {
                error.push({ msg: "خطایی رخ داده. مجددا تلاش کنید" });
            }
        } else {
            error = validerr.array();
        }
        res.render('signup', { error: error, ...req.important });
    });





module.exports = router;