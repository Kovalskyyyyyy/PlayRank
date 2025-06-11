const mongoose = require('mongoose');

const careerEntrySchema = new mongoose.Schema({
  year: String,
  club: String,
  pm: String, // played matches
  g: String,  // goals
  a: String   // assists
}, { _id: false });

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: String,
  age: String,
  position: String,
  secondaryPosition: String,
  transferStatus: String,     // ✅ added
  footed: String,             // ✅ added
  matches: String,
  minutes: String,
  goals: String,
  assists: String,
  coachRating: String,
  teammatesRating: String,
  teammateComments: String,
  highlights: String,
  training: String,
  blog: String,
  height: String,
  weight: String,
  birth: String,
  club: String,
  division: String,
  years: String,
  career: [careerEntrySchema], // ✅ added
  photoUrl: String,
reviews: [
  {
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewerName: String,
    text: String,  // ✅ správne pole
    date: { type: Date, default: Date.now }
  }
]


});



module.exports = mongoose.model('Profile', profileSchema);
