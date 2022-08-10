import "./message.css";
import { format } from "timeago.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../urlConfig";

export default function Message({ message, own }) {
  const PF = config.IMG_URI
  const [messageSender, setSender] = useState({})
  
  
  useEffect(() => {
    axios.get(`${config.SERVER_URI}/users?userId=${message.sender}`)
          .then(resData => setSender(resData.data))
          .catch(err => console.log(err))
  }, [message])

  
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src= { messageSender? PF + messageSender.profilePicture :  PF +'person/noAvatar.png' }
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}