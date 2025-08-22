"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const form = document.querySelector('#email-submit-form');
const config_js_1 = require("../config/config.js");
if (!form) {
    throw new Error("Missing required form.");
}
form.onsubmit = e => {
    e.preventDefault();
    // @ts-ignore
    console.log(`Submit ${e.target.email.value}`);
    // send POST to action
    fetch(`${config_js_1.CONFIG.API_URL}/api/email-list-subscribe`, {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            // @ts-ignore
            email: e.target.email.value,
        })
    });
};
//# sourceMappingURL=email-thingy.js.map