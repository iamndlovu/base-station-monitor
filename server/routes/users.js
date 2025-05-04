const router = require('express').Router();
const User = require('../models/User.model');

router.route('/').get(async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) res.json(user);
      else {
        res.status(400).json('Error: user not found');
      }
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/add').post((req, res) => {
  const { fullName, email, password } = req.body;

  let user = {
    fullName,
    email,
    password,
  };

  const newUser = new User(user);

  newUser
    .save()
    .then(() => res.json(newUser))
    .catch((err) => {
      console.error(`Failed to save new user with error: ${err}`);
      res.status(400).json(`Error ${err}`);
    });
});

router.route('/:id').delete(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    console.log(user);
    const newUsers = await User.find().sort({ createdAt: -1 });
    res.json(newUsers);
  } catch (err) {
    res.status(400).json(`User not deleted.\nError: ${err}`);
  }
});

router.route('/update/:id').post((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;

      user
        .save()
        .then(() => res.json('User updated'))
        .catch((err) => res.status(400).json(`Error: ${err}`));
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
