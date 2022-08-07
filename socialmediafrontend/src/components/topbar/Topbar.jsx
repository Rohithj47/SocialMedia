import React from 'react';
import "./topbar.css"
import { Search, Chat, Notifications, Person, CodeSharp} from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'
import { useRef } from 'react';

function Topbar(props) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const { user, dispatch } = useContext(AuthContext)
    const search = useRef()
    const handleEnter = (e) => {
        if (e.charCode == 13){
            console.log(search.current.value)
            window.location.href = `/profile/${search.current.value}`
        }
    }
    
    const handleSignOut = (e) => {
        localStorage.removeItem("user");
        dispatch({ type: "LOGIN_FAILURE"});
        window.location.href = '/'
    }
    return (
        <div className='topbarContainer'>
            <div className="topbarLeft">
                <Link to='/' style = {{textDecoration: "none"}} >
                    <span className="logo">Social Media</span>
                </Link>
            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                    <Search className="searchIcon"></Search>
                    <input
                      placeholder='Search for people, just hit enter :)'
                      className="searchInput"
                      ref={search}
                      onKeyPress = {handleEnter}  />
                </div>
            </div>
            <div className="topbarRight">
                <div className="topbarLinks">
                    <Link to='/' style = {{textDecoration: "none"}} >
                        <span className="topbarLink">Homepage</span>
                    </Link>
                    <Link to={`/profile/${user.username}`} style = {{textDecoration: "none"}} >
                        <span className="topbarLink">Timeline</span>
                    </Link>
                </div>
                <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <Chat />
                        <span className="topbarIconBadge">2</span>
                    </div>
                    <button id= "signOut" title="Sign Out" className='topbarSignOut' onClick={handleSignOut} >
                        <div className="topbarIconItem">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24"  viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="white"/></svg>
                        </div>

                    </button>
                </div>
                <Link to ={`/profile/${user.username}`} >
                    <img src={user.profilePicture? PF + user.profilePicture: PF +'person/noAvatar.png'} alt="" className="topbarImg" />
                </Link>
            </div>
            
            
        </div>
    );
}

export default Topbar;