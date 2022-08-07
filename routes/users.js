const router = require("express").Router()
const User = require('../models/User')
const usercontroller = require('../controllers/userController')

// Get a User  
router.get('/', usercontroller.getUser)
// Update User 
router.put('/:id', usercontroller.updateUser)
// Delete User 
router.delete('/:id', usercontroller.deleteUser)
//get friends
router.get("/friends/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const friends = await Promise.all(
        user.following.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      res.status(200).json(friendList)
    } catch (err) {
      res.status(500).json(err);
    }
  });
// Folloow a User 
router.put('/:id/follow', usercontroller.followUser)
// Unfollow a User 
router.put('/:id/unfollow', usercontroller.unfollowUser)

module.exports = router