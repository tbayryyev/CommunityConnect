//require express, express router and bcrypt as shown in lecture code
const express = require('express');
const router = express.Router();
const data = require('../data');
const dataUser = data.users;
const dataEvent = data.event;
const helpers = require('../helpers');

const multer = require('multer'); // Import Multer
const upload = multer({ dest: 'uploads/user-uploaded-images' });

// Middleware function to format event time and date
const formatEventDateTime = (events) => {
  for (let i = 0; i < events.length; i++) {
    let time = events[i]["eventTime"];
    events[i]["eventTime"] = helpers.convert24HourTime(time);
    let date = events[i]["eventDate"];
    events[i]["eventDate"] = helpers.formatDateString(date);
  }
};

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
      
      formatEventDateTime(events);

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

        //formatEventDateTime(events);

        return res.render('myEvents', { username: req.session.user.username, events });
  
  
      } catch (error) {
        // Handle any errors related to fetching events from the database
        res.status(500).send('Error fetching events: ' + error.message);
      }
     
     
          }
    else {
      return res.redirect('/login');
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
    if (req.session.user) {
      return res.redirect('/protected');
    }
    return res.render('userLogin');
  })
  .post(async (req, res) => {
    let userData = req.body;
    let username = userData.usernameInput;
    let password = userData.passwordInput;

    try {
      helpers.checkString(username);
      helpers.checkString(password);
    } catch (e) {
      return res.status(400).render('userLogin', { title: "Login", error: e });
    }

    try {
      const newUser = await dataUser.checkUser(username, password);
      if (newUser.authenticatedUser === true) {
        req.session.user = { username: username };
        
        // Check if there's a lastVisitedEvent in the session
        if (req.session.lastVisitedEvent) {
          const lastVisitedEvent = req.session.lastVisitedEvent;
          // Clear lastVisitedEvent in the session
          delete req.session.lastVisitedEvent;
          return res.status(200).redirect(`/event/${lastVisitedEvent}`);
        } else {
          return res.status(200).redirect('/protected');
        }
      }
    } catch (e) {
      return res.status(400).render('userLogin', { title: "Login", error: e });
    }
  });


router
  .route('/protected')
  .get(async (req, res) => {    
    if (req.session.user) {
      try {
        // Retrieve events from the database
        const events = await dataEvent.getEvents();
        
        formatEventDateTime(events);

        return res.render('eventList', { username: req.session.user.username, events });
  
      } catch (error) {
        // Handle any errors related to fetching events from the database
        res.status(500).send('Error fetching events: ' + error.message);
      }
     
     
          }
    else {
      return res.redirect('/login');
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
  .post( async (req, res) => {
    // Handle the form submission here (e.g., save event data to a database)
    let eventData = req.body;
    let eventName = eventData.eventName;
    let description = eventData.description;
    let eventDate = eventData.eventDate;
    let eventTime = eventData.eventTime;
    let eventLocation = eventData.eventLocation;
    let cost = Number(eventData.eventCost);
    let username = req.session.user.username;
    let eventLink = eventData.link;
    try {
     

      helpers.checkString(eventName);
      helpers.checkString(description);
      helpers.checkString(eventLocation);

      helpers.checkNum(cost);
    
      
      // Add the event to a database
      try {
        const newEvent = await dataEvent.createEvent(username, eventName, description, eventDate, eventTime, eventLocation, cost, eventLink,"https://www.eventbrite.ie/blog/wp-content/uploads/2022/09/dance-event.jpg");
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
      const events = await dataEvent.getInterestedEvents(req.session.user.username);

      formatEventDateTime(events);

      res.render('account',  {userData, events, username: userData.username});


    }  
    else {
      return res.redirect('/login');
    }
  })

//TODO: Either make session token store userid or change edit account handlebars to not allow user to change their username
router
  .route("/editAccount")
  .get(async(req, res) => {
    if(req.session.user){
        const userData = await dataUser.getUserByUsername(req.session.user.username);
        res.render("editAccount", userData);
    } else{
        return res.redirect("/login");
    }
  })
  .post(async(req, res) => {
    let updatedData = req.body;
    try{
        let password = updatedData.password;
        let username = updatedData.username;
        if(username.length < 4) {
            updatedData["error"] = "Username must be at least 4 characters long";
            return res.render("editAccount", updatedData);
        }
    
        const regex = /^[a-zA-Z0-9]*$/;
    
        if(regex.test(username) === false) {
            updatedData["error"] = "Username can only contain letters and numbers";
            return res.render("editAccount", updatedData);
        }

        if(password.length < 6) {
            updatedData["error"] = "Password must be at least 6 characters long";
            return res.status(400).render('editAccount',  updatedData);
        }
    
        if(password.search(/[A-Z]/) < 0) {
            updatedData["error"] = "Password must contain at least one upper case letter";
            return res.status(400).render('editAccount', updatedData);
        } 
        if(password.search(/[0-9]/) < 0) {
            updatedData["error"] = "Password must contain at least one number"
            return res.status(400).render('editAccount', updatedData);
        }
        if(password.search(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) < 0) {
            updatedData["error"] = "Password must contain at least special character"
            return res.status(400).render('editAccount', updatedData);
        }

        const result = await dataUser.updateUserInfo(
            req.session.user.username,
            updatedData.username, 
            updatedData.firstname, 
            updatedData.lastname, 
            updatedData.email,
            updatedData.password);
        const userData = await dataUser.getUserByUsername(req.session.user.username);
        if(!result){
            //could not update user info
            userData["error"] = "Could not edit user info";
            return res.render("editAccount", userData);
        }
        
        const newUserData = await dataUser.getUserByUsername(updatedData.username);
        req.session.user.username = newUserData.username;

        const events = await dataEvent.getInterestedEvents(req.session.user.username);
        return res.render("account", {userData: newUserData, events: events, username: newUserData.username});

    } catch(e) {
        console.log(e);
    }
  })

  router
  .route('/updateEvent/:eventId')
  .get(async (req, res) => {
    if (req.session.user) {
      try {
        const eventId = req.params.eventId;
        // Fetch the event details by eventId
        const event = await dataEvent.getEventById(eventId);

        if (event.username === req.session.user.username) {
          // Render the update event form with event details
          res.render('updateEvent', { event });
        } else {
          // The user doesn't have permission to update this event
          res.redirect('/login');
        }
      } catch (error) {
        // Handle any errors related to fetching events or event not found
        res.status(500).send('Error fetching event: ' + error.message);
      }
    } else {
      res.redirect('/login');
    }
  })
  .post(async (req, res) => {
    const eventId = req.params.eventId; // Extract the event ID from the URL
    const eventData = req.body; // This will contain the updated event details

    try {
      // Validate the eventId
      const validEventId = helpers.checkID(eventId);

      const updateResult = await dataEvent.updateEvent(validEventId, eventData);

      // Redirect to a confirmation page or back to the updated event page
      res.redirect(`/myEvents`);
    } catch (error) {
      // Handle any errors that may occur during the update operation
      res.status(400).send('Update Event Error: ' + error.message);

    }
  });


  router
  .route('/event/:eventId')
  .get(async (req, res) => {
    try {
      const eventId = req.params.eventId;

      // Store the last visited event in the session
      req.session.lastVisitedEvent = eventId;

      // Fetch the event details by eventId
      const event = await dataEvent.getEventById(eventId);

      formatEventDateTime([event]);

      if (req.session.user) {
        return res.render('event', { username: req.session.user.username, event });
      } else {
        // User is not logged in, redirect to login page
        res.redirect('/login');
      }
    } catch (error) {
      // Handle any errors related to fetching events or event not found
      res.status(500).send('Error fetching event: ' + error.message);
    }
  });


  router.route('/addComment/:eventId').post(async (req, res) => {
    if (req.session.user) {
      try {
        const eventId = req.params.eventId;
        const commentText = req.body.commentText;
  
        // Assume dataEvent.createComment returns the newly added comment
        const newComment = await dataEvent.createComment(eventId, commentText, req.session.user.username);
        console.log(newComment.comment_id);
        // Send a JSON response with the newly added comment details
        res.status(201).json({
          commentText: newComment.commentText,
          username: newComment.username,
          eventId: eventId,
          commentId: newComment.comment_id
          // Add other necessary details about the comment if available
        });
      } catch (error) {
        // Handle any errors related to adding comments
        res.status(500).json(error);
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  });
  router.route('/addReply/:eventId/:commentId').post(async (req, res) => {
    if (req.session.user) {
      try {
        const eventId = req.params.eventId;
        const commentId = req.params.commentId;
        const replyText = req.body.replyText;
  
        // Assume dataEvent.replyToComment returns the newly added reply
        const newReply = await dataEvent.replyToComment(eventId, commentId, replyText, req.session.user.username);
  
        // Send a JSON response with the newly added reply details
        res.status(201).json({
          replyText: newReply.replyText,
          username: newReply.username,
          // Add other necessary details about the reply if available
        });
      } catch (error) {
        // Handle any errors related to adding replies
        res.status(500).json(error);
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  });

  router.route('/toggleInterestButton/:eventId').post(async (req, res) => {
    if (req.session.user) {
      try {
        const eventId = req.params.eventId;
        const toggleButton = await dataEvent.toggleInterestedUser(eventId, req.session.user.username);

         // Send a JSON response with the newly added comment details
         res.status(201).json({
          interestCount: toggleButton
         });

      }
      catch {
         // Handle any errors related to clicking button
         res.status(500).json({ error: 'Error clicking button' });
      }
    }
    else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  });
  router.route('/checkInterstedUser/:eventId').get(async (req, res) => {
    if (req.session.user) {
      try {
        const eventId = req.params.eventId;
        const interstedUser = await dataEvent.checkInterstedUser(eventId, req.session.user.username);

         // Send a JSON response 
         res.status(201).json({
          interstedUser: interstedUser
         });

      }
      catch {
         // Handle any errors 
         res.status(500).json({ error: 'Error checking intersted user' });
      }
    }
    else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  });
  


module.exports = router;
