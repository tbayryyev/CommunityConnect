//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
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

// Helper function to validate the date format (YYYY-MM-DD)
function isValidDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
    }

// Helper function to validate the time format (HH:MM AM/PM)
function isValidTime(time) {
    const timeRegex = /^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/i;
    return timeRegex.test(time);
}

module.exports = {checkString, isValidDate, isValidTime};