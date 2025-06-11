const Profile = require('../models/Profile');

exports.saveProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    // Fotka
    let photoUrl = '';
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    const career = data.career ? JSON.parse(data.career) : [];

    const profileData = {
      ...data,
      userId,
      photoUrl: photoUrl || data.photoUrl,
      career,
    };

    const existing = await Profile.findOne({ userId });
    if (existing) {
      await Profile.updateOne({ userId }, profileData);
      return res.json({ msg: 'Profile updated' });
    }

    await Profile.create(profileData);
    res.status(201).json({ msg: 'Profile created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.id });
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.searchPlayers = async (req, res) => {
  try {
    const q = req.query.q;
    const matches = await Profile.find({
      name: { $regex: q, $options: 'i' }
    }).limit(5);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const reviewerProfile = await Profile.findOne({ userId: req.user.id });
    const targetProfile = await Profile.findOne({ userId: req.params.id });

    if (!reviewerProfile || !targetProfile)
      return res.status(404).json({ msg: 'Profile not found' });

    if (reviewerProfile.club !== targetProfile.club)
      return res.status(403).json({ msg: 'Only players from the same club can review' });

    const review = {
      reviewerId: req.user.id,
      reviewerName: reviewerProfile.name,
      text: req.body.text,  // <- TOTO JE DÔLEŽITÉ
      date: new Date()
    };

    targetProfile.reviews.push(review);
    await targetProfile.save();

    res.status(201).json(targetProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.id });
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });

    const review = profile.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ msg: 'Review not found' });

    if (review.reviewerId.toString() !== req.user.id)
      return res.status(403).json({ msg: 'You can only delete your own review' });

    review.remove();
    await profile.save();
    res.json({ msg: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

