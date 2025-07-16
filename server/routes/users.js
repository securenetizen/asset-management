const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const role = req.body.role;
  const department = req.body.department;

  const newUser = new User({
    username,
    password,
    email,
    role,
    department,
  });

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/login').post((req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json('User not found');
      }

      if (user.password !== password) {
        return res.status(401).json('Invalid password');
      }

      res.json(user);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
