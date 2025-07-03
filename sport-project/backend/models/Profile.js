const mongoose = require('mongoose');

const careerEntrySchema = new mongoose.Schema({
  year: String,
  club: String,
  pm: String,
  g: String,
  a: String
}, { _id: false });

const matchEntrySchema = new mongoose.Schema({
  match: Number,
  goals: Number,
  assists: Number,
  minutes: Number
}, { _id: false });

const videoCategorySchema = new mongoose.Schema({
  name: String,
  count: { type: Number, default: 0 }
}, { _id: false });

const bioPhysicalSchema = new mongoose.Schema({
  bmi: String,
  bodyType: String,
  sprintTimes: String,
  reactionTime: String,
  endurance: String,
  vo2max: String,
  jumpVertical: String,
  jumpStanding: String,
  jumpTechnique: String,
  strengthBench: String,
  strengthIsometric: String,
  injuries: String,
  healthStatus: String,
  flexibility: String,
  screening: String
}, { _id: false });

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: String,
  age: String,
  position: String,
  secondaryPosition: String,
  transferStatus: String,
  footed: String,
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
  phone: String,
  email: String,
  contractExpires: String,
  career: [careerEntrySchema],
  matchesData: [matchEntrySchema],
  videoCategories: [videoCategorySchema],
  bioPhysical: {
    type: bioPhysicalSchema,
    default: () => ({})
  },
  photoUrl: String,
  reviews: [
    {
      reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reviewerName: String,
      text: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Profile', profileSchema);
