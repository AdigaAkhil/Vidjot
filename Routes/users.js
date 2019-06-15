const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');
require('../models/users');
const User = mongoose.model('users');


router.get('/login', (req, res) => {
  res.render('./ideas/users/login');
});

router.get('/register', (req, res) => {
  res.render("./ideas/users/register");
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: 'true'
  })(req, res, next);
})


router.post('/register', (req, res) => {
  let errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({
      msg: 'Passwords Do not Match'
    });
  }
  if (req.body.password.length < 4) {
    errors.push({
      msg: 'Passwords must be atleast 4 characters long'
    });
  }

  if (errors.length > 0) {
    res.render('./ideas/users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({
        email: req.body.email
      })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email already Registered');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          var bcrypt = require('bcryptjs');
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can login');
                  res.redirect('/users/login');
                })
                .catch((err) => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      })
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Successfully logged out')
  res.redirect('/users/login');
})


module.exports = router;