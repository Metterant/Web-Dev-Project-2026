const { createProxyMiddleware } = require("http-proxy-middleware");

console.log("setupProxy.js loaded");

module.exports = function (app) {
    console.log("proxy middleware configured");
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://localhost:5000",
            changeOrigin: true,
            logLevel: "debug",
        }),
    );
};
