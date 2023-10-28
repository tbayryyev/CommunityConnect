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
    try {
      // Retrieve events from the database
      const events = await dataEvent.getEvents();
      return res.render('eventList', { events });


    } catch (error) {
      // Handle any errors related to fetching events from the database
      res.status(500).send('Error fetching events: ' + error.message);
    }
   
  })

  router
  .route('/termsConditions')
  .get(async (req, res) => {
    //code here for GET
    return res.json({ terms: "Non at the moment" });
  })
  router
  .route('/myEvents')
  .get(async (req, res) => {
    if (req.session.user) {
      try {
        // Retrieve events from the database
        const events = await dataEvent.getMyEvents(req.session.user.username);
        return res.render('myEvents', { username: req.session.user.username, events });
  
  
      } catch (error) {
        // Handle any errors related to fetching events from the database
        res.status(500).send('Error fetching events: ' + error.message);
      }
     
     
          }
    else {
      return res.render('forbiddenAccess');
    }
  })

  // Delete Event
  router
  .route("/myEvents/deleteEvent/:eventId")
  .get(async (req,res) => {
    try {
      if (req.session.user) {
        return res.render('myEvents',{user:req.session.user});
      } else {
        return res.render('userLogin',{user:req.session.user});
      }
    } catch (error) {
      return "Error";
    }
    
  })
  .post(async (req,res) => {
    try {
      if (req.session.user) {
        let eventId = req.params.eventId.trim();
        if (!eventId) return "Id is not valid" //({ error: 'Invalid ObjectID' });
        try {
          const event = await data.event.removeEvent(eventId);
          if (!event) throw `Could not delete event with id of ${eventId}`
          return res.redirect('/myEvents')
        } catch (e) {
          return "Error";
        }

        } else return res.render('userLogin',{user:req.session.user});

    } catch (error) {
      return "Error"
    }
    
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
      try {
        // Retrieve events from the database
        const events = await dataEvent.getEvents();
        return res.render('eventList', { username: req.session.user.username, events });
  
  
      } catch (error) {
        // Handle any errors related to fetching events from the database
        res.status(500).send('Error fetching events: ' + error.message);
      }
     
     
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
    return res.status(200).redirect('/');
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
    let cost = Number(eventData.eventCost);
    let username = req.session.user.username;

    try {
      // Validate input data
      if (!eventName || !description || !eventDate || !eventTime || !eventLocation || !cost) {
        throw new Error('All fields are required');
      }

      helpers.checkString(eventName);
      helpers.checkString(description);
      helpers.checkString(eventLocation);

      helpers.checkNum(cost);

      // Add the event to a database
      try {
        const newEvent = await dataEvent.createEvent(username, eventName, description, eventDate, eventTime, eventLocation, cost);
      } 
      catch (e) {
        return res.status(400).render('postEvent', { title: "Post an Event", error: e });
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
