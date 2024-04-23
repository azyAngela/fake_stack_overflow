const express = require("express");
const Profile = require("../models/profiles");
const router = express.Router();
router.use(express.json());


router.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Mock authentication
    try{
      const userQuery = Profile.findOne({ username: username, password: password });
      const user = await userQuery.populate('questions').populate('answers');

      if (user) {
        req.session.user = user.toObject();
        res.status(200).json({ isloggedin: true, user });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }catch(error){
        res.status(500).json({ message: error.message });
    }
  });

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

router.get('/check-login', (req, res) => {
    const user = req.session.user;
    res.json({ loggedIn: !!user, user });
  });
  
router.post('/updateProfile', async (req, res) => {
  const { username, password, email } = req.body;
  const user = await Profile.findOne({ email: email});
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const updatedUser = await Profile.findOneAndUpdate({ _id: user._id }, { username, password, email }, { new: true }).populate('questions').populate('answers');
    res.json({user:updatedUser});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }


});


// add appropriate HTTP verbs and their endpoints to the router.
router.post("/signup", async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ message: "Required Credential Missing!" });
    }
    try {
        if (await Profile.findOne({ email: email })) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const newProfile = new Profile( { username: username, password: password, email:email, created_date_time: new Date(),
        answers: [], questions: [], reputation: 0 });
        await newProfile.save();

        //req.session.user = newProfile;

        // Send back the saved answer
        res.status(200).json({ message: 'User created successfully', user: newProfile });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }

});
module.exports = router;
