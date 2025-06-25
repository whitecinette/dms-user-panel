
import { useState, useEffect } from 'react';
import { IoIosNotifications } from 'react-icons/io';
import { FaUserAlt } from 'react-icons/fa';
import Notification from '../../components/Notifications'
import ProfilePopup from '../ProfilePopup';
import './style.scss'
import axios from 'axios';
import config from '../../config';

const backend_url = config.backend_url;

function HeaderActions() {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsCounts, setNotificationsCounts] = useState(0);

  const getNotificationsCounts = async () => {
    try {
      const res = await axios.get(
        `${backend_url}/get/notification/count`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotificationsCounts(res.data.count);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getNotificationsCounts();
  },[showNotifications]);


  return (
    <>
      <div className="icons">
          <div className="notifications" onClick={()=> setShowNotifications(true)
          }>
            <IoIosNotifications size={24} />
            {notificationsCounts > 0 && (
              <span className="count">{notificationsCounts}</span>
            )}
            </div>
            {showNotifications && (
              <div className="notification-content">
              
                <Notification onClose={() => setShowNotifications(false)} count={notificationsCounts} />
                 
              </div>
            )}
          <div className="profile" onClick={() => setShowProfile(true)} >
            <FaUserAlt />
          </div>
        </div>
        {showProfile && (
        <>
          <div className="overlay" onClick={() => setShowProfile(false)} />
          <ProfilePopup onClose={() => setShowProfile(false)} />
        </>
      )}
    </>
  );
}
export default HeaderActions;