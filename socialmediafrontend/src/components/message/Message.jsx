import "./message.css";
import { format } from "timeago.js";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Message({ message, own }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [messageSender, setSender] = useState({})
  useEffect(() => {
    axios.get(`users?userId=${message.sender}`)
          .then(resData => setSender(resData.data))
          .catch(err => console.log(err))
  }, [message])
  console.log(message)
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