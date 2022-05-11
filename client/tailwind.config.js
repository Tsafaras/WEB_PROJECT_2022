module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    jit: true,
    theme: {
        extend: {},
    },
    plugins: [require('@tailwindcss/forms')],
};
