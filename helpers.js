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

module.exports = {checkString};