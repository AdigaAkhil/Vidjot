const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
require('../models/Ideas');
const Idea = mongoose.model('ideas');
const {
  ensureAuthenticated
} = require('../helpers/auth');

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      if (idea.user != req.user.id) {
        req.flash('error_msg', 'Not Authorised')
        res.redirect('/ideas');
      } else {
        res.render('./ideas/edit', {
          idea: idea
        });
      }
    });
});

router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({
      user: req.user.id
    })
    .sort({
      date: 'desc'
    })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});



router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('./ideas/add')
})

router.post('/', (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({
      msg: 'Please enter the title'
    });
  }
  if (!req.body.details) {
    errors.push({
      msg: 'Please enter the details'
    });
  }
  if (errors.length > 0) {
    res.render('./ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newUser)
      .save()
      .then((idea) => {
        req.flash('success_msg', 'Idea Added Successfully');
        res.redirect('/ideas');
      })
  }
})

router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;
      idea.save()
        .then(idea => {
          req.flash('success_msg', 'Idea Updated Successfully');
          res.redirect('/ideas');
        })
    });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({
      _id: req.params.id
    })
    .then(() => {
      req.flash('success_msg', 'Idea Deleted Successfully');
      res.redirect('/ideas');
    });
});

module.exports = router;