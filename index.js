const colors = require('colors');
const express = require('express');
const app = express();
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 

const PORT = process.env.PORT || 5555;
const keys = require('./config/keys');

require('./models/User');

mongoose.connect(keys.mongoDB, { useNewUrlParser: true })
.then(() => console.log('[SUCCESS]'.green, 'Server was successfully connected to MongoDB ... '))
.catch(err => console.log('[ERROR]\n'.red, err));

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./services/passport');

app.get('/', (req, res) => {
  res.send('Hello World');
});

require('./routes/auth')(app);

app.listen(PORT, () => {
  console.clear();
  console.log('[SUCCESS]'.green, `Server is running on port ${PORT} ...`)
});