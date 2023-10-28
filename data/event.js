const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require('mongodb');
const event = mongoCollections.event_collection;
const helpers = require('../helpers');

const createEvent = async (
    username,eventName, description, eventDate, eventTime, eventLocation, cost
) => {
    //Validate input data
    helpers.checkString(eventName);
    helpers.checkString(description);
    helpers.checkString(eventLocation);

    helpers.checkNum(cost);

    // Create the event object
    let eventData = {
      _id: ObjectId(),
      username,
      eventName,
      description,
      eventDate,
      eventTime,
      eventLocation,
      cost
    };

    const eventCollection = await event();

    const insertData =  await eventCollection.insertOne(eventData);

    if (!insertData.insertedId || !insertData.acknowledged) {
        throw 'Error: event was not inserted successfully';
    }
    else {
      insertData.insertedId = insertData.insertedId.toString();
      return insertData.insertedId;
    }  
  }
  const getEvents = async () => {
    const eventCollection = await event();
    const events = await eventCollection.find({}).toArray();
    return events;
}
  const getMyEvents = async(username) => {
    const eventCollection = await event();
    const events = await eventCollection.find({ username: username }).toArray();
    if(events == null){
        throw "Error: Either the username or password is invalid";
    }
    return events;
  }

  const getEventById = async (eventId) => {
    eventId = helpers.checkID(eventId.toString());
    const eventCollection = await event();
    const newEvent = await eventCollection.findOne({_id: ObjectId(eventId)});
    if (!newEvent) throw "No event with that id";
    return newEvent;
  };

  const removeEvent = async (eventId) => {
    eventId = helpers.checkID(eventId.toString());
    const eventCollection = await event();
    let evtName = await getEventById(eventId.toString());
    let eventName = evtName.eventName;
    const deletionInfo = await eventCollection.deleteOne({ _id: ObjectId(eventId) });
    if (deletionInfo.deletedCount === 0) throw `Could not delete event with id of ${eventId}`;
    return `${eventName} has been successfully deleted!`; 
  };

  module.exports = { createEvent,getEvents,getMyEvents, getEventById, removeEvent };