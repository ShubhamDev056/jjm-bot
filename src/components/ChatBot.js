import React, { useState, useEffect, useRef } from "react";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL; // get base url
const uuidNum = process.env.REACT_APP_UUID_NUMBER; // get unique identifier
const errorMessage =
  "My apologies, I'm not available at the moment, however, feel free to contact our support team.";
const loader = (
  <span className="loader">
    <span className="loader__dot" />
    <span className="loader__dot" />
    <span className="loader__dot" />
  </span>
);

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      content:
        "Hi there 🖐. I’m JJM bot, your virtual assistant. I'm here to help with your general enquiries.",
    },
  ]);
  const chatbotMessageWindowRef = useRef(null);
  const [isLoading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  //toggle chatbot window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // 'messages' is a dependency that triggers

  const scrollToBottom = () => {
    if (chatbotMessageWindowRef.current) {
      console.log("ref");
      chatbotMessageWindowRef.current.scrollTop =
        chatbotMessageWindowRef.current.scrollHeight;
    }
  };

  //remove typing messages from list
  const removeLoader = () => {
    setMessages(messages.filter((message) => message.loading !== true));
  };

  useEffect(() => {
    if (isLoading) {
      aiMessage(loader, isLoading);
    }
    if (isLoading === false) {
      removeLoader();
    }
  }, [isLoading]);

  const userMessage = (content) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "user",
        content,
      },
    ]);
  };

  const send = (inputValue) => {
    setLoading(true);
    console.log(
      "url",
      `${apiBaseUrl}?query_string=${inputValue}&uuid_number=${uuidNum}`
    );
    //call API here
    fetch(`${apiBaseUrl}?query_string=${inputValue}&uuid_number=${uuidNum}`)
      .then((response) => response.json())
      .then((response) => {
        // console.log("res", response);
        aiMessage(response?.answer, isLoading);
      })
      .catch((e) => {
        aiMessage(errorMessage, isLoading);
        //console.log(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //AI message function
  const aiMessage = (content, loading) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "ai",
        content,
        loading,
      },
    ]);
  };

  //send a message
  const sendMessage = () => {
    if (inputValue.trim() !== "") {
      userMessage(inputValue);
      send(inputValue);
      setInputValue("");
    }
  };

  return (
    <>
      <div className={`chatbot ${!isOpen ? "chatbot--closed" : ""}`}>
        <div className="chatbot__header_Icon">
          <img
            id="chatboticon"
            src="./chatbotIcon.png"
            alt="assistant-avatar"
            style={{ width: 140 }}
            onClick={toggleChat}
          />
        </div>
        {/* Your chatbot JSX structure here */}
        <div className={`chatbot ${!isOpen ? "chatbot--closed" : ""}`}>
          <div className="chatbot__message-window">
            <div className="chatbot__header">
              <div className="assistTxt">
                How can i assist you?{" "}
                <span className="askQue">Ask Questions</span>
              </div>
              <span className="closeChatbot" onClick={toggleChat}>
                <i className="fa fa-times" aria-hidden="true"></i>
              </span>
            </div>
            <div
              className="chatbot__message-window"
              ref={chatbotMessageWindowRef}
            >
              <ul className="chatbot__messages">
                {messages.map((message, index) => (
                  <li
                    key={index}
                    className={`is-${message.type} animation ${
                      message.loading ? "is-loading" : ""
                    }`}
                  >
                    {message.type === "ai" && (
                      <div className="is-ai__profile-picture">
                        <img
                          src="./jjm_new_logo.png"
                          alt="assistant-avatar"
                          style={{ width: 30 }}
                        />
                      </div>
                    )}
                    <p className="chatbot__message">{message.content}</p>

                    <span
                      className={`chatbot__arrow chatbot__arrow--${
                        message.type === "ai" ? "left" : "right"
                      }`}
                    ></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="chatbot__entry chatbot--closed">
            <input
              type="text"
              className="chatbot__input"
              placeholder="Write a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
            />
            <i className="fa fa-paper-plane" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
