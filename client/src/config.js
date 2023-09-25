export default {
  apiBaseURL: import.meta.env.DEV
    ? "http://localhost:3002"
    : "https://ssd-api.vercel.app",
};
