const Post = require('../models/Post')
const User = require('../models/User')
const { body, validationResult } = require('express-validator')

module.exports.createpost = [
    body("userId", "userId is mandatory field")
        .trim()
        .isLength({min: 3})
        .escape(),
    (req, res) => {
        const err = validationResult(req.body)
        if (!err.isEmpty()) { return res.status(500).json({ error: err.array() })}

        Post.create(req.body, (err, post) => {
            if(!post) { return res.status(500).json(err) }
            return res.status(201).json(post)
        })
    }
]

module.exports.updatePost = (req, res) => {
          const post = Post.findById(req.params.id, (err, post) => {
            if(err) { return res.status(500).json(" No post Found") }
            if (post.userId === req.body.userId) {
                post.updateOne({ $set: req.body }, (err, post) => {
                    if(err) { return res.status(500).json(err) }
                    res.status(200).json("the post has been updated");
                });
              } else {
                res.status(403).json("you can update only your post");
              }
          });
}


module.exports.deletePost = (req, res) => {
    const post = Post.findById(req.params.id, (err, post) => {
      if(err) { return res.status(500).json(" No post Found") }
      if (post.userId === req.body.userId) {
          post.deleteOne()
          res.status(200).json("Post deleted succesfully")
        } else {
          res.status(403).json("you can delete only your post");
        }
    });
}

// module.exports.timelinePosts = [
//   (req,res) => {
//     returnPosts = []
//     User.findById(req.params.userId, async (err, user) => {
//       if(err) { return res.status(500).json(err)}
//       Post.find({userId: user._id }, async (err, posts) => {
//         if(err) { return res.status(500).json(err) }
//         const friendPosts = await Promise.all(
//           user.following.map((friendId) => {
//             return Post.find({ userId: friendId });
//           })
//         );
//         returnPosts = posts.concat(friendPosts[0])
//         return res.status(200).json(returnPosts)
//       })
//     })
//   }
// ]

module.exports.timelinePosts = [
  (req,res) => {
    returnPosts = []
    User.findById(req.params.userId, async (err, user) => {
      if(err) { return res.status(500).json(err)}
      Post.find({userId: user._id }, async (err, posts) => {
        if(err) { return res.status(500).json(err) }
        const friendPosts = await Promise.all(
          user.following.map((friendId) => {
            return Post.find({ userId: friendId });
          })
        );
        returnPosts = posts.concat(...friendPosts)
        return res.status(200).json(returnPosts)
      })
    })
  }
]




module.exports.profilePosts = [
  (req,res) => {
    User.find({ username: req.params.username},(err, user)=>{
      if(err){ return res.status(500).json(err) }
      Post.find({userId: user[0]._id }, (err, posts)=>{
        if(err) { return res.status(500).json(err) }
        res.status(200).json(posts)
      })
    })
  }
]