import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaPaperPlane, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const INITIAL_MESSAGE = {
  sender: "bot",
  text: "Hi there! I'm SirajVerse AI, your personal AI assistant. How can I help you today?",
};

const getApiUrl = () => {
  const envUri = (import.meta.env.VITE_SERVER_URI || "").trim();

  if (envUri) {
    return envUri.replace(/\/+$/, "") + "/api/ai/chat";
  }

  if (import.meta.env.DEV) {
    return "http://localhost:5000/api/ai/chat";
  }

  return "/api/ai/chat";
};

const API_URL = getApiUrl();

export default function AIchat() {
  const [isOpen, setIsOpen] = useState(true);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("aiChatMessages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (err) {
      console.error("CHAT HISTORY ERROR:", err);
    }
    return [INITIAL_MESSAGE];
  });

  useEffect(() => {
    try {
      localStorage.setItem("aiChatMessages", JSON.stringify(messages));
    } catch (err) {
      console.error("SAVE CHAT HISTORY ERROR:", err);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const userText = text.trim();
    if (!userText) {
      toast.warning("Please enter a message.");
      return;
    }
    if (loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setText("");
    setLoading(true);

    try {
      console.log(" AI REQUEST →", API_URL, userText);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: userText }),
      });

      console.log(" Response status:", response.status);

      const rawText = await response.text();
      console.log(" Raw response:", rawText);

      let data = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (parseErr) {
        console.error("JSON parse failed:", parseErr);
        data = {
          success: false,
          message: `Server returned non-JSON: ${rawText.slice(0, 200)}`,
        };
      }

      console.log(" Parsed data:", data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Backend error ${response.status}. Check backend terminal.`
        );
      }

      if (!data?.success || !data?.reply) {
        throw new Error(
          data?.message || "AI returned empty response. Check backend terminal."
        );
      }

      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error(" AI CHAT ERROR:", error);

      let errorMessage = error.message || "Unknown error";

      if (error instanceof TypeError) {
        errorMessage = `Cannot reach backend at ${API_URL}. Check server is running.`;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `###  Error\n\n${errorMessage}` },
      ]);

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearMessages = () => {
    setMessages([INITIAL_MESSAGE]);
    try {
      localStorage.removeItem("aiChatMessages");
    } catch (err) {
      console.error("CLEAR CHAT ERROR:", err);
    }
    toast.success("All messages cleared!");
  };

  const handleClearConfirmation = () => {
    toast.info(
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">
          Are you sure you want to clear all messages?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss();
              handleClearMessages();
            }}
            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Yes, Clear All
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeButton: false,
        draggable: false,
        closeOnClick: false,
      }
    );
  };

  const markdownComponents = {
    h1: (props) => (
      <h1 className="text-lg font-bold mt-3 mb-2 text-white" {...props} />
    ),
    h2: (props) => (
      <h2 className="text-base font-bold mt-3 mb-2 text-white" {...props} />
    ),
    h3: (props) => (
      <h3 className="text-sm font-bold mt-2 mb-1 text-white" {...props} />
    ),
    h4: (props) => (
      <h4 className="text-sm font-semibold mt-2 mb-1 text-gray-100" {...props} />
    ),
    p: (props) => (
      <p className="mb-2 leading-relaxed text-sm text-gray-100" {...props} />
    ),
    ul: (props) => (
      <ul
        className="list-disc ml-5 mb-2 space-y-1 text-sm text-gray-100"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="list-decimal ml-5 mb-2 space-y-1 text-sm text-gray-100"
        {...props}
      />
    ),
    li: (props) => <li className="text-sm leading-relaxed" {...props} />,
    strong: (props) => (
      <strong className="font-semibold text-white" {...props} />
    ),
    em: (props) => <em className="italic text-gray-100" {...props} />,
    code: ({ className, children, ...props }) => (
      <code
        className={`bg-gray-700 text-yellow-200 px-1 py-0.5 rounded text-xs font-mono ${
          className || ""
        }`}
        {...props}
      >
        {children}
      </code>
    ),
    pre: (props) => (
      <pre
        className="bg-gray-950 border border-gray-700 p-3 rounded-lg overflow-x-auto my-2 text-xs text-gray-100"
        {...props}
      />
    ),
    a: (props) => (
      <a
        className="text-blue-400 underline hover:text-blue-300 break-all"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    hr: (props) => <hr className="border-gray-600 my-3" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="border-l-2 border-blue-500 pl-3 italic my-2 text-gray-300"
        {...props}
      />
    ),
    table: (props) => (
      <div className="overflow-x-auto my-2">
        <table className="min-w-full text-xs border border-gray-700" {...props} />
      </div>
    ),
    thead: (props) => <thead className="bg-gray-700 text-white" {...props} />,
    th: (props) => (
      <th
        className="px-2 py-1 border border-gray-600 text-left font-semibold"
        {...props}
      />
    ),
    td: (props) => (
      <td className="px-2 py-1 border border-gray-600" {...props} />
    ),
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div
        className="fixed top-[18%] bottom-4 right-4 sm:top-[13%] sm:bottom-auto
        h-[77vh] max-h-[670px] w-[90vw] max-w-[350px]
        bg-black border border-black rounded-lg shadow-xl
        flex flex-col z-50"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900 text-white rounded-t-lg">
          <h3 className="font-semibold text-lg">SirajVerse AI Assistant</h3>
          <div className="flex items-center gap-3">
            {messages.length > 1 && (
              <button
                onClick={handleClearConfirmation}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors"
                title="Clear all messages"
              >
                <FaTrash className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => {
                setIsOpen(false);
                toast.info("Chat window closed");
              }}
              className="text-white hover:text-gray-300"
              title="Close chat"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-900 custom-scrollbar">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg break-words ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                {message.sender === "bot" ? (
                  <div className="markdown-body">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-400">
                  SirajVerse AI is thinking...
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-gray-700 bg-gray-900 flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !text.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </>
  );
}