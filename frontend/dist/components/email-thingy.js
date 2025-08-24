const form = document.querySelector('#email-submit-form');
import { BASE_URL } from "../utils/url-utils.js";
if (!form) {
    throw new Error("Missing required form.");
}
form.onsubmit = e => {
    e.preventDefault();
    const target = e.target;
    const emailInput = target.elements.namedItem("email");
    console.log(`Submit ${emailInput.value}`);
    // send POST to action
    fetch(`${BASE_URL}/api/email-list-subscribe`, {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            email: emailInput.value,
        })
    });
};
//# sourceMappingURL=email-thingy.js.map