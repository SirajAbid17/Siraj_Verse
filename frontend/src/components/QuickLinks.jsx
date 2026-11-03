import React from "react";
import { FiExternalLink, FiHome } from "react-icons/fi";
import { 
  FaBuilding, 
  FaWheelchair, 
  FaLock, 
  FaFileAlt, 
  FaCookieBite,
  FaCopyright 
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function QuickLinks() {
  const items = [
    {
      title: "About SirajVerse",
      description: "Discover our mission to democratize AI education and our vision for an open knowledge ecosystem.",
      icon: <FaBuilding className="text-2xl text-white" />
    },
    {
      title: "Accessibility Commitment",
      description: "Detailed standards for inclusive design ensuring our platform is usable by people of all abilities.",
      icon: <FaWheelchair className="text-2xl text-white" />
    },
    {
      title: "Privacy Policy",
      description: "Comprehensive overview of data collection practices, user rights, and protection measures under GDPR.",
      icon: <FaLock className="text-2xl text-white" />
    },
    {
      title: "User Agreement",
      description: "Complete terms of service including community guidelines, account policies, and content standards.",
      icon: <FaFileAlt className="text-2xl text-white" />
    },
    {
      title: "Cookie Policy",
      description: "Detailed explanation of cookie usage with options to manage preferences and tracking settings.",
      icon: <FaCookieBite className="text-2xl text-white" />
    },
    {
      title: "Copyright Policy",
      description: "DMCA procedures, content licensing information, and intellectual property guidelines.",
      icon: <FaCopyright className="text-2xl text-white" />
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Essential Resources
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, index) => (
          <a 
            href={item.link}
            key={index} 
            className="group border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start">
              <span className="mr-3" aria-hidden="true">{item.icon}</span>
              <div>
                <h4 className="font-semibold text-lg mb-1.5 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                  <FiExternalLink className="inline ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" size={14} />
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
<div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
  <p>Need additional help? Contact <a 
     href="https://wa.me/923287303593" 
     target="_blank"
     rel="noopener noreferrer"
     className="text-blue-600 dark:text-blue-400 hover:underline"
    >Me</a>...</p>
</div>
      <div className="mt-10 flex justify-center">
        <Link 
          to="/"
          className="inline-flex items-center px-5 py-2.5 border text-sm font-medium rounded-md shadow-sm text-black border-black bg-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 hover:text-[white] transition-colors"
        >
          <FiHome className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}