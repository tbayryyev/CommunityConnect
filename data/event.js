const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require('mongodb');
const event = mongoCollections.event_collection;
const helpers = require('../helpers');

const createEvent = async (
    eventName, description, eventDate, eventTime, eventLocation
) => {
    // Validate input data
    // helpers.checkString(eventName);
    // helpers.checkString(description);
    // helpers.checkString(eventLocation);
  
    // if (!isValidDate(eventDate)) {
    //   throw new Error('Event Date must be a valid date string (YYYY-MM-DD)');
    // }
  
    // if (!isValidTime(eventTime)) {
    //   throw new Error('Event Time must be a valid time string (HH:MM AM/PM)');
    // }

    // Create the event object
    let eventData = {
      _id: ObjectId(),
      eventName,
      description,
      eventDate,
      eventTime,
      eventLocation,
    };

    const eventCollection = await event();

    const insertData =  await eventCollection.insertOne(eventData);

    if (!insertData.insertedId || !insertData.acknowledged) {
        throw 'Error: user was not inserted successfully';
    }
    else {
      let inserted = { insertedUser: true };
      return inserted;
    }  
  }
  
  module.exports = { createEvent };