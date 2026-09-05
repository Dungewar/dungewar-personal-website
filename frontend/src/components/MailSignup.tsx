import { FormEvent, useState } from "react";
import { postJson } from "../api";

type Status = "idle" | "submitting" | "success" | "error";

export function MailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    try {
      const response = await postJson("/api/email-list-subscribe", { email });
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Mailing-list signup failed", error);
      setStatus("error");
    }
  };

  return (
    <section className="mail-card" aria-labelledby="mail-heading">
      <div>
        <p className="eyebrow">Occasional transmissions</p>
        <h2 id="mail-heading">Hear when something new ships.</h2>
        <p>No schedule. No growth hacks. Just website updates.</p>
      </div>
      <form onSubmit={submit}>
        <label htmlFor="mail-email">Email address</label>
        <div className="input-row">
          <input
            id="mail-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button className="button" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : "Subscribe"}
          </button>
        </div>
        <p className="form-status" aria-live="polite">
          {status === "success" && "You’re on the list."}
          {status === "error" && "That did not work. Please try again."}
        </p>
      </form>
    </section>
  );
}
