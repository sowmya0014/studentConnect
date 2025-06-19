import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from '../api/axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const socket = io('http://localhost:5000');

const ChatGroups = () => {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newGroup, setNewGroup] = useState('');
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const fetchGroups = async () => {
    try {
      const res = await axios.get('/api/groups');
      setGroups(res.data);
    } catch (err) {}
  };

  const fetchMessages = async (groupId) => {
    try {
      const res = await axios.get(`/api/groups/${groupId}/messages`);
      setMessages(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchGroups();
    socket.on('groupMessage', (msg) => {
      if (msg.group === selectedGroup?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => {
      socket.off('groupMessage');
    };
    // eslint-disable-next-line
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroup) fetchMessages(selectedGroup._id);
    // eslint-disable-next-line
  }, [selectedGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroup) return;
    try {
      await axios.post('/api/groups', { name: newGroup });
      setNewGroup('');
      fetchGroups();
    } catch (err) {}
  };

  const handleJoinGroup = async (id) => {
    try {
      await axios.post(`/api/groups/${id}/join`);
      fetchGroups();
    } catch (err) {}
  };

  const handleRemoveGroup = async (id) => {
    try {
      await axios.delete(`/api/groups/${id}`);
      if (selectedGroup && selectedGroup._id === id) setSelectedGroup(null);
      fetchGroups();
    } catch (err) {}
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message || !selectedGroup) return;
    try {
      const res = await axios.post(`/api/groups/${selectedGroup._id}/messages`, { text: message });
      socket.emit('groupMessage', res.data);
      setMessage('');
    } catch (err) {}
  };

  return (
    <div className="chatgroups-container">
      <div className="groups-list">
        <h3>Groups</h3>
        <form onSubmit={handleCreateGroup}>
          <input value={newGroup} onChange={e => setNewGroup(e.target.value)} placeholder="New group name" />
          <button type="submit">Create</button>
        </form>
        <ul>
          {groups.map(g => (
            <li key={g._id} onClick={() => setSelectedGroup(g)} className={selectedGroup?._id === g._id ? 'active' : ''}>
              {g.name}
              <span>
                <button onClick={e => { e.stopPropagation(); handleJoinGroup(g._id); }}>Join</button>
                {g.members.some(m => m._id === user.id) && (
                  <button style={{ marginLeft: 6, background: '#e74c3c' }} onClick={e => { e.stopPropagation(); handleRemoveGroup(g._id); }}>Remove</button>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-area">
        {selectedGroup ? (
          <>
            <h3>{selectedGroup.name}</h3>
            <div className="messages">
              {messages.map(m => (
                <div key={m._id} className="message">
                  <b>{m.sender?.name}:</b> {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="message-form">
              <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." />
              <button type="submit">Send</button>
            </form>
          </>
        ) : <div>Select a group to chat</div>}
      </div>
    </div>
  );
};

export default ChatGroups; 