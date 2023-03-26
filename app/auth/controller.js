const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../user/model');

async function register(req, res, next) {
  try {
    const payload = req.body;

    let user = new User(payload);
    await user.save();

    return res.json(user);
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
}

async function localStrategy(email, password, done) {
  try {
    // (1) cari user ke MongoDB
    let user =
      await User
        .findOne({ email })
        .select('-__v -createdAt -updatedAt -cart_items -token');

    // (2) jika user tidak ditemukan, akhiri proses login
    if (!user) return done();

    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      // (4) akhiri pengecekkan, user berhasil login
      // berikan data user tanpa password
      return done(null, userWithoutPassword);
    }
  } catch (err) {
    done(err, null);
  }

  done();
}

module.exports = {
  register,
  localStrategy
}