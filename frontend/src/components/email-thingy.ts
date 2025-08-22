const form = document.querySelector<HTMLFormElement>('#email-submit-form');
import { CONFIG } from "../config/config.js";

if (!form) {
  throw new Error("Missing required form.");
}

form.onsubmit = e => {
  e.preventDefault();
  // @ts-ignore
  console.log(`Submit ${e.target.email.value}`)
  // send POST to action
  fetch(`${CONFIG.API_URL}/api/email-list-subscribe`, {
    method: "POST",
    headers: {'content-type':'application/json'},
    body: JSON.stringify({
      // @ts-ignore
      email: e.target.email.value,
    })
  });
}