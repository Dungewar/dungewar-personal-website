import { BASE_URL } from "../utils/url-utils.js";
class MailSignupWidget extends HTMLElement {
    constructor() {
        super();
        // --- Dialog ---
        const emailSubmitDialog = document.createElement("dialog");
        // --- Mail Button ---
        const mailButton = document.createElement("button");
        mailButton.textContent = "Sign up to my mailing list!";
        mailButton.addEventListener("click", () => {
            const dialog = emailSubmitDialog;
            if (dialog?.open)
                dialog.close();
            else
                dialog?.showModal();
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
            "Add your email to my mailing list to get FREE updates whenever the website changes!";
        // Form
        const emailForm = document.createElement("form");
        emailForm.method = "post";
        emailForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const target = e.target;
            const emailInput = target.elements.namedItem("email");
            console.log(`Submit ${emailInput.value}`);
            fetch(`${BASE_URL}/api/email-list-subscribe`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email: emailInput.value }),
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
        // this.append(mailButton, emailSubmitDialog);
        // FOR .CSS
        emailSubmitDialog.id = "email-submit-dialog";
        mailButton.className = "mail-trigger";
        closeButton.id = "close_btn";
        emailForm.id = "email-submit-form";
        emailInput.id = "email_input"; // optional
        submitButton.id = "submit_btn";
        // -- Finally, put button + dialog in the DOM
        const wrapper = document.createElement("div");
        wrapper.className = "mail-widget-wrapper";
        wrapper.append(mailButton, emailSubmitDialog);
        this.append(wrapper);
    }
}
customElements.define("mail-signup-widget", MailSignupWidget);
//# sourceMappingURL=mail-signup-widget.js.map