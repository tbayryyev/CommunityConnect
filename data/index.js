//Here you will require data files and export them as shown in lecture code and worked in previous labs.

const dataUser = require('./users');
const dataEvent = require('./event')

module.exports = {
    users: dataUser,
    event: dataEvent
};