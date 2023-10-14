const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require('mongodb');
const users = mongoCollections.user_collection;
const bcrypt = require('bcrypt');
const saltRounds = 2;
const helpers = require('../helpers');

const createUser = async (
  username, password
) => { 
  helpers.checkString(username);
  helpers.checkString(password);

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

  const hashpassword = await bcrypt.hash(password, saltRounds);

  let user = {
    _id: ObjectId(),
    username: username,
    password: hashpassword
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

module.exports = {createUser, checkUser};
