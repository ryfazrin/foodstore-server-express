const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
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

async function login (req, res, next) {
  passport.authenticate('local', async function (err, user) {
    if (err) return next(err);
    if (!user) return res.json({
      error: 1, message: 'email or password incorrect'
    })
    // (1) buat JSON Web Token
    let signed = jwt.sign(user, config.secretKey); // <--- ganti secret key
    // (2) simpan token tersebut ke user terkait
    await User.findOneAndUpdate({ _id: user._id }, {
      $push: {
        token:
          signed
      }
    }, { new: true });
    // (3) response ke _client_
    return res.json({
      message: 'logged in successfully',
      user: user,
      token: signed
    });
  })(req, res, next);
}

module.exports = {
  register,
  localStrategy,
  login
}