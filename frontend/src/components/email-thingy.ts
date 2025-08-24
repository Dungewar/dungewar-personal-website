import {BASE_URL} from "../utils/url-utils.js";

class MailSignupWidget extends HTMLElement {
    constructor() {
        super();

        // --- Dialog ---
        const emailSubmitDialog = document.createElement("dialog");

        // --- Mail Button ---
        const mailButton = document.createElement("button");
        mailButton.textContent = "Sign up to our mailing list!";
        mailButton.addEventListener("click", () => {
            const dialog = emailSubmitDialog;
            if (dialog?.open) dialog.close();
            else dialog?.showModal();
        });

        // Close button
        const closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.addEventListener("click", () => {
            emailSubmitDialog.close();
        });

        // Dialog text
        const emailDialogText = document.createElement("p");
        emailDialogText.textContent =
            "Add your email to our mailing list to get FREE updates whenever the website changes!";

        // Form
        const emailForm = document.createElement("form");
        emailForm.method = "post";

        emailForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const target = e.target as HTMLFormElement;
            const emailInput = target.elements.namedItem("email") as HTMLInputElement;
            console.log(`Submit ${emailInput.value}`);
            fetch(`${BASE_URL}/api/email-list-subscribe`, {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({email: emailInput.value}),
            });
        });

        // Email input
        const emailInput = document.createElement("input");
        emailInput.type = "email";
        emailInput.placeholder = "example@gmail.net";
        emailInput.name = "email"; // so target.elements.namedItem("email") works

        // -- Submit button
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Submit";

        // -- Put input + button inside form
        emailForm.append(emailInput, submitButton);

        // -- Put all pieces inside dialog
        emailSubmitDialog.append(closeButton, emailDialogText, emailForm);

        // -- Finally, put button + dialog in the DOM
        this.append(mailButton, emailSubmitDialog);

    }
}

customElements.define("mail-signup-widget", MailSignupWidget);