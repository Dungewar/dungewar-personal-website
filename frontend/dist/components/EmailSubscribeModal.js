"use strict";
// Standalone, reusable Web Component (TypeScript)
// Usage:
// 1) Drop this file under your frontend/src/components/ (or anywhere compiled by tsc)
// 2) Build: tsc -p . (your existing build)
// 3) Include the compiled JS in your page:
//    <script type="module" src="/frontend/dist/components/EmailSubscribeModal.js"></script>
// 4) Add the element where you want the popup to exist (or just once near </body>):
//    <email-subscribe-modal id="subscribeModal" endpoint="https://dungewar.com/api/email-list-subscribe"></email-subscribe-modal>
// 5) Open it via JS: document.getElementById('subscribeModal')?.show();
//    Or start open with: <email-subscribe-modal open></email-subscribe-modal>
class EmailSubscribeModal extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.render();
    }
    static get observedAttributes() {
        return ['open', 'endpoint', 'payload-mode'];
    }
    attributeChangedCallback(name) {
        if (name === 'open')
            this.syncOpen();
    }
    connectedCallback() {
        this.syncOpen();
        // Close on Esc
        // @ts-ignore
        this.root.addEventListener('keydown', (e) => {
            if (e.key === 'Escape')
                this.hide();
        });
    }
    /** Public API */
    show() { this.setAttribute('open', ''); this.inputEl.focus(); }
    hide() { this.removeAttribute('open'); }
    syncOpen() {
        const isOpen = this.hasAttribute('open');
        this.overlayEl.style.pointerEvents = isOpen ? 'auto' : 'none';
        this.overlayEl.style.opacity = isOpen ? '1' : '0';
        this.dialogEl.setAttribute('aria-hidden', String(!isOpen));
        if (isOpen)
            setTimeout(() => this.inputEl.focus(), 10);
    }
    endpoint() {
        return this.getAttribute('endpoint') || 'https://dungewar.com/api/email-list-subscribe';
    }
    // 'json' (default) => { email: "..." }
    // 'text'             => raw email as text/plain
    payloadMode() {
        const mode = (this.getAttribute('payload-mode') || 'json').toLowerCase();
        return mode === 'text' ? 'text' : 'json';
    }
    validate(email) {
        // Simple pragmatic validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }
    setBusy(busy) {
        this.confirmBtn.disabled = busy || !this.validate(this.inputEl.value);
        this.inputEl.disabled = busy;
        this.closeBtn.disabled = busy;
        this.root.host.classList.toggle('busy', busy);
    }
    setMessage(text, kind = 'info') {
        this.msgEl.textContent = text;
        this.msgEl.setAttribute('data-kind', kind);
        this.msgEl.style.opacity = text ? '1' : '0';
    }
    async handleSubmit() {
        const email = this.inputEl.value.trim();
        if (!this.validate(email)) {
            this.setMessage('Please enter a valid email address.', 'error');
            return;
        }
        this.setBusy(true);
        this.setMessage('Submitting…');
        const mode = this.payloadMode();
        const url = this.endpoint();
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: mode === 'json' ? { 'Content-Type': 'application/json' } : { 'Content-Type': 'text/plain' },
                body: mode === 'json' ? JSON.stringify({ email }) : email
            });
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(text || `Request failed (${res.status})`);
            }
            this.setMessage('Subscribed! Check your inbox ✉️', 'success');
            this.inputEl.value = '';
            this.confirmBtn.disabled = true;
            setTimeout(() => this.hide(), 1000);
        }
        catch (err) {
            this.setMessage(err?.message || 'Something went wrong. Try again?', 'error');
        }
        finally {
            this.setBusy(false);
        }
    }
    render() {
        const style = document.createElement('style');
        style.textContent = `
      :host { all: initial; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
      *, *::before, *::after { box-sizing: border-box; }

      :host { position: fixed; inset: 0; z-index: 9999; }
      .overlay { position: absolute; inset: 0; background: rgba(0,0,0,.35); opacity: 0; transition: opacity .18s ease; display: grid; place-items: center; pointer-events: none; }

      .dialog { width: min(92vw, 420px); border-radius: 16px; background: var(--panel, #0b0b0b); color: #111; box-shadow: 0 20px 50px rgba(0,0,0,.25); position: relative; overflow: hidden; transform: translateY(10px) scale(.98); opacity: 0; transition: transform .22s ease, opacity .22s ease; }
      :host([open]) .dialog { transform: translateY(0) scale(1); opacity: 1; }

      /* Cheese-yellow theme */
      :host { --cheese-50:#FFF8E1; --cheese-100:#FFECB3; --cheese-200:#FFE082; --cheese-300:#FFD54F; --cheese-400:#FFCA28; --cheese-500:#FFC107; --cheese-600:#FFB300; --ink:#111; --muted:#555; --ring: rgba(255,193,7,.45); }
      .header { background: linear-gradient(180deg, var(--cheese-400), var(--cheese-300)); padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; }
      .title { font-weight: 700; color: var(--ink); font-size: 16px; letter-spacing: .2px; }
      .body { background: #fff; padding: 18px 16px 16px; }
      .desc { color: var(--muted); line-height: 1.45; font-size: 14px; margin: 0 0 12px; }
      .desc em { font-style: italic; }

      .xbtn { appearance: none; border: none; background: transparent; cursor: pointer; inline-size: 36px; block-size: 36px; border-radius: 10px; display: inline-grid; place-items: center; color: #5b4000; }
      .xbtn:hover { background: var(--cheese-100); }
      .xbtn:active { transform: translateY(1px); }

      .field { display: grid; gap: 8px; margin: 8px 0 12px; }
      .label { font-size: 13px; color: #472f00; font-weight: 600; }
      .input { font: inherit; padding: 12px 12px; border-radius: 12px; border: 1px solid var(--cheese-200); outline: none; background: var(--cheese-50); color: var(--ink); }
      .input:focus { border-color: var(--cheese-400); box-shadow: 0 0 0 4px var(--ring); }

      .actions { display: flex; gap: 8px; justify-content: flex-end; align-items: center; }
      .btn { appearance: none; font: inherit; font-weight: 700; letter-spacing: .2px; padding: 11px 14px; border-radius: 12px; border: 0; cursor: pointer; }
      .btn.primary { background: var(--cheese-500); color: #3b2a00; }
      .btn.primary:hover { background: var(--cheese-600); }
      .btn:disabled { opacity: .5; cursor: not-allowed; }

      .msg { min-height: 18px; font-size: 13px; margin: 2px 0 6px; transition: opacity .18s; opacity: 0; }
      .msg[data-kind="error"] { color: #b00020; }
      .msg[data-kind="success"] { color: #006400; }

      @media (prefers-reduced-motion: reduce) {
        .overlay, .dialog { transition: none; }
      }
    `;
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.tabIndex = -1; // to receive keydown
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-labelledby', 'title');
        const header = document.createElement('div');
        header.className = 'header';
        const title = document.createElement('div');
        title.className = 'title';
        title.id = 'title';
        title.textContent = 'Stay Updated';
        const x = document.createElement('button');
        x.className = 'xbtn';
        x.setAttribute('aria-label', 'Close');
        x.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        header.append(title, x);
        const body = document.createElement('div');
        body.className = 'body';
        const desc = document.createElement('p');
        desc.className = 'desc';
        desc.innerHTML = `Sign up for <em>automatic</em> website updates! <small>(Note: you may be spammed — there are many)</small>`;
        const field = document.createElement('div');
        field.className = 'field';
        const label = document.createElement('label');
        label.className = 'label';
        label.setAttribute('for', 'email');
        label.textContent = 'Email';
        const input = document.createElement('input');
        input.id = 'email';
        input.className = 'input';
        input.type = 'email';
        input.placeholder = 'you@example.com';
        input.autocomplete = 'email';
        input.required = true;
        const msg = document.createElement('div');
        msg.className = 'msg';
        const actions = document.createElement('div');
        actions.className = 'actions';
        const confirm = document.createElement('button');
        confirm.className = 'btn primary';
        confirm.type = 'button';
        confirm.textContent = 'Confirm';
        confirm.disabled = true; // enable on valid email
        actions.append(confirm);
        field.append(label, input);
        body.append(desc, field, msg, actions);
        dialog.append(header, body);
        overlay.append(dialog);
        this.root.append(style, overlay);
        // keep refs
        this.inputEl = input;
        this.confirmBtn = confirm;
        this.closeBtn = x;
        this.msgEl = msg;
        this.overlayEl = overlay;
        this.dialogEl = dialog;
        // wire events
        x.addEventListener('click', () => this.hide());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay)
                this.hide(); // click outside
        });
        input.addEventListener('input', () => {
            this.setMessage('', 'info');
            this.confirmBtn.disabled = !this.validate(this.inputEl.value);
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.confirmBtn.disabled) {
                this.handleSubmit();
            }
        });
        confirm.addEventListener('click', () => this.handleSubmit());
    }
}
if (!customElements.get('email-subscribe-modal')) {
    customElements.define('email-subscribe-modal', EmailSubscribeModal);
}
//# sourceMappingURL=EmailSubscribeModal.js.map