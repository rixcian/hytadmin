const colors = require('colors');
const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 

const keys = require('./config/keys');
const PORT = process.env.PORT || 5555;

require('./models/User');
require('./models/Article');

mongoose.connect(
  keys.mongoDB, { useNewUrlParser: true })
  .then(() => console.log('[INFO]'.blue, 'Server was successfully connected to MongoDB ... '))
  .catch(err => console.log('[ERROR]\n'.red, err));
    
app.use(bodyParser.json());
app.use(cookieSession({
  maxAge: 7 * 24 * 60 * 60 * 60 * 1000,
  keys: [keys.cookieKey]
  //secure: true 
}));

app.use(passport.initialize());
app.use(passport.session());

require('./services/passport');
require('./routes/auth')(app);
require('./routes/article')(app);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.clear();
  console.log('[INFO]'.blue, `Server is running on port ${PORT} ...`)
});