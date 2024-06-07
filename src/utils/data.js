// console.log(process.env.NODE_ENV); // "development"
// `npm run build` turns this to "production"

export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:1337"
    : "http://10.1.104.3:1337";
