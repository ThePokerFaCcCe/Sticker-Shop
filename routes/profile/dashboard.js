const express = require("express");
const router = express.Router();


router.get('/', async (req, res) => {
    if (req.user) {
        res.render('profile/dashboard', { ...req.important });
    } else {
        res.render('erroruser', { errors: [process.env.ERR_GUEST], ...req.important });
    }
});








module.exports = router;