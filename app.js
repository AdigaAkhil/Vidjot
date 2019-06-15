const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const ideas = require('./Routes/ideas');
const users = require('./Routes/users');
const path = require('path');
const passport = require('passport');


require('./config/passport')(passport);

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/VidJot_db", {
    useNewUrlParser: true
  })
  .then(() => console.log('MongoDB connected ...'))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg'),
    res.locals.error_msg = req.flash('error_msg'),
    res.locals.err = req.flash('error')
  res.locals.user = req.user || null;
  next();
});

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



app.get('/', (req, res) => {
  const title = "hello world";
  res.render("index", {
    title: title
  });
})

app.get('/about', (req, res) => {
  res.render("about");
});



app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});