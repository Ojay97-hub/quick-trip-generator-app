// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35', // Vibrant Orange
        secondary: '#042D4C', // Deep Navy
        deepBlue: '#004E89', // Trust Blue
        highlight: '#00D4FF', // Bright Cyan
        success: '#00C896', // Teal
        warning: '#FFB703', // Warm Amber
        offWhite: '#F5F5F5',
        light: '#FAFAFA',
      },
      fontFamily: {
        header: ['NunitoSans_700Bold'],
        headerRegular: ['NunitoSans_400Regular'],
        body: ['Poppins_400Regular'],
        bodyBold: ['Poppins_600SemiBold'],
      },
    },
  },
  plugins: [],
}
