/* Use a Class so it can easily be used multiple times per page */
class IFrameToggle {

    iframe: HTMLElement;
    toggleButton: HTMLElement;
    open: boolean;

    constructor(iframe: HTMLElement) {
        this.iframe = iframe;
        this.toggleButton = this.iframe.querySelector(".js-iframe-toggle")!;
        this.open = false;

        this.eventHandlers();
        this.update();
    }

    eventHandlers() {
        this.toggleButton.addEventListener("click", () => this.toggle());
    }

    toggle() {
        this.open = !this.open;
        this.update();
    }

    update() {
        // set the data attribute on the HTML element
        this.iframe.dataset.open = this.open ? "true" : "false";
    }
}

/* using a different class to target this than using in CSS. Just to separate concerns */
document.querySelectorAll(".js-iframe").forEach((el) => {
    if (el instanceof HTMLElement) {
        new IFrameToggle(el);
    } else {
        console.error("Element called js-iframe not instanceof HTMLElement >:(");
    }
});
