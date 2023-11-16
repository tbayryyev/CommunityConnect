//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
const { ObjectId, ConnectionCheckOutStartedEvent } = require("mongodb");

function checkString(string) {
    if (!string){
        throw "Error: You must provide a string for your input";
    } 
    if (typeof string !== 'string'){
        throw "Error: input must be a string";
    } 
    if (string.trim().length === 0) {
        throw "Error: input cannot be an empty string or string with just spaces";
    }
}

function checkNum(num) {
    if (num === undefined || num === null) {
        throw "Error: You must provide a number for your input";
    }
    if (typeof num !== 'number' || isNaN(num)) {
        throw "Error: Input must be a valid number";
    }
    if (num < 0) {
        throw "Error: Input cannot be a negative number";
    }
}

function checkID(id) {
    if (!id) throw "You must provide an id to search for";
    if (typeof id !== "string") throw "Id must be a string";
    if (id.trim().length === 0) throw "Id cannot be an empty string or just spaces";
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "invalid object ID";
    return id;
}

function isValidUsername(username) {
    const regex = /^[a-zA-Z0-9]*$/;
  
    if (typeof username !== "string") {
      return false;
    }
  
    if (username.length <= 3) {
      return false;
    }
  
    return regex.test(username);
  }
module.exports = {checkString, checkNum, checkID, isValidUsername};