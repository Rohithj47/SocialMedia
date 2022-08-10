import "./closeFriend.css";
import { config } from "../../urlConfig"

export default function CloseFriend({user}) {
  const PF = config.IMG_URI
  return (
    <li className="sidebarFriend">
      <img className="sidebarFriendImg" src={PF + user.profilePicture} alt="" />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
}