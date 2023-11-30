// routes/router.js

const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');

router.post('/register', userMiddleware.validateRegister, (req, res, next) => {
  db.query(
      'SELECT id FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)',
      [req.body.username, req.body.email],
      (err, result) => {
          if (result && result.length) {
              // error
              return res.status(409).send({
                  message: 'Username or email already in use!',
              });
              } else {
              // username or email not in use
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                  if (err) {
                      return res.status(500).send({
                      message: err,
                  });
                  } else {
                      db.query(
                          'INSERT INTO users (id, username, email, password, phone, role, fname, lname, registered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, now());',
                          [uuid.v4(), req.body.username, req.body.email, hash, req.body.phone, req.body.role, req.body.fname, req.body.lname],
                          (err, result) => {
                              if (err) {
                              return res.status(400).send({
                                  message: err,
                              });
                              }
                              return res.status(201).send({
                                  message: 'Registered!',
                              });
                          }
                      );
                  }
              });
          }
      }
  );
});

router.post('/login', (req, res, next) => {
  db.query(
      `SELECT * FROM users WHERE username = ? OR email = ?;`,
      [req.body.username, req.body.email],
      (err, result) => {
          if (err) {
              return res.status(400).send({
                  message: err,
              });
          }
          if (!result.length) {
              return res.status(400).send({
                  message: 'Username or email not found!',
              });
          }
          bcrypt.compare(
              req.body.password,
              result[0]['password'],
              (bErr, bResult) => {
                  if (bErr) {
                      return res.status(400).send({
                          message: 'Invalid credentials!',
                      });
                  }
                  if (bResult) {
                      // password match
                      const token = jwt.sign(
                          {
                              username: result[0].username,
                              userId: result[0].id, 
                              role: result[0].role, 
                          },
                          'SECRETKEY',
                          { expiresIn: '7d' }
                      );
                      db.query(
                          `UPDATE users SET last_login = now() WHERE id = ?;`,
                          [result[0].id],
                          (updateErr, updateResult) => {
                              if (updateErr) {
                                  return res.status(400).send({
                                      message: updateErr,
                                  });
                              }
                              return res.status(200).send({
                                  message: 'Logged in successfully!',
                                  token,
                                  user: result[0],
                              });
                          }
                      );
                  } else {
                        console.log('Password mismatch:', req.body.password, result[0]['password']);
                        return res.status(400).send({
                        message: 'Invalid password!',
                    });
                  }
              }
          );
      }
  );
});

router.post('/logout', userMiddleware.isLoggedIn, userMiddleware.clearSession, (req, res, next) => {
  res.status(200).send({
    message: 'Logged out succesfully!',
  });
});

router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = router;