import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      // handle error
    }
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {loading ? <div>Loading...</div> : (
        <ul>
          {notifications.map(n => (
            <li key={n._id} className={n.isRead ? 'read' : 'unread'} onClick={() => markAsRead(n._id)}>
              {n.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications; 