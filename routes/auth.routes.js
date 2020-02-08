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
    } else {
      next(error);
    }
  })  
});


module.exports = router;
