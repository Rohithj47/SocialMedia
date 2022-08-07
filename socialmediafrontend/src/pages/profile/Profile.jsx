import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState, useRef } from "react";
import axios from "axios"
import { Link, useParams } from "react-router-dom";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [user, setUser] = useState({})
  let { username } = useParams()
  useEffect(() => {
      const fetchUser = async () => {
        try{
          const res = await axios.get(`/users?username=${username}`)
          setUser(res.data)
        }catch(err){
          console.log(err)
        }
      }
      fetchUser()
  }, [])

  
  const PageNotFound = () => {
    return (
      <div>
            <h3>404 page not found</h3>
            <p>We are sorry but the page you are looking for does not exist.</p>
            <Link to="/" >Let's go Home</Link>
        </div>
    )
  }

  const ProfilePage = () => {
    return (
      <>
        <Topbar />
        <div className="profile">
          <Sidebar />
          <div className="profileRight">
            <div className="profileRightTop">
              <div className="profileCover">
                <img
                  className="profileCoverImg"
                  src= {user.coverPicture? PF + user.coverPicture : PF+ "/person/noCover.png"}
                  alt=""
                />
                <img
                  className="profileUserImg"
                  src= {user.profilePicture? PF + user.profilePicture : PF+ "/person/noAvatar.png"}
                  alt=""
                />
              </div>
              <div className="profileInfo">
                  <h4 className="profileInfoName">{user.username}</h4>
                  <span className="profileInfoDesc">{user.desc}</span>
              </div>
            </div>
            <br></br>
            <div className="profileRightBottom">
              <Feed username={user.username} />
              <Rightbar user={user}/>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <div>
      {(user.username != null) ? <ProfilePage /> : <PageNotFound />}
    </div>
  );
}