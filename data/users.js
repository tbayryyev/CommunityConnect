const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const validation = require('../validation');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs')
const defaultProfilePicturePath = "/public/images/defaultProfilePicture.jpeg";
const path = require('path');
let { ObjectId } = require('mongodb');

module.exports = {
    async createUser(firstName, lastName, email, username, dateOfBirth, address, city, state, zip, phoneNumber, password) {
        // Checks that 11 arguments were passed
        if (arguments.length !== 11) throw `This function takes 11 arguments but ${arguments.length} were given.`;
        
        // Checks if firstName is undefined
        if (!firstName) throw 'You must provide a firstName.';
        // Checks if lastName is undefined
        if (!lastName) throw 'You must provide a lastName.';
        // Checks if email is undefined
        if (!email) throw 'You must provide a email.';
        // Checks if username is undefined
        if (!username) throw 'You must provide a username.';
        // Checks if dateOfBirth is undefined
        if (!dateOfBirth) throw 'You must provide a dateOfBirth.';
        // Checks if address is undefined
        if (!address) throw 'You must provide a address.';
        // Checks if city is undefined
        if (!city) throw 'You must provide a city.';
        // Checks if state is undefined
        if (!state) throw 'You must provide a state.';
        // Checks if zip is undefined
        if (!zip) throw 'You must provide a zip.';
        // Checks if phoneNumber is undefined
        if (!phoneNumber) throw 'You must provide a phoneNumber.';
        // Checks if password is undefined
        if (!password) throw 'You must provide a password.';

        // Trims fields
        firstName = firstName.trim();
        lastName = lastName.trim();
        email = email.trim();
        username = username.trim();
        city = city.trim();
        state = state.trim();
        zip = zip.trim();
        phoneNumber = phoneNumber.trim();

        // Checks if firstName is valid
        validation.validateName(firstName);
        // Checks if lastName is valid
        validation.validateName(lastName);
        // Checks if email is valid
        validation.validateEmail(email);
        // Checks if username is valid
        validation.validateUsername(username);
        // Checks if dateOfBirth is valid
        validation.validateDateOfBirth(dateOfBirth);
        // Checks if address is a string
        validation.validateString(address);
        // Checks if city is a string
        validation.validateString(city);
        // Checks if state is valid
        validation.validateState(state);
        // Checks if zip is valid
        validation.validateZip(zip);
        // Checks if phoneNumber is valid
        validation.validatePhoneNumber(phoneNumber);
        // Checks if password is valid
        validation.validatePassword(password);

        // Checks if username is available
        let usernameAvailable = await this.isUsernameAvailable(username);
        // Checks if email is available
        let emailAvailable = await this.isEmailAvailable(email);

        //  Throws if usernameAvailable and emailAvailable are false
        if (!usernameAvailable.availability && !emailAvailable.availability) throw 'Username is already taken and Email already in use.';
        // Throws if usernameAvailable is false
        if (!usernameAvailable.availability) throw 'Username is already taken.';
        // Throws if emailAvailable is false
        if (!emailAvailable.availability) throw 'Email already in use.';

        // Hashes password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Sets the users profile picture to the default picture
        let profilePicture = defaultProfilePicturePath;
        // Get users collection
        const userCollection = await users();
        // Creates a new object called newUser
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            dateOfBirth: dateOfBirth,
            profilePicture: profilePicture,
            address: address,
            city: city,
            state: state,
            zip: zip,
            phoneNumber: phoneNumber,
            hashedPassword: hashedPassword
        }
        
        // Adds newUser to the user collection
        const insertInfo = await userCollection.insertOne(newUser);
        // Checks if newUser was added to the database
        if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add user.';

        // Returns an object
        return {"newUserCreated": true};
    },

    async getUserByUsername(username) {
        // Checks that one argument was passed
        if (arguments.length !== 1) throw `This function takes 1 argument but ${arguments.length} were given.`;
        // Checks if username is undefined
        if (!username) throw 'You must provide a username.';
        // Trims username
        username = username.trim();
        // Validates username
        validation.validateUsername(username);
        // Get users collection
        const userCollection = await users();
        // Searches for username in users collection and sets it equal to username
        const userList = await userCollection.find({username: username}).collation({locale: 'en', strength: 2}).toArray();
        // Checks if user was found
        if (userList.length === 0) throw `No user with the username of ${username} was found.`;
        // Returns the first user in the list
        return userList[0];
    },

    async isUsernameAvailable(username) {
       // Checks that one argument was passed
       if (arguments.length !== 1) throw `This function takes 1 argument but ${arguments.length} were given.`;
       // Checks if username is undefined
       if (!username) throw 'You must provide a username.';
       // Trims username
       username = username.trim();
       // Validates username
       validation.validateUsername(username);
       // Get users collection
       const userCollection = await users();
       // Searches for username in users collection and sets it equal to username
       const userList = await userCollection.find({username: username}).collation({locale: 'en', strength: 2}).toArray();
       // Checks if user was found
       if (userList.length === 0) {
           responseObj = {
               availability: true,
               userList: userList
           }
           return responseObj
        //    return true
       } else {
        responseObj = {
            availability: false,
            userList: userList
        }
        return responseObj
        //    return false
       }
    },

    async isEmailAvailable(email) {
        // Checks that one argument was passed
        if (arguments.length !== 1) throw `This function takes 1 argument but ${arguments.length} were given.`;
        // Checks if email is undefined
        if (!email) throw 'You must provide a email.';
        // Trims email
        email = email.trim();
        // Validates email
        validation.validateEmail(email);
        // Get users collection
        const userCollection = await users();
        // Searches for email in users collection and sets it equal to email
        const userList = await userCollection.find({email: email}).collation({locale: 'en', strength: 2}).toArray();
        // Checks if user was found
        if (userList.length === 0) {
            responseObj = {
                availability: true,
                userList: userList
            }
            return responseObj
            // return true
        } else {
            responseObj = {
                availability: false,
                userList: userList
            }
            return responseObj
            // return false
        }
    },

    async authenticateUser(username, password) {
        // Checks that two arguments were passed
        if (arguments.length !== 2) throw `This function takes 2 arguments but ${arguments.length} were given.`;
        // Checks if username is undefined
        if (!username) throw 'You must provide a username.';
        // Checks if password is undefined
        if (!password) throw 'You must provide a password.';
        // Trims username
        username = username.trim();
        // Checks if username is valid
        validation.validateUsername(username);
        // Checks if password is valid
        validation.validatePassword(password);
        // Gets user from database
        const user = await this.getUserByUsername(username);
        // Checks if username is not in database
        if (!user) throw `Either the username or password is invalid.`;
        // Checks if password matches
        let match = await bcrypt.compare(password, user.hashedPassword);
        if (match === true) {
            // Returns an object
            return {"authenticated": true, "user": user};
        } else {
            // Throws an error
            throw `Either the username or password is invalid.`;
        }
    },

    async updateUser(requestUsername, firstName, lastName, email, username, dateOfBirth, address, city, state, zip, phoneNumber) {
         // Checks that 11 arguments were passed
         if (arguments.length !== 11) throw `This function takes 10 arguments but ${arguments.length} were given.`;

         // Checks if firstName is undefined
        if (!firstName) throw 'You must provide a firstName.';
        // Checks if lastName is undefined
        if (!lastName) throw 'You must provide a lastName.';
        // Checks if email is undefined
        if (!email) throw 'You must provide a email.';
        // Checks if username is undefined
        if (!username) throw 'You must provide a username.';
        // Checks if dateOfBirth is undefined
        if (!dateOfBirth) throw 'You must provide a dateOfBirth.';
        // Checks if address is undefined
        if (!address) throw 'You must provide a address.';
        // Checks if city is undefined
        if (!city) throw 'You must provide a city.';
        // Checks if state is undefined
        if (!state) throw 'You must provide a state.';
        // Checks if zip is undefined
        if (!zip) throw 'You must provide a zip.';
        // Checks if phoneNumber is undefined
        if (!phoneNumber) throw 'You must provide a phoneNumber.';

        // Trims fields
        firstName = firstName.trim();
        lastName = lastName.trim();
        email = email.trim();
        username = username.trim();
        city = city.trim();
        state = state.trim();
        zip = zip.trim();
        phoneNumber = phoneNumber.trim();

        // Checks if firstName is valid
        validation.validateName(firstName);
        // Checks if lastName is valid
        validation.validateName(lastName);
        // Checks if email is valid
        validation.validateEmail(email);
        // Checks if username is valid
        validation.validateUsername(username);
        // Checks if dateOfBirth is valid
        validation.validateDateOfBirth(dateOfBirth);
        // Checks if address is a string
        validation.validateString(address);
        // Checks if city is a string
        validation.validateString(city);
        // Checks if state is valid
        validation.validateState(state);
        // Checks if zip is valid
        validation.validateZip(zip);
        // Checks if phoneNumber is valid
        validation.validatePhoneNumber(phoneNumber);

        // Checks if username is available
        let usernameAvailableResponse = await this.isUsernameAvailable(username);
        // Checks if email is available
        let emailAvailableResponse = await this.isEmailAvailable(email);
        let usernameAvailable = usernameAvailableResponse.availability;
        let emailAvailable = emailAvailableResponse.availability;
        // Get oldUserInfo from database before we update data
        const oldUserInfo = await this.getUserByUsername(requestUsername);

        if (!usernameAvailableResponse.availability) {
            if (usernameAvailableResponse.userList[0].username !== oldUserInfo.username) {
                usernameAvailable = false;
            } else {
                usernameAvailable = true;
            }
        }

        if (!emailAvailableResponse.availability) {
            if (emailAvailableResponse.userList[0].email !== oldUserInfo.email) {
                emailAvailable = false;
            } else {
                emailAvailable = true;
            }
        }

        //  Throws if usernameAvailable and emailAvailable are false
        if (!usernameAvailable && !emailAvailable) throw 'Username is already taken and Email already in use.';
        // Throws if usernameAvailable is false
        if (!usernameAvailable) throw 'Username is already taken.';
        // Throws if emailAvailable is false
        if (!emailAvailable) throw 'Email already in use.';

        // Get users collection
        const userCollection = await users();

        // Updates user
        const updateResponse = await userCollection.updateOne(
            {"username": oldUserInfo.username}, 
            { $set : {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "username": username,
                "dateOfBirth": dateOfBirth,
                "address": address,
                "city": city,
                "state": state,
                "zip": zip,
                "phoneNumber": phoneNumber
                }
        });
        
        // Checks if update was successful
        if (updateResponse.modifiedCount !== 1) throw 'User not updated.';
        // Returns object stating update was a success
        return {'updated': true };


    },

    async updateProfilePicture(username, url) {
        // Checks that one argument was passed
        if (arguments.length !== 2) throw `This function takes 2 arguments but ${arguments.length} were given.`;
        // Checks if username is undefined
        if (!username) throw 'You must provide an username.';
        // Checks if url is undefined
        if (!url) throw 'You must provide a url.';
        // Gets user from database
        const user = await this.getUserByUsername(username);
        // Checks if user was found
        if (!user) throw `Username not found.`;
        // Declares a variable named oldProfilePicture and sets it equal to the user's current profile picture file name
        let oldProfilePicture = user.profilePicture;
        // Checks if profile picture is not default profile picture
        if (oldProfilePicture !== defaultProfilePicturePath) {
            // Declares a variable named imagePath and sets it equal to the image path of the oldProfilePicture
            let imagePath = path.join(__dirname, `..${oldProfilePicture}`);
            // Deletes old profile picture
            fs.unlinkSync(imagePath);
        }
        // Get users collection
        const userCollection = await users();
        // Updates profile picture in database
        const updateResponse = await userCollection.updateOne({"username": username}, { $set: { "profilePicture": url }});
        // Checks if update was successful
        // Checks if update was successful
        if (updateResponse.modifiedCount !== 1) throw 'User not updated';
        // Returns object stating update was a success
        return {'updated': true };
    },
    async getUser(id){
        if(arguments.length < 1){
          throw "All fields need to have valid values";
      }
      if(arguments.length > 1){
          throw "Too many Aruguments, should pass one argument";
      }
          var result = {};
        if (!id) throw 'Must Provide an id to search for';
        if (typeof id !== 'string') throw 'Id must be a string';
        if (id.trim().length === 0)
          throw 'Id cannot be an empty string or just spaces';
        id = id.trim();
        if (!ObjectId.isValid(id)) throw 'Invalid object ID';
        const userCollection = await users();
        const userOne = await userCollection.findOne({ _id: ObjectId(id) });
        if (userOne === null || userOne === undefined) throw 'No user with that id';
        userOne._id = userOne._id.toString();
        return userOne;
      }
}