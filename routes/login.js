const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const bcrypt = require('bcrypt');

const { body, validationResult } = require('express-validator');
// const bodyParser = require('body-parser');
// const multer = require("multer");
// const upload = multer();


// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(upload.array());

router.use((req, res, next) => {
    if (req.user) {
        res.render('login', { loggedIn: "ابتدا از حساب کاربری خود خارج شوید", ...req.important });
    } else {
        next()
    }
})

router.get('/', (req, res) => {
    res.render('login', { ...req.important });
});




router.use(express.json());
router.use(express.urlencoded({ extended: true }))
router.post("/",
    body('email', 'لطفا ایمیل معتبر  وارد کنید').trim().isEmail(),
    body('pass', 'رمز عبور باید بین ۶ تا ۳۰ کلمه باشد').isLength({ max: 30, min: 6 }),
    async (req, res) => {
        let error = [];
        const validerr = validationResult(req);
        if (validerr.isEmpty()) {
            try {
                const email = req.body.email;
                const password = req.body.pass;
                const remember = (req.body.remember === 'on') ? true : false;

                const user = await User.findOne({
                    attributes: ['id', 'password'],
                    where: {
                        email: email
                    }
                });
                if (user) {
                    const samePassword = await bcrypt.compare(password, user.password);
                    if (samePassword) {
                        let tokenExists, randToken;
                        do {
                            randToken = crypto.randomBytes(10).toString('hex');
                            tokenExists = await User.findOne({ attributes: ['id'], where: { last_token: randToken } });
                        } while (tokenExists)
                        user.last_token = randToken;
                        user.save();

                        req.session.token = randToken;
                        console.log(remember);
                        if (remember) {
                            res.cookie('token', randToken, { maxAge: 360000000 })
                        } else {
                            res.clearCookie('token');
                        }
                        res.redirect("/");
                    } else {
                        error.push({ msg: "رمز عبور اشتباه است" });
                    }
                } else {
                    error.push({ msg: "این ایمیل قبلا ثبت نشده" });
                }
            } catch (e) {
                error.push({ msg: "خطایی رخ داده. مجددا تلاش کنید" });
            }
        } else {
            error = validerr.array();
        }
        res.render('login', { error: error, ...req.important });
    })





module.exports = router;