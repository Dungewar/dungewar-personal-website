import { FormEvent, useEffect, useRef, useState } from "react";
import { websocketUrl } from "../api";
import { Layout } from "../components/Layout";

type ChatMessage = { author: string; text: string; created_at: number };
type ServerMessage = {
  type: "error" | "init" | "messages";
  content?: string;
  username?: string;
  messages?: ChatMessage[];
};

function timestamp(unixSeconds: number): string {
  const date = new Date(unixSeconds * 1000);
  const today = new Date();
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return date.toDateString() === today.toDateString() ? time : `${date.toLocaleDateString()} at ${time}`;
}

export function ChatPage() {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState("");
  const [draft, setDraft] = useState("");
  const [connection, setConnection] = useState<"connecting" | "open" | "closed">("connecting");
  const [error, setError] = useState("");

  useEffect(() => {
    let disposed = false;
    let reconnectTimer: number | undefined;

    const connect = () => {
      if (disposed) return;
      setConnection("connecting");
      let token = localStorage.getItem("user_id");
      if (!token) {
        token = crypto.randomUUID();
        localStorage.setItem("user_id", token);
      }

      const url = new URL(websocketUrl("/ws"));
      url.searchParams.set("token", token);
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.addEventListener("open", () => {
        setConnection("open");
        setError("");
      });
      socket.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(String(event.data)) as ServerMessage;
          if (data.type === "error") setError(data.content ?? "The server rejected that request.");
          if (data.type === "init" && data.username) setUsername(data.username);
          if ((data.type === "init" || data.type === "messages") && data.messages) {
            setMessages([...data.messages].reverse());
          }
        } catch (reason) {
          console.error("Invalid chat message", reason);
        }
      });
      socket.addEventListener("close", () => {
        if (socketRef.current === socket) socketRef.current = null;
        if (!disposed) {
          setConnection("closed");
          reconnectTimer = window.setTimeout(connect, 1500);
        }
      });
      socket.addEventListener("error", () => setError("The live connection dropped. Reconnecting…"));
    };

    connect();
    return () => {
      disposed = true;
      if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, []);

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message) return;
    if (socketRef.current?.readyState !== WebSocket.OPEN) {
      setError("Still connecting. Try again in a moment.");
      return;
    }
    socketRef.current.send(JSON.stringify({ message, messageCount: 15 }));
    setDraft("");
  };

  return (
    <Layout>
      <section className="page-hero compact chat-heading">
        <div><p className="eyebrow">Live · mostly unmoderated</p><h1>Talk room</h1></div>
        <span className={`connection ${connection}`}><i />{connection}</span>
      </section>
      {error && <div className="notice error" role="alert">{error}</div>}
      <section className="chat-panel">
        <div className="chat-identity">You are <strong>{username || "being assigned a name…"}</strong></div>
        <div className="messages" aria-live="polite">
          {messages.length === 0 && <p className="muted">No messages received yet.</p>}
          {messages.map((message, index) => (
            <article className="message" key={`${message.created_at}-${message.author}-${index}`}>
              <div><strong>{message.author}</strong><time>{timestamp(message.created_at)}</time></div>
              <p>{message.text}</p>
            </article>
          ))}
        </div>
        <form className="chat-compose" onSubmit={send}>
          <label htmlFor="chat-message">Message</label>
          <textarea id="chat-message" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={1000} />
          <button className="button" type="submit">Send message</button>
        </form>
      </section>
    </Layout>
  );
}
