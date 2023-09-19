var express = require('express');
var router = express.Router();
var User = require('../models/users');
require('../models/connection');
const { checkBody } = require('../modules/checkBody');

const uid2 = require('uid2');
const bcrypt = require('bcrypt');

//Inscription
router.post('/signup', function(req, res, next) {
  const token = uid2(32);
  const hash = bcrypt.hashSync(req.body.password, 10);

  if (!checkBody(req.body, ['email', 'password','firstname' ])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Vérifie si l'utilisateur existe
  User.findOne({ email: req.body.email }).then(userfound => {
    if (userfound === null) {
      const newUser = new User({
        email : req.body.email,
        firstname: req.body.firstname,
        password: hash,
        token: token,
        canPanier: true,
      });

      newUser.save().then((newuser) => {
        res.json({ result: true, token: newuser.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});



router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }


  User.findOne({ email: req.body.email }).then(userfound => {
    console.log("userfound route signin",userfound);
    if (userfound && (bcrypt.compareSync(req.body.password, userfound.password))) {
      res.json({ result: true, token: userfound.token, firstname: userfound.firstname });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});


router.get('/canPanier/:token', (req, res) => {
  User.findOne({ token : req.params.token }).then(userfound => {
    console.log(userfound)
    if (userfound) {
      res.json({ result: true, canPanier: userfound.canPanier });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});


module.exports = router;
