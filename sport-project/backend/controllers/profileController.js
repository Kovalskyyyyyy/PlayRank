const Profile = require('../models/Profile');
const User = require('../models/User');

// Uloženie alebo aktualizácia profilu
exports.saveProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    let photoUrl = '';
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    // parsuj polia
    const career = data.career ? JSON.parse(data.career) : [];
    const injuries = data.injuries ? JSON.parse(data.injuries) : [];
    const matchesData = data.matchesData ? JSON.parse(data.matchesData) : [];

    // vytvor dáta
    const profileData = {
      ...data,
      userId,
      photoUrl: photoUrl || data.photoUrl,
      career,
      injuries,
      matchesData
    };

    delete profileData.reviews; // nech sa nerešia recenzie tu

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

// Získaj vlastný profil
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Získaj verejný profil podľa userId
exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.id });
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Vyhľadávanie hráčov podľa mena (z profilu)
exports.searchPlayers = async (req, res) => {
  try {
    const q = req.query.q;
    const matches = await Profile.find({
      name: { $regex: q, $options: 'i' }
    }).select('userId name club photoUrl').limit(5);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Pridanie recenzie
exports.addReview = async (req, res) => {
  try {
    const reviewerProfile = await Profile.findOne({ userId: req.user.id });
    const targetProfile = await Profile.findOne({ userId: req.params.id });

    if (!reviewerProfile || !targetProfile)
      return res.status(404).json({ msg: 'Profile not found' });

    if (reviewerProfile.club !== targetProfile.club)
      return res.status(403).json({ msg: 'Only players from the same club can review' });

    const reviewText = req.body.text;

    if (!reviewText || typeof reviewText !== 'string' || reviewText.trim() === '') {
      return res.status(400).json({ msg: 'Review text is required' });
    }

    const review = {
      reviewerId: req.user.id,
      reviewerName: reviewerProfile.name,
      text: reviewText.trim(),
      date: new Date()
    };

    if (!Array.isArray(targetProfile.reviews)) {
      targetProfile.reviews = [];
    }

    targetProfile.reviews.push(review);
    await targetProfile.save();

    res.status(201).json(targetProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Zmazanie recenzie
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
