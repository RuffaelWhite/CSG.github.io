const languageMiddleware = (req, res, next) => {
  const user = req.user;
  if (user && user.languagePreference) {
    req.language = user.languagePreference;
  } else {
    req.language = req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : 'en';
  }
  next();
};

export default languageMiddleware;
