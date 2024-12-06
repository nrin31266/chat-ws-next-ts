import { APP } from "../config/config";
import { Button, Card, TextField } from "@mui/material";
import { Stomp } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import MessageComponent from "./MessageComponent";

interface ChatProps {
  username: string;
  logout: () => void;
}

const Chat = (props: ChatProps) => {
  const { username, logout } = props;
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [stompClient, setStompClient] = useState<any>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    var socket = new SockJS(APP.BASE_URL);
    var client = Stomp.over(socket);

    client.connect({}, () => {
      console.log("Connecting");
      client.send("/app/join", {}, JSON.stringify(username));

      client.subscribe("/topic/messages", (msg) => {
        const parsedMsg = JSON.parse(msg.body);
        console.log("Received event:", parsedMsg);
        setMessages((pre) => [...pre, parsedMsg]);
      });
      setStompClient(client);
    });

    return () => {
      if (client) client.disconnect();
    };
  }, [username]);

  useEffect(() => {
    if (messageEndRef.current){
        messageEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (message && setStompClient !== null) {
      const chatMessage = {
        sender: username,
        content: message,
        type: "CHAT",
      };
      stompClient.send("/app/sendMessage", {}, JSON.stringify(chatMessage));
      setMessage("");
      messageInputRef.current?.focus();
    }
  };

  const handleLogout = async () => {
    if (setStompClient !== null) {
      stompClient.send("/app/leave", {}, JSON.stringify(username));
      setStompClient(null);
    }
  };

  return (
    <Card>
      <div className="">
        <div className="">header</div>
        <div
        className="custom-scrollbar"
          style={{
            flex: "1",
            overflowY: "auto",
            height: "60vh",
            width: "30rem",
            overflowX: 'hidden',
          }}
        >
          {messages.map((item, index) => (
            <div key={index}>
              {item.type === "JOIN" ? (
                <div className="text-center text-success">{item.content}</div>
              ) : item.type === "LEAVE" ? (
                <div className="text-center text-danger">{item.content}</div>
              ) : (
                <>
                  <MessageComponent
                    content={item.content}
                    sender={item.sender}
                    isOwnMessage={item.sender === username}
                  />
                </>
              )}
            </div>
          ))}
          {/* Auto scroll bottom */}
          <div ref={messageEndRef}></div>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <div
              className="d-flex"
              style={{
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <input
                ref={messageInputRef}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                type="text"
                className=""
                style={{
                  flex: "1",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                placeholder="Type your message"
              ></input>
              <Button
                style={{ minWidth: "60px" }}
                variant="contained"
                type="submit"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Button
        onClick={() => {
          handleLogout();
          logout();
        }}
      >
        Logout
      </Button>
    </Card>
  );
};

export default Chat;
