const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require('mongodb');
const users = mongoCollections.user_collection;
const bcrypt = require('bcrypt');
const saltRounds = 2;
const helpers = require('../helpers');

const createUser = async (
  username, password,firstname,lastname,birth_date,email
) => { 
  helpers.checkString(username);
  helpers.checkString(password);
  helpers.checkString(firstname);
  helpers.checkString(lastname);
  helpers.checkString(email);

  if(username.length < 4) {
    throw "Error: username length too short"
  }

  const regex = /^[a-zA-Z0-9]*$/;

  if(regex.test(username) === false) {
    throw "Error: username must contain no spaces and only alphabets and numbers"
  }

  if(password.length < 6) {
    throw "Error: password length too short"
  }

  if(password.search(/[A-Z]/) < 0) {
    throw "Error: password must contain at least one upper case letter"
  } 
  if(password.search(/[0-9]/) < 0) {
    throw "Error: password must contain at least one number"
  }
  if(password.search(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) < 0) {
    throw "Error: password must contain at least special character"
  }

  username = username.toLowerCase();

  const usersCollection = await users();

  const userData = await usersCollection.findOne({ username: username });

  if (userData !== null) {
      throw "Error: the username supplied exists already";
  }
  const userData1 = await usersCollection.findOne({ email: email });
  if (userData1 !== null) {
    throw "Error: the email supplied has already been used to create another account";
  } 

  var birthdate = new Date(birth_date);
  var today = new Date();
  var age = today.getFullYear() - birthdate.getFullYear();

  if(age < 18){
    throw "Error: you must be 18 or older to create an account"
  }



  const hashpassword = await bcrypt.hash(password, saltRounds);

  let user = {
    _id: ObjectId(),
    username: username,
    password: hashpassword,
    firstname: firstname,
    lastname: lastname,
    birthdate: birth_date,
    email: email
  };

  const insertData = await usersCollection.insertOne(user);

  if (!insertData.insertedId || !insertData.acknowledged) {
      throw 'Error: user was not inserted successfully';
  }
  else {
    let inserted = { insertedUser: true };
    return inserted;
  }

};

const checkUser = async (username, password) => { 
  helpers.checkString(username);
  helpers.checkString(password);

  const usersCollection = await users();

  const userData = await usersCollection.findOne({ username: username });

  if (userData === null) {
      throw "Error: Either the username or password is invalid";
  }

  let hashpassword = false;
  hashpassword = await bcrypt.compare(password, userData.password);

  if (hashpassword === false) {
      throw "Error: Either the username or password is invalid";
  }

  return { authenticatedUser: true };
};

const getUserByUsername = async(username) => {
    helpers.checkString(username);
    const usersCollection = await users();
    const userData = await usersCollection.findOne({username: username });
    if(userData == null){
        throw "Error: Either the username or password is invalid";
    }
    return userData;
}

module.exports = {createUser, checkUser, getUserByUsername};
