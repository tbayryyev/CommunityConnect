const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require('mongodb');
const event = mongoCollections.event_collection;
const helpers = require('../helpers');

const createEvent = async (
    eventName, description, eventDate, eventTime, eventLocation
) => {
    //Validate input data
    helpers.checkString(eventName);
    helpers.checkString(description);
    helpers.checkString(eventLocation);

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
        throw 'Error: event was not inserted successfully';
    }
    else {
      let inserted = { insertedEvent: true };
      return inserted;
    }  
  }
  const getEvents = async () => {
    const eventCollection = await event();
    const events = await eventCollection.find({}).toArray();
    return events;
}
  
  module.exports = { createEvent,getEvents };