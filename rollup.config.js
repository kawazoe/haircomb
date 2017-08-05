export default {
    entry: "./dist/main.js",
    dest: "./dist/bundle.js",
    format: "umd",
    moduleName: "haircomb",

    onwarn: function (warning) {
        if (warning.code === "THIS_IS_UNDEFINED") { return; }
    }
};
