const form = document.querySelector('#formlol');
import window from "../config/config.js";
const url = window.CONFIG.API_URL;

form.onsubmit = e => {
  e.preventDefault();
  console.log(`Submit ${e.target.email.value}`)
  // send POST to action
  fetch(`${url}/api/email-list-subscribe`, {
    method: "POST",
    headers: {'content-type':'application/json'},
    body: JSON.stringify({
      email: e.target.email.value,
    })
  });
}