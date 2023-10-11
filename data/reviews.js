const mongoCollections = require("../config/mongoCollections");
const REVIEWS = mongoCollections.reviews;
// const USERS = mongoCollections.users;
const DOCTORS = mongoCollections.doctors;
let { ObjectId } = require('mongodb');
const validation = require('../validation');
const users = require("./users");



const exported = {
  getReviews: async (doctorID) => {
    doctorID = validation.checkId(doctorID, "doctorID");

    const reviewCollection = await REVIEWS();

    const reviews = await reviewCollection.find({}).toArray();

    reviewList = [];

    for (review of reviews) {
      if (review.doctorID == doctorID) {
        reviewList.push(review)
      }
    }
    // console.log(reviewList);
    return reviewList;

  },
  createReview: async (doctorID, reviewText, userID, rating) => {
    doctorID = validation.checkId(doctorID, "doctorID");
    reviewText = validation.checkString(reviewText, "reviewText");
    userID = validation.checkId(userID, "userID");
    rating = validation.errorCheckingFunc("rating", rating, "number");
    if (rating > 5 || rating < 1) throw 'rating out of range'





    const reviewCollection = await REVIEWS();

    const doctorCollection = await DOCTORS();

    const reviews = await reviewCollection.find({}).toArray();



    for (review of reviews) {
      if ((review.doctorID == doctorID) && (review.userID == userID)) throw 'Review already created for this doctor';
    }

    const user2 = await users.getUser(userID);


    const newReview = {
      _id: ObjectId(),
      doctorID: doctorID,
      userID: userID,
      username: user2.username,
      reviewText: reviewText,
      rating: rating,
      comments: []
    }

    const insertInfo = await reviewCollection.insertOne(newReview);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw 'Review could not be created';
    }

    let reviewList = await exported.getReviews(doctorID);


    let rating1 = 0;
    let count = 0;


    // update the overall rating for the doctor in the doctors database
    // loop through all the reviews for the doctor and get the average rating
    if (reviewList.length != 0) {
      for (review of reviewList) {
        rating1 += review.rating;
        count++
      }

      rating1 = rating1 / count;
      rating1 = rating1.toPrecision(2);
      const updateInfo = await doctorCollection.updateOne({ _id: ObjectId(doctorID) }, { $set: { rating: rating1 } });
      if (updateInfo.matchedCount === 0) {
        throw "could not add rating to doctor";

      }


    }

    // const updateInfo2 = await doctorCollection.updateOne({ _id: ObjectId(doctorID) }, { $addToSet: { reviews: newReview } });

    // if (updateInfo2.modifiedCount === 0) {
    //   throw "could not add review to doctor";
    //
    // }


    newReview._id = newReview._id.toString();
    return newReview;


  },
  deleteReview: async (doctorID,userID) => {
    const reviewCollection = await REVIEWS();
    const reviews = await reviewCollection.find({}).toArray();


    const review = await reviewCollection.deleteOne({ doctorID: doctorID,userID:userID });
    // console.log(review);

    if (review.modifiedCount === 0) {
      throw "no review exists with that id";
    }

    let reviewList = await exported.getReviews(doctorID);


    let rating1 = 0;
    let count = 0;


    // update the overall rating for the doctor in the doctors database
    // loop through all the reviews for the doctor and get the average rating
    if (reviewList.length != 0) {
      for (review_obj of reviewList) {
        rating1 += review_obj.rating;
        count++
      }

      rating1 = rating1 / count;
      rating1 = rating1.toPrecision(2);

      const doctorCollection = await DOCTORS();
      const updateInfo = await doctorCollection.updateOne({ _id: ObjectId(doctorID) }, { $set: { rating: rating1 } });
      if (updateInfo.matchedCount === 0) {
        throw "could not add rating to doctor";

      }


    }
    else{
      const doctorCollection = await DOCTORS();
      const updateInfo = await doctorCollection.updateOne({ _id: ObjectId(doctorID) }, { $set: { rating: 0 } });
      if (updateInfo.matchedCount === 0) {
        throw "could not add rating to doctor";

      }
    }

  }



}
module.exports = exported;
