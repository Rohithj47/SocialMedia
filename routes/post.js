const postController = require('../controllers/postController')
const router = require('express').Router()
const Post = require('../models/Post')


router.post("/", postController.createpost);
  //update a post
  
router.put("/:id", postController.updatePost);
  //delete a post
  
router.delete("/:id", postController.deletePost);
  //like / dislike a post
  
router.put("/:id/like", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //get a post
  
router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  
//get timeline posts

router.get("/timeline/:userId", postController.timelinePosts);

//get posts for a user 

router.get("/profile/:username", postController.profilePosts);

module.exports = router
