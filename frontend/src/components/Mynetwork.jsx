import React, { useState, useContext, useEffect } from 'react';
import { AuthUserContext } from '../Context/Authcontext';
import { Userdatacontext } from '../Context/UserContext';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Mynetwork() {
  const { serveruri } = useContext(AuthUserContext);
  const { userdata, setuserdata } = useContext(Userdatacontext);
  const [users, setUsers] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activeTab, setActiveTab] = useState('suggestions');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serveruri}/api/users`, {
        withCredentials: true,
      });

      const filteredUsers = response.data.filter(
        (user) =>
          user._id !== userdata.user._id &&
          !userdata.user.connection.includes(user._id)
      );

      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectionRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serveruri}/api/connections/requests`, {
        withCredentials: true,
      });
      setConnectionRequests(response.data);
    } catch (error) {
      console.error('Error fetching connection requests:', error);
      if (error.response?.status === 404) {
        setMessage(
          'Connection requests endpoint not found. Please check server configuration.'
        );
      } else {
        setMessage('Failed to load connection requests');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async () => {
    try {
      setLoading(true);

      if (userdata.user.connection && userdata.user.connection.length > 0) {
        const connectionDetails = await Promise.all(
          userdata.user.connection.map(async (connId) => {
            try {
              const response = await axios.get(
                `${serveruri}/api/user/${connId}`,
                {
                  withCredentials: true,
                }
              );
              return response.data;
            } catch (error) {
              console.error(
                `Error fetching connection details for ${connId}:`,
                error
              );
              return null;
            }
          })
        );

        setConnections(connectionDetails.filter((conn) => conn !== null));
      } else {
        setConnections([]);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
      setMessage('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (receiverId) => {
    try {
      const response = await axios.get(
        `${serveruri}/api/connections/send/${receiverId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage('Connection request sent successfully');

        setUsers(users.filter((user) => user._id !== receiverId));

        const userResponse = await axios.get(`${serveruri}/api/currentuser`, {
          withCredentials: true,
        });
        setuserdata(userResponse.data);
      }
    } catch (error) {
      console.error('Error sending connection request:', error);

      if (error.response?.status === 404) {
        setMessage(
          'Send connection endpoint not found. Please check server configuration.'
        );
      } else {
        setMessage(
          error.response?.data?.message || 'Failed to send connection request'
        );
      }
    }
  };

  const acceptConnection = async (requestId) => {
    try {
      const response = await axios.get(
        `${serveruri}/api/connections/accept/${requestId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage('Connection accepted successfully');

        setConnectionRequests(
          connectionRequests.filter((req) => req._id !== requestId)
        );

        fetchConnections();

        const userResponse = await axios.get(`${serveruri}/api/currentuser`, {
          withCredentials: true,
        });
        setuserdata(userResponse.data);
      }
    } catch (error) {
      console.error('Error accepting connection:', error);
      setMessage(
        error.response?.data?.message || 'Failed to accept connection'
      );
    }
  };

  const rejectConnection = async (requestId) => {
    try {
      const response = await axios.get(
        `${serveruri}/api/connections/reject/${requestId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage('Connection rejected');

        setConnectionRequests(
          connectionRequests.filter((req) => req._id !== requestId)
        );
      }
    } catch (error) {
      console.error('Error rejecting connection:', error);
      setMessage(
        error.response?.data?.message || 'Failed to reject connection'
      );
    }
  };

  useEffect(() => {
    if (activeTab === 'suggestions') {
      fetchUsers();
    } else if (activeTab === 'requests') {
      fetchConnectionRequests();
    } else if (activeTab === 'connections') {
      fetchConnections();
    }
  }, [activeTab]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      
      <div className="pt-28 sm:pt-20 container mx-auto px-4 py-2">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-2 sm:mt-0">
          My Network
        </h1>

        
        <div className="flex flex-wrap border-b border-gray-200 mb-6 mt-2 sm:-mt-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'suggestions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('suggestions')}
          >
            Suggestions
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'requests'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('requests')}
          >
            Connection Requests
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'connections'
                ? 'text-black border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('connections')}
          >
            My Connections
          </button>
        </div>

        {message && (
          <div
            className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4"
            role="alert"
          >
            <p className="line-clamp-1">{message}</p>
            <button
              className="mt-2 text-blue-600 font-medium"
              onClick={() => setMessage('')}
            >
              Dismiss
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {activeTab === 'suggestions' && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-lg border hover:border hover:border-gray-400 p-4 md:p-6 flex flex-col items-center"
                >
                  <img
                    src={user.profileimg || '/default-avatar.png'}
                    alt={user.firstname}
                    className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover mb-3 md:mb-4"
                  />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 line-clamp-1">
                    {user.firstname} {user.lastname}
                  </h3>
                  <p className="text-gray-600 mb-2 text-sm md:text-base line-clamp-1">
                    {user.headline || 'No headline'}
                  </p>
                  <p className="text-gray-500 text-xs md:text-sm mb-3 md:mb-4 line-clamp-1">
                    {user.location || 'No location specified'}
                  </p>
                  <button
                    onClick={() => sendConnectionRequest(user._id)}
                    className="bg-white text-black border border-black font-medium py-1 px-3 rounded-full text-sm md:text-sm hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
                  >
                    Connect
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600 col-span-full text-center py-8">
                No suggestions available at the moment.
              </p>
            )}
          </div>
        )}

        {activeTab === 'requests' && !loading && (
          <div className="space-y-3 md:space-y-4">
            {connectionRequests.length > 0 ? (
              connectionRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-xl border hover:border-gray-500 p-3 md:p-4 flex flex-col md:flex-row items-center justify-between transition-all duration-300"
                >
                  <div className="flex items-center w-full md:w-auto mb-3 md:mb-0">
                    <img
                      src={request.sender?.profileimg || '/default-avatar.png'}
                      alt={request.sender?.firstname}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-semibold text-gray-800 truncate">
                        {request.sender?.firstname} {request.sender?.lastname}
                      </h3>
                      <p className="text-gray-600 text-xs md:text-sm truncate">
                        {request.sender?.headline || 'No headline'}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {request.sender?.location || 'No location specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2 w-full md:w-auto justify-end">
                    <button
                      onClick={() => acceptConnection(request._id)}
                      className="px-3 py-1 text-xs md:text-sm rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => rejectConnection(request._id)}
                      className="px-3 py-1 text-xs md:text-sm rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-6 text-sm">
                No pending connection requests.
              </p>
            )}
          </div>
        )}

        {activeTab === 'connections' && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {connections.length > 0 ? (
              connections.map((connection) => (
                <div
                  key={connection._id}
                  className="bg-white rounded-lg border hover:border-gray-500 p-4 md:p-6 flex flex-col items-center"
                >
                  <img
                    src={connection.profileimg || '/default-avatar.png'}
                    alt={connection.firstname}
                    className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover mb-3 md:mb-4"
                  />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 line-clamp-1">
                    {connection.firstname} {connection.lastname}
                  </h3>
                  <p className="text-gray-600 mb-2 text-sm md:text-base line-clamp-1">
                    {connection.headline || 'No headline'}
                  </p>
                  <p className="text-gray-500 text-xs md:text-sm mb-3 md:mb-4 line-clamp-1">
                    {connection.location || 'No location specified'}
                  </p>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 md:py-2 px-3 md:px-4 rounded-full transition-colors text-sm md:text-base">
                    Connected
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600 col-span-full text-center py-8">
                You haven't connected with anyone yet.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
}