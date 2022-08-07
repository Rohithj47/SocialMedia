import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext"
import { useEffect, useRef } from "react";
import axios from "axios";
import { Add, Remove } from "@material-ui/icons";
import {PermMedia, Label,Room, EmojiEmotions, Cancel} from "@material-ui/icons"
import { Link } from 'react-router-dom'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext)
  const [followed, setFollowed] = useState(
    currentUser.following.includes(user?._id)
    );
    const [open, setOpen] = useState(false);
    const desc  = useRef(null)
    const city  = useRef(null)
    const from  = useRef(null)
    const relationship  = useRef(null)
    const [profilePic, setProfilePic] = useState(null)
    const [coverPic, setCoverPic] = useState(null)
    
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateUser = async (e) => {
    var userUpdate = currentUser
    userUpdate = {
      userId : currentUser._id,
      desc : desc.current.value || currentUser.desc,
      city : city.current.value || currentUser.city,
      relationship: relationship.current.value || currentUser.relationship,
      from : from.current.value || currentUser.from
    }
    if(profilePic){
      const data = new FormData()
      const filename = Date.now() + profilePic.name
      data.append("name", filename)
      data.append("file", profilePic)
      userUpdate.profilePicture = filename
      await axios.post('/upload', data)
                .catch((err) => { console.log(err)}) 
    }
    if(coverPic){
      const data = new FormData()
      const filename = Date.now() + coverPic.name
      data.append("name", filename)
      data.append("file", coverPic)
      userUpdate.coverPicture = filename
      await axios.post('/upload', data)
                .catch((err) => { console.log(err)}) 
    }
    axios.put(`/users/${currentUser._id}`, userUpdate)
         .then(window.location.reload())
         .catch(err => console.log(err))
    setOpen(false);
  };
  
  useEffect(() => {
    if(user){
      setFollowed(currentUser.following.includes(user._id))
    }
  },[currentUser, user?._id])

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user._id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
      if(user){ getFriends(); }
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
      console.log(err)
    }
  };
  
  
  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={PF+"/gift.png"} alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = ({ user }) => {
    return (
      <>
      {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
      {user.username === currentUser.username && (
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          Update your Profile!
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Description</DialogTitle>
          <DialogContent>
          <label htmlFor="profilePic" className="shareOption">
              <PermMedia htmlColor="blue" className="shareIcon"/>
              <span className="shareOptionText">Upload Profile Picture</span>
              <input style={{display:"none"}} type="file" id="profilePic" accept=".png,.jpeg,.jpg" onChange={(e) => setProfilePic(e.target.files[0])} />
          </label >
          {profilePic && (
          <div className="shareImgContainer">
            <span>Profile pic selected </span>
          </div>
          )}
          <br />
          <label htmlFor="coverPic" className="shareOption">
              <PermMedia htmlColor="blue" className="shareIcon"/>
              <span className="shareOptionText">Upload Cover Picture</span>
              <input style={{display:"none"}} type="file" id="coverPic" accept=".png,.jpeg,.jpg" onChange={(e) => setCoverPic(e.target.files[0])} />
          </label >
          {coverPic && (
          <div className="shareImgContainer">
            <span>Cover pic selected </span>
          </div>
          )}
          <br />
          <hr />
            <TextField
              autoFocus
              margin="dense"
              id="desc"
              label="description"
              fullWidth
              variant="standard"
              inputRef={desc}
            />
          </DialogContent>
          <DialogTitle>City</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="city"
              label="city"
              fullWidth
              variant="standard"
              inputRef={city}
            />
          </DialogContent>
          <DialogTitle>Home City</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="from"
              label="from"
              fullWidth
              variant="standard"
              inputRef={from}
            />
          </DialogContent>
          <DialogTitle>relationship</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please Enter either 1,2 or 3. 1 is Single, 3 is Married, 2 is Dating 
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="relationship"
              label="relationship"
              fullWidth
              variant="standard"
              inputRef = {relationship}
            />
          <br />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={updateUser}>Update</Button>
          </DialogActions>
        </Dialog>
      </div>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
            {user.relationship === 1
                ? "Single"
                : user.relationship === 3
                ? "Married"
                : "Dating"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
        {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar user = {user} /> : <HomeRightbar />}
      </div>
    </div>
  );
}