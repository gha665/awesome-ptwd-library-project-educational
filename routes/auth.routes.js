const { Router } = require("express");
const router = new Router();

const mongoose = require('mongoose'); //<---require mongoose vor validation

// encrypt the password and save the hashed password in the DB
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

//require user model
const User = require("../models/User.model");

// -------------ROUTES-----------
// .get() route ==> to display the signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));

//get the newly created user page
router.get('/userProfile', (req, res) => res.render('users/user-profile'));

// .post() route ==> to process form data
router.post("/signup", (req, res, next) => {
  // console.log("The form data ", req.body);
  
  const { username, email, password } = req.body;

  if (!username || !email || !password) {   //<---make sure all fields are filled
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password'});
    return;
  }
  
  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  bcryptjs                                  //<---encrypt the password
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
    // console.log(`Password hash: ${hashedPassword}`);
    return User.create({                    //<---after hashing the password, create user
      username,
      email,
      passwordHash: hashedPassword 
    });
  })
  .then(userFromDB => {                     //<---after creating new user, redirect to user page
    console.log("Newly created user is: ", userFromDB);
    res.redirect('/userProfile');
  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('auth/signup', { errorMessage: error.message });
    } else if (error.code === 1000) {       //<---error in case username or email is not unique
      res.status(500).render('auth/signup', {
        errorMessage: 'Username and email need to be unique. Either username or email is already used.'
      });
    } else {
      next(error);
    }
  }); 
});


module.exports = router;
