import React, { useEffect } from "react";

interface MessageProps {
  sender: string;
  content: string;
  isOwnMessage: boolean;
}

const MessageComponent = (props: MessageProps) => {
  const { content, isOwnMessage, sender } = props;

  useEffect(() => {
    console.log(content);
  }, []);

  return (
    <div
      className={`d-flex m-1`}
      style={{
        justifyContent: isOwnMessage? 'end' : 'start'
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          width: "max-content",

          wordBreak: "break-word", // Cho phép từ dài rớt dòng
          whiteSpace: "pre-wrap", // Bảo toàn khoảng trắng và xuống dòng
        }}
      >
        {
          !isOwnMessage &&
          <span>{sender}</span>
        }
        <p
          style={{
            color: isOwnMessage ? "white" : "black",
            backgroundColor: isOwnMessage ? "#4D76A5" : "#e0e0e0",
            borderRadius: "6px",
            padding: "5px 10px",
          }}
        >
          {content}
        </p>
      </div>
    </div>
  );
};

export default MessageComponent;
