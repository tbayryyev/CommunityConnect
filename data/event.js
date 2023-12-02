const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require('mongodb');
const event = mongoCollections.event_collection;
const helpers = require('../helpers');
const profanityList = ['wtf', 'fck', 'smd']; // profanity words here

const createEvent = async (
    eventUsername,eventName, description, eventDate, eventTime, eventLocation, cost, link, eventImage, imageFileName
) => {
    //Validate input data
    helpers.checkString(eventName);
    helpers.checkString(description);
    helpers.checkString(eventLocation);

    helpers.checkNum(cost);

    // Create the event object
    let eventData = {
      _id: ObjectId(),
      eventUsername,
      eventName,
      description,
      eventDate,
      eventTime,
      eventLocation,
      cost, 
      link,
      eventImage,      // Save the image data
      imageFileName,   // Save the image file name
      interestCount: 0,
      interestedUsers: [], // Initialize the interestedUsers array
      comments: []
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
    const events = await eventCollection.find({ eventUsername: username }).toArray();
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


  const updateEvent = async (eventId, updatedEventData) => {
    eventId = helpers.checkID(eventId.toString());
    const eventCollection = await event();
    const existingEvent = await eventCollection.findOne({ _id: ObjectId(eventId) });
  
    if (!existingEvent) {
      throw "No event with that id";
    }
  
    // Construct the updated event object
    const updatedEvent = {
      eventUsername: updatedEventData.eventUsername || existingEvent.eventUsername,
      eventName: updatedEventData.eventName || existingEvent.eventName,
      description: updatedEventData.description || existingEvent.description,
      eventDate: updatedEventData.eventDate || existingEvent.eventDate,
      eventTime: updatedEventData.eventTime || existingEvent.eventTime,
      eventLocation: updatedEventData.eventLocation || existingEvent.eventLocation,
      cost: updatedEventData.cost || existingEvent.cost,
      link: updatedEventData.link,
      eventImage: updatedEventData.eventImage || existingEvent.eventImage,
      imageFileName: updatedEventData.imageFileName || existingEvent.imageFileName,
      interestCount: existingEvent.interestCount
    };
  
    const updatedData = await eventCollection.updateOne(
      { _id: ObjectId(eventId) },
      { $set: updatedEvent }
    );
  
    if (updatedData.modifiedCount === 0) {
      throw `Could not update event with id of ${eventId}`;
    }
  
    return await getEventById(eventId); // Return the updated event
  };

  const toggleInterestedUser = async (eventId, username) => {
    const eventCollection = await event();
    const events = await eventCollection.findOne({ _id: ObjectId(eventId) });
    
    if(events == null){
        throw "Error: event not found";
    }

    // Check if the username is already in the interestedUsers array
    const index = events.interestedUsers.indexOf(username);

    if (index !== -1) {
      // Username is already in the array, so remove it
      events.interestedUsers.splice(index, 1);
    } else {
      // Username is not in the array, so add it
      events.interestedUsers.push(username);
    }

    // Update the interestCount variable based on the length of the interestedUsers array
    const interestCount = events.interestedUsers.length;

    await eventCollection.updateOne({ _id: ObjectId(eventId) }, { $set: { interestedUsers: events.interestedUsers, interestCount } });

    return interestCount;
  };

  const checkInterstedUser = async (eventId, username) => {
    const eventCollection = await event();
    const events = await eventCollection.findOne({ _id: ObjectId(eventId) });
    
    if(events == null){
        throw "Error: event not found";
    }

    // Check if the username is already in the interestedUsers array
    const index = events.interestedUsers.indexOf(username);

    if (index !== -1) {
    // username in array
      return true;
    }

    return false;
  };

  const getInterestedEvents = async (username) => {
    const eventCollection = await event();
    const events = [];

    const allEvents = await eventCollection.find({}).toArray();

    for (const i of allEvents) {
        if (await checkInterstedUser(i._id, username)) {
            events.push(i);
        }
    }

    return events;
  };

  const createComment =  async (eventId, commentText, username) => {
    eventId = helpers.checkID(eventId.toString());
    helpers.checkString(commentText);

    const eventCollection = await event();
    const existingEvent = await eventCollection.findOne({ _id: ObjectId(eventId) });
  
    if (!existingEvent) {
      throw "No event with that id";
    };

      // Profanity filter implementation
    const containsProfanity = profanityList.some((word) =>
    commentText.toLowerCase().includes(word)
    );

    if (containsProfanity) {
    throw "Comment contains profanity and cannot be posted.";
    }


    const newComment = {
      comment_id: ObjectId(),
      username: username,
      commentText: commentText,
      replies: [] // Add a property to hold replies for this comment

    }
    const updateInfo = await eventCollection.updateOne({ _id: ObjectId(eventId) }, { $addToSet: { comments: newComment } });

    if (updateInfo.modifiedCount === 0) {
      throw "could not add the comment successfully";

    }
    newComment.comment_id = newComment.comment_id.toString();
    return newComment

  };

  const replyToComment = async (eventId, commentId, replyText, username) => {
    eventId = helpers.checkID(eventId.toString());
    helpers.checkString(replyText);
  
    const eventCollection = await event(); // Assuming `event()` is a function that returns the event collection
  
    const existingEvent = await eventCollection.findOne({ _id: ObjectId(eventId) });
    if (!existingEvent) {
      throw "No event with that id";
    }
       // Profanity filter implementation
       const containsProfanity = profanityList.some((word) =>
       replyText.toLowerCase().includes(word)
       );
   
       if (containsProfanity) {
       throw "reply contains profanity and cannot be posted.";
       }
   
  
    const reply = {
      reply_id: ObjectId(),
      username: username,
      replyText: replyText
    };
  
    const updateInfo = await eventCollection.updateOne(
      { _id: ObjectId(eventId), "comments.comment_id": ObjectId(commentId) },
      { $push: { "comments.$.replies": reply } }
    );
  
    if (updateInfo.modifiedCount === 0) {
      throw "Could not add the reply successfully";
    }
  
    return reply;
  };

  module.exports = { createEvent,getEvents,getMyEvents, getEventById, removeEvent, updateEvent, toggleInterestedUser, createComment, checkInterstedUser, getInterestedEvents, replyToComment };

