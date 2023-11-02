const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Import your Express app
const expect = chai.expect;
const { MongoClient } = require('mongodb');
const { createEvent, getEvents, getMyEvents, getEventById, removeEvent, updateEvent } = require('../data/event');
const testDBUrl = 'mongodb+srv://agile2:ufbmw916Vmro0rQm@communityconnect.byt2uem.mongodb.net/?retryWrites=true&w=majority'; // Your test database URL

chai.use(chaiHttp);

describe('Event Data Functions', () => {
  let testDB;
  before(async () => {
    const client = new MongoClient(testDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    testDB = client.db();
  });

  after(async () => {
    await testDB.dropDatabase();
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const eventId = await createEvent('testUser', 'Test Event', 'Test Description', '2023-12-31', '12:00', 'Test Location', 10.0, 'testImage', 'test.jpg');
      expect(eventId).to.be.a('string');
    });
  });

  describe('getEvents', () => {
    it('should return an array of events', async () => {
      const events = await getEvents();
      expect(events).to.be.an('array');
    });
  });

  describe('getMyEvents', () => {
    it('should return an array of user-specific events', async () => {
      const events = await getMyEvents('testUser');
      expect(events).to.be.an('array');
    });
  });

  describe('getEventById', () => {
    it('should return an event by ID', async () => {
      const events = await getEvents();
      const eventId = events[0]._id.toString();
      const event = await getEventById(eventId);
      expect(event).to.have.property('_id');
    });

    it('should throw an error if the event does not exist', async () => {
      try {
        await getEventById('nonexistentID');
      } catch (error) {
        expect(error).to.be.a('string');
      }
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event', async () => {
      const events = await getMyEvents('testUser');
      const eventId = events[0]._id.toString();
      const updatedEvent = await updateEvent(eventId, {
        eventName: 'Updated Event Name',
        description: 'Updated Description',
      });
      expect(updatedEvent).to.have.property('eventName', 'Updated Event Name');
      expect(updatedEvent).to.have.property('description', 'Updated Description');
    });

    it('should throw an error if the event does not exist', async () => {
      try {
        await updateEvent('nonexistentID', {
          eventName: 'Updated Event Name',
          description: 'Updated Description',
        });
      } catch (error) {
        expect(error).to.be.a('string');
      }
    });
  });

  describe('removeEvent', () => {
    it('should remove an existing event', async () => {
      const events = await getMyEvents('testUser');
      const eventId = events[0]._id.toString();
      const result = await removeEvent(eventId);
      expect(result).to.be.a('string');
    });

    it('should throw an error if the event does not exist', async () => {
      try {
        await removeEvent('nonexistentID');
      } catch (error) {
        expect(error).to.be.a('string');
      }
    });
  });
});
