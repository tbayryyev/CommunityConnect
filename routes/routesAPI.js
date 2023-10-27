//require express, express router and bcrypt as shown in lecture code
const express = require('express');
const router = express.Router();
const data = require('../data');
const dataUser = data.users;
const dataEvent = data.event;
const helpers = require('../helpers');

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      return res.redirect('/protected');
    }
    return res.render('eventList');
  })

  router
  .route('/termsConditions')
  .get(async (req, res) => {
    //code here for GET
    return res.json({ terms: "Non at the moment" });
  })


router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      return res.redirect('/protected');
    }
    return res.render('userRegister');
  })
  .post(async (req, res) => {
    //code here for POST
    let userData = req.body;
    let username = userData.usernameInput;
    let password = userData.passwordInput;
    let birth_date = userData.birthdate;
    let email = userData.email;
    let firstname = userData.firstname;
    let lastname = userData.lastname;

    try {
      helpers.checkString(username);
      helpers.checkString(password);
      helpers.checkString(firstname);
      helpers.checkString(lastname);
      helpers.checkString(email);

    }
    catch(e) {
      return res.status(400).render('userRegister', { title: "Register", error: e });
    }

    if(username.length < 4) {
      return res.status(400).render('userRegister', { title: "Register", error: "Error: username length too short" });
    }

    const regex = /^[a-zA-Z0-9]*$/;

    if(regex.test(username) === false) {
      return res.status(400).render('userRegister', { title: "Register", error: "Error: username must contain no spaces and only alphabets and numbers" });
    }

    if(password.length < 6) {
      return res.status(400).render('userRegister', { title: "Register", error: "Error: password length too short" });
    }

    if(password.search(/[A-Z]/) < 0) {
      return res.status(400).render('userRegister', { title: "Register", error: "Error: password must contain at least one upper case letter" });
    } 
    if(password.search(/[0-9]/) < 0) {
      return res.status(400).render('userRegister', { title: "Register", error: "Error: password must contain at least one number" });
    }
    if(password.search(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) < 0) {
      return res.status(400).render('userRegister', { title: "Register", error: "Error: password must contain at least special character" });
    }

    try {
      const newUser = await dataUser.createUser(username, password, firstname,lastname,birth_date,email);
      if (newUser.insertedUser === true) {
        req.session.user = { username: username, email: email, firstname: firstname,lastname:lastname,birth_date:birth_date };
        res.status(200).redirect('/protected');
      } 
      else {
        return res.status(500).json({ error: "Internal Server Error" });

      }
    } 
    catch (e) {
      return res.status(400).render('userRegister', { title: "Register", error: e });
    }
  })
 
router
  .route('/login')
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      return res.redirect('/protected');
    }
    return res.render('userLogin');
  })
  .post(async (req, res) => {
    //code here for POST
    let userData = req.body;
    let username = userData.usernameInput;
    let password = userData.passwordInput;
  
    
    try {
      helpers.checkString(username);
      helpers.checkString(password);
    }
    catch(e) {
      return res.status(400).render('userLogin', { title: "Login", error: e });
    }


    try {
      const newUser = await dataUser.checkUser(username, password);
      if (newUser.authenticatedUser === true) {
        req.session.user = { username: username};
        res.status(200).redirect('/protected');
      } 
    } 
    catch (e) {
      return res.status(400).render('userLogin', { title: "Login", error: e });
    }
  })

router
  .route('/protected')
  .get(async (req, res) => {
    if (req.session.user) {
      res.render('eventList', { username: req.session.user.username });
    }
    else {
      return res.render('forbiddenAccess');
    }
  })

router
  .route('/logout')
  .get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    return res.status(200).render('eventList');
  })

router.route('/postEvent')
  .get(async (req, res) => {
    if (req.session.user) {
      res.render('postEvent', { username: req.session.user.username });
    } else {
      // Redirect the user to the login page or display an error message
      // if they are not logged in.
      res.redirect('/login');
    }
  })
  .post(async (req, res) => {
    // Handle the form submission here (e.g., save event data to a database)
    const eventData = req.body;
    let eventName = eventData.eventName;
    let description = eventData.description;
    let eventDate = eventData.eventDate;
    let eventTime = eventData.eventTime;
    let eventLocation = eventData.eventLocation;

    try {
      // // Validate input data
      // if (!eventName || !description || !eventDate || !eventTime || !eventLocation) {
      //   throw new Error('All fields are required');
      // }

      // // Handle additional validation for eventDate and eventTime if necessary
      // if (!isValidDate(eventDate) || !isValidTime(eventTime)) {
      //   throw new Error('Invalid date or time format');
      // }

      // Additional validation for eventImage if you're handling file uploads

      // Add the event to a database
      try {
        const newEvent = await dataEvent.createEvent(eventName, description, eventDate, eventTime, eventLocation);
      } 
      catch (e) {
        return res.status(400).render('userLogin', { title: "Login", error: e });
      }
      // Redirect to the home page after successfully creating the event
      res.redirect('/');
    } catch (error) {
      // Handle validation errors or other errors
      return res.status(400).render('postEvent', { title: "Post an Event", error: error.message });
    }
  });

router
  .route('/account')
  .get(async (req, res) => {
    if (req.session.user) {
      // res.render('account', { username: req.session.user.username, email: req.session.user.email});
      //username
      //firstName
      //lastName
      //gender
      //age
      //account created date
      const userData = await dataUser.getUserByUsername(req.session.user.username);

      res.render('account',  userData);


    }  
    else {
      return res.render('forbiddenAccess');
    }
  })

module.exports = router;
