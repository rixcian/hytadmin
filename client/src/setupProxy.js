const setupProxy = require('http-proxy-middleware');

module.exports = app => {
    app.use(setupProxy(['/api'], { target: 'http://localhost:5555' }));
};