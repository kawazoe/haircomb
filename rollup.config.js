import localResolve from 'rollup-plugin-local-resolve';

export default {
    input: "./dist/lib/index.js",
    output: {
        file: "./dist/lib/haircomb.js",
        format: "umd",
        name: "haircomb",
        sourcemap: true
    },

    plugins: [
        localResolve()
    ],

    onwarn: function (warning, warn) {
        // This check is required because of how TypeScript compiles classes with inheritance support.
        if (warning.code === "THIS_IS_UNDEFINED") { return; }
        warn(warning);
    }
};
