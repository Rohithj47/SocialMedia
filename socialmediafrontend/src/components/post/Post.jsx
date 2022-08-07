import React, { useEffect } from 'react';
import './post.css'
import { MoreVert, Delete} from "@material-ui/icons";
import { useState } from 'react';
import axios from 'axios';
import { format, render, cancel, register } from 'timeago.js';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function Post({post}) {
    const [like, setLike] = useState(post.likes.length)
    const [user, setUser] = useState({})
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const { user: currentUser } = useContext(AuthContext)
    const [isLiked, setIsLiked] = useState()

    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser._id))
    },[currentUser._id, post.likes])

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?userId=${post.userId}`)
            setUser(res.data)
        }
        fetchUser()
    }, [post.userId])

    const likeHandler = () => {
        try {
          axios.put("/post/" + post._id + "/like", { userId: currentUser._id });
        } catch (err) {}
        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
    };

    const deletePost = () => {
        axios.delete(`/post/${post._id}`, { data: { userId: currentUser._id } }).then(() => window.location.reload())
          .catch((err) => console.log(err))
    }

    return (
        <div className='post'>
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${user.username}`}>
                            <img 
                                src={
                                    user.profilePicture
                                      ? PF + user.profilePicture
                                      : PF + "person/noAvatar.png"
                                  } 
                                className="postProfileImg" 
                            />
                        </Link>
                        <span className="postUsername">{user.username}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        {post.userId === currentUser._id && <Delete className='deleteButton' onClick = {deletePost} />} 

                    </div>

                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    <img src={PF + post.img} alt="" className="postImg" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img className="likeIcon" src={PF + "/like.png"} onClick={likeHandler} alt="" />
                        <img className="likeIcon" src={PF + "/heart.png"} alt="" />
                        <span className="postLikeCounter">{like} likes</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">{post.comment} comments</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;