let { protocol, hostname, port } = window.location;
if (port === "63342") {
    port = "4000";
}
export const BASE_URL = `${protocol}//${hostname}:${port}`;
//# sourceMappingURL=url-utils.js.map