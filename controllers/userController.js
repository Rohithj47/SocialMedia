const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports.updateUser = [
    (req, res) => {
        // check if user can update or nor 
        if( req.params.id === req.body.userId || req.body.isAdmin){
            if(req.body.password){
                try
                {
                const salt = bcrypt.genSalt(10)
                req.body.password = bcrypt.hash(req.body.password, salt)
                }
                catch(err){ res.status(500).json(err) }
            }
            User.findByIdAndUpdate( req.params.id, { $set: req.body }, (err, user) => {
                if(err || !user) { res.status(500).json({ error: "User not Updated" }) }
                res.status(200).json(user)
            })
        }
        else {
            res.status(500).json({ error: "no auth to edit user" })
        }
    }

]

module.exports.deleteUser = [
    (req, res) => {
        if( req.params.id === req.body.userId || req.body.isAdmin){
            User.findByIdAndDelete( req.params.id, (err, user) => {
                if(err) { return res.status(500).json({ error : "Not Deleted"})}
                res.status(201).json("Deleted succesfuly")
            })
        }
        else{
            res.status(500).json({ error : "no auth to delete user"})
        }
    }
]

module.exports.followUser = [
    (req,res) => {
        if(req.body.userId === req.params.id){
            return res.status(500).json("You cannot Follow yourself")
        }
        User.findById(req.params.id, (err, user)=> {
            if (!user) { return res.status(500).json("User not found")}
            User.findById(req.body.userId, (err, currentUser)=> {
                if(!currentUser) {return res.status(500).json("Who are you?")}
                if(!user.followers.includes(req.body.userId))
                {
                    user.updateOne({ $push: { followers: req.body.userId } }, (err, user) =>{
                        if (err || !user ){ return res.status(500).json("Error")  }
                    });
                    currentUser.updateOne({ $push: { following: req.params.id } }, (err, user)=>{
                        if (err || !user ){ return res.status(500).json("Error")  }
                    });
                    res.status(200).json("User Followed")

                }
                else
                {
                    return res.status(500).json("You already follow User!") 
                }

            })

        })
    }
]

module.exports.unfollowUser = [
    (req,res) => {
        if(req.body.userId === req.params.id){
            return res.status(500).json("You cannot unfollow yourself")
        }
        User.findById(req.params.id, (err, user)=> {
            if (!user) { return res.status(500).json("User not found")}
            User.findById(req.body.userId, (err, currentUser)=> {
                if(!currentUser) {return res.status(500).json("Who are you?")}
                if(user.followers.includes(req.body.userId))
                {
                    user.updateOne({ $pull: { followers: req.body.userId } }, (err, user) =>{
                        if (err || !user ){ return res.status(500).json("Error")  }
                    });
                    currentUser.updateOne({ $pull: { following: req.params.id } }, (err, user)=>{
                        if (err || !user ){ return res.status(500).json("Error")  }
                    });
                    res.status(200).json("User Unfollowed")

                }
                else
                {
                    return res.status(500).json("You do not follow User!") 
                }

            })

        })
    }
]


//get a user
 module.exports.getUser = async (req, res) => {
    console.log(req.query.userId)
    const userId = req.query.userId;
    const username = req.query.username;
    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  };