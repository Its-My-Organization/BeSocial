const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res, next) => {
  try {
    // GENERATE HASHED PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // CREATE NEW USER
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // SAVE USER AND RESPOND
    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log("error :>> ", error);
    return res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    !user && res.status(404).json("User not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("Wrong Password");

    return res.status(200).json(user);
  } catch (error) {
    console.log("error :>> ", error);
    return res.status(500).json(error);
  }
});

module.exports = router;
