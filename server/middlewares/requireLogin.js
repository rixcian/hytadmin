module.exports = (req, res, next) => {
  if (!req.user || !req.user.active) return res.status(401).send({ success: false, err: 'Nutnost autentizace.' });
  next();
};