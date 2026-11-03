import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const Notify = () => {
  
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: false,
    jobAlerts: true,
    messageAlerts: true,
    connectionAlerts: true,
    mentionAlerts: true,
    recommendationAlerts: false
  });

 
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'connection',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        user: {
          name: 'Sarah Johnson',
          title: 'Senior Product Designer at TechCorp',
          avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
        },
        message: 'sent you a connection request',
        action: {
          type: 'accept',
          label: 'Accept'
        }
      },
      {
        id: 2,
        type: 'job',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), 
        company: {
          name: 'Google',
          logo: 'https://logo.clearbit.com/google.com'
        },
        job: {
          title: 'Senior Frontend Developer',
          location: 'Remote'
        },
        message: 'posted a new job that matches your profile',
        action: {
          type: 'view',
          label: 'View Job'
        }
      },
      {
        id: 3,
        type: 'message',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), 
        user: {
          name: 'Michael Chen',
          title: 'Engineering Manager at StartupCo',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
        },
        message: 'sent you a message: "Hey, are you available for a quick chat?"',
        action: {
          type: 'reply',
          label: 'Reply'
        }
      },
      {
        id: 4,
        type: 'mention',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), 
        user: {
          name: 'Jennifer Lee',
          title: 'Content Creator at MediaHub',
          avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
        },
        post: {
          title: 'The Future of React in 2023'
        },
        message: 'mentioned you in a post',
        action: {
          type: 'view',
          label: 'View Post'
        }
      },
      {
        id: 5,
        type: 'reaction',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10), 
        user: {
          name: 'David Wilson',
          title: 'Software Engineer at BigTech',
          avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
        },
        post: {
          title: 'My thoughts on the new React features'
        },
        message: 'liked your post',
        action: {
          type: 'view',
          label: 'View Post'
        }
      },
      {
        id: 6,
        type: 'recommendation',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        user: {
          name: 'Amanda Rodriguez',
          title: 'Product Manager at InnovateCo',
          avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
        },
        message: 'wrote you a recommendation',
        action: {
          type: 'view',
          label: 'View Recommendation'
        }
      },
      {
        id: 7,
        type: 'company',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), 
        company: {
          name: 'Microsoft',
          logo: 'https://logo.clearbit.com/microsoft.com'
        },
        message: 'is looking for candidates with your skills',
        action: {
          type: 'view',
          label: 'View Company'
        }
      },
      {
        id: 8,
        type: 'event',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        event: {
          title: 'React Conference 2023',
          date: 'October 15-16, 2023',
          location: 'San Francisco, CA'
        },
        message: 'is coming up soon. Will you be attending?',
        action: {
          type: 'rsvp',
          label: 'RSVP Now'
        }
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
    setIsLoading(false);
  }, []);


  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const handleAction = (notification, e) => {
    e.stopPropagation();
    alert(`Handling action: ${notification.action.type} for notification ${notification.id}`);
    markAsRead(notification.id);
  };

 
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

 
  const handleSettingsChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  const renderNotificationIcon = (type) => {
    switch (type) {
      case 'connection':
        return <div className="flex  items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>;
      case 'job':
        return <div className="flex  items-center justify-center w-10 h-10 bg-green-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
        </div>;
      case 'message':
        return <div className="flex  items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>;
      case 'mention':
        return <div className="flex   items-center justify-center w-10 h-10 bg-pink-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        </div>;
      case 'reaction':
        return <div className="flex  items-center justify-center w-10 h-10 bg-red-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </div>;
      case 'recommendation':
        return <div className="flex  items-center justify-center w-10 h-10   bg-yellow-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>;
      case 'company':
        return <div className="flex  items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>;
      case 'event':
        return <div className="flex  items-center justify-center w-10 h-10 bg-teal-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>;
      default:
        return <div className="flex  items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
           
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>;
    }
  };


  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case 'connection':
        return (
            
          <div className="flex flex-col space-y-3 ">
             <Navbar className='mb-32'/>
            <div className="flex items-start space-x-3 mt-[100px] ">
              <img src={notification.user.avatar} alt={notification.user.name} className="w-12 h-12 rounded-full" />
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{notification.user.name}</span>
                <span className="text-sm text-gray-500">{notification.user.title}</span>
              </div>
            </div>
            <p className="text-gray-700">{notification.message}</p>
            <div className="flex space-x-2">
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={(e) => handleAction(notification, e)}
              >
                {notification.action.label}
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Ignore
              </button>
            </div>
          </div>
        );
      case 'job':
        return (
          <div className="flex flex-col space-y-3">
            <div className="flex items-start space-x-3">
              <img src={notification.company.logo} alt={notification.company.name} className="w-12 h-12 rounded-full" />
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{notification.company.name}</span>
                <span className="text-sm font-medium text-gray-900">{notification.job.title}</span>
                <span className="text-sm text-gray-500">{notification.job.location}</span>
              </div>
            </div>
            <p className="text-gray-700">{notification.message}</p>
            <div className="flex space-x-2">
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={(e) => handleAction(notification, e)}
              >
                {notification.action.label}
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col space-y-3">
            <div className="flex items-start space-x-3">
              {notification.user && (
                <>
                  <img src={notification.user.avatar} alt={notification.user.name} className="w-12 h-12 rounded-full" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{notification.user.name}</span>
                    <span className="text-sm text-gray-500">{notification.user.title}</span>
                  </div>
                </>
              )}
              {notification.company && (
                <>
                  <img src={notification.company.logo} alt={notification.company.name} className="w-12 h-12 rounded-full" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{notification.company.name}</span>
                  </div>
                </>
              )}
              {notification.event && (
                <>
                  <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{notification.event.title}</span>
                    <span className="text-sm text-gray-500">{notification.event.date} • {notification.event.location}</span>
                  </div>
                </>
              )}
            </div>
            <p className="text-gray-700">{notification.message}</p>
            <div className="flex space-x-2">
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={(e) => handleAction(notification, e)}
              >
                {notification.action.label}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        <div className="flex items-center space-x-4">
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {unreadCount} unread
          </span>
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
            onClick={markAllAsRead}
            title="Mark all as read"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
            onClick={toggleSettings}
            title="Notification settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center">
              <input 
                id="email-notifications" 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={notificationSettings.email} 
                onChange={() => handleSettingsChange('email')} 
              />
              <label htmlFor="email-notifications" className="block ml-3 text-sm font-medium text-gray-700">
                Email notifications
              </label>
            </div>
            <div className="flex items-center">
              <input 
                id="push-notifications" 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={notificationSettings.push} 
                onChange={() => handleSettingsChange('push')} 
              />
              <label htmlFor="push-notifications" className="block ml-3 text-sm font-medium text-gray-700">
                Push notifications
              </label>
            </div>
            <div className="flex items-center">
              <input 
                id="job-alerts" 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={notificationSettings.jobAlerts} 
                onChange={() => handleSettingsChange('jobAlerts')} 
              />
              <label htmlFor="job-alerts" className="block ml-3 text-sm font-medium text-gray-700">
                Job alerts
              </label>
            </div>
            <div className="flex items-center">
              <input 
                id="message-alerts" 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={notificationSettings.messageAlerts} 
                onChange={() => handleSettingsChange('messageAlerts')} 
              />
              <label htmlFor="message-alerts" className="block ml-3 text-sm font-medium text-gray-700">
                Message alerts
              </label>
            </div>
            <div className="flex items-center">
              <input 
                id="connection-alerts" 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={notificationSettings.connectionAlerts} 
                onChange={() => handleSettingsChange('connectionAlerts')} 
              />
              <label htmlFor="connection-alerts" className="block ml-3 text-sm font-medium text-gray-700">
                Connection alerts
              </label>
            </div>
            <div className="flex items-center">
              <input 
                id="mention-alerts" 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={notificationSettings.mentionAlerts} 
                onChange={() => handleSettingsChange('mentionAlerts')} 
              />
              <label htmlFor="mention-alerts" className="block ml-3 text-sm font-medium text-gray-700">
                Mention alerts
              </label>
            </div>
            <div className="flex items-center">
              <input 
                id="recommendation-alerts" 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={notificationSettings.recommendationAlerts} 
                onChange={() => handleSettingsChange('recommendationAlerts')} 
              />
              <label htmlFor="recommendation-alerts" className="block ml-3 text-sm font-medium text-gray-700">
                Recommendation alerts
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="flex p-2 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap space-x-2">
          <button
            className={`px-3 py-1 text-sm font-medium rounded-full ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 text-sm font-medium rounded-full ${filter === 'unread' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setFilter('unread')}
          >
            Unread
          </button>
          <button
            className={`px-3 py-1 text-sm font-medium rounded-full ${filter === 'connection' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setFilter('connection')}
          >
            Connections
          </button>
          <button
            className={`px-3 py-1 text-sm font-medium rounded-full ${filter === 'job' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setFilter('job')}
          >
            Jobs
          </button>
          <button
            className={`px-3 py-1 text-sm font-medium rounded-full ${filter === 'message' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setFilter('message')}
          >
            Messages
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex p-4 space-x-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-8 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`flex p-4 space-x-4 cursor-pointer hover:bg-gray-50 ${!notification.read ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              {renderNotificationIcon(notification.type)}
              <div className="flex-1">
                {renderNotificationContent(notification)}
                <p className="mt-2 text-xs text-gray-500">{formatTime(notification.timestamp)}</p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
            <p className="mt-2 text-sm text-gray-500">
              {filter === 'all' 
                ? "You're all caught up! Check back later for new notifications." 
                : `No ${filter} notifications at this time.`}
            </p>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default Notify;