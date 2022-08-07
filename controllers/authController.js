const bcrypt = require('bcrypt')
const User = require('../models/User')
const { body, validationResult } = require('express-validator')


module.exports.register = [
    body(["username, password, email", "Username/Password/Email cannot be empty"])
        .trim()
        .isLength({min:3})
        .escape(),

    (req, res) => {
        const errors = validationResult(req.body)

        if (!errors.isEmpty()) { res.status(401).json({ error: errors.array()})}
        // Lets create the User 

        bcrypt.hash(req.body.password, 10, (err, hash)=>{
            if(!hash){
                return res.status(401).json({ error: err})
            }
            req.body.password = hash
            User.create(req.body ,(err, user) =>{
                if (!user) { return res.status(500).json(err) }
                return res.status(201).json(user)
                
            }
            )
        }) 
    }
]

module.exports.login = [
    body("email", "Pls enter valid email & password")
        .trim()
        .isLength({min:3})
        .escape(),
    body("password", "Pls enter valid email & password")
        .trim()
        .isLength({min:3})
        .escape(),
    (req, res) => {
        const err = validationResult(req.body)
        if(!err.isEmpty()) { return res.status(401).json( {errors : err.array()})}

        User.findOne({ email: req.body.email}, (err, user) =>{
            if (err || !user) { return res.status(400).json(err)}

            bcrypt.compare(req.body.password, user.password, (err, same) =>{
                if(!same) { return res.status(400).json({ error: "Incorrect Password"})}

                return res.status(200).json(user)
            })
        })

    }
]