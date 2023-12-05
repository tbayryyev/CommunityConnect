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

function convert24HourTime(time){
    let hour = parseInt(time.split(":")[0]);
    let minute = time.split(":")[1];
    let newTime = time;
    if(hour == 0){
        newTime = "12:" + minute + " AM";
    }
    else if(hour > 12){
        let newHour = hour - 12;
        newTime = newHour + ":" + minute + " PM";
    }
    else{
        newTime = time + " PM";
    }
    return newTime;
}

function getMonthNameFromMonthIndex(monthIndex){
    let months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    return months[monthIndex];
}

function getOrdinalString(num){
    let remainder = num%10;
    if(remainder == 1){
        return num + "st";
    } else if(remainder == 2){
        return num + "nd";
    } else if(remainder == 3){
        return num + "rd";
    } 
    return num + "th";
}

function formatDateString(dateString) {
    let splitDate = dateString.split("-");
    let year = splitDate[0];
    let month = parseInt(splitDate[1]);
    let day = parseInt(splitDate[2]);
    let newDate = getMonthNameFromMonthIndex(month-1) + " " + getOrdinalString(day) + ", " + year;
    return newDate;
}
module.exports = {checkString, checkNum, checkID, isValidUsername, convert24HourTime, formatDateString};