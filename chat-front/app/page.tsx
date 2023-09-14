"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Home() {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<
    {
      username: string;
      content: string;
      timeSent: string;
    }[]
  >([]);

  const [username, setUsername] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("message", (data) => {
      console.log({ data });
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user-exist", (data) => {
      console.log("user exists ?", data);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("message", {
      username: "me",
      content,
      timeSent: new Date().toUTCString(),
    });

    setContent("");
  };

  const handleUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("user-take", username);
  };

  useEffect(() => {
    socket.emit("user-check", username);
  }, [username]);

  return (
    <main className="flex min-h-screen flex-col justify-center items-center">
      <form onSubmit={handleUsername}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
        <button type="submit" className="btn btn-primary">
          Join
        </button>
      </form>
      <div className="card w-96 h-96 shadow-xl">
        <div className="card-body w-full overflow-y-scroll">
          {messages.map((message) => (
            <div className="chat chat-start" key={message.timeSent}>
              <div className="chat-header">{message.username}</div>
              <div className="chat-bubble">{message.content}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="justify-self-end">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
