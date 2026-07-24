import Newsletter from '../models/newsletterModel.js';

// @desc    Subscribe an email to the newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  try {
    await Newsletter.create({ email: email.toLowerCase().trim() });
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ message: "You're already subscribed" });
    }
    res.status(500).json({ message: 'Something went wrong, please try again' });
  }
};

export { subscribe };
