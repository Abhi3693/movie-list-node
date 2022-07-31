let jwt = require('jsonwebtoken');

// User authorization
module.exports = {
  verifyUser: async function (req, res, next) {
    let token = req.headers.authorization;

    try {
      let payload = await jwt.verify(token, process.env.SECRET_KEY);
      if (payload) {
        req.user = payload;
        next();
      } else {
        return res.ststus(401).json({ error: 'Token required' });
      }
    } catch (err) {
      return res.status(401).json({ error: [err.message] });
    }
  },
};
