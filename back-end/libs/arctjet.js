require("dotenv").config();

const aj = (async () => {
  const arcjetModule = await import("@arcjet/node");
  const arcjet = arcjetModule.default;
  const { shield, detectBot, tokenBucket } = arcjetModule;

  return arcjet({
    key: process.env.ARCJET_KEY,
    //  characteristics: [
    //         "ip.src",
    //         "http.method",
    //         "http.path",
    //         "http.headers.accept",
    //         "http.headers.user-agent",
    //       ],
    characteristics: ["ip.src", "header.user-agent", "header.accept-language"],

    rules: [
      shield({ mode: "LIVE" }),

      detectBot({
        mode: "LIVE",
        allow: ["CATEGORY:SEARCH_ENGINE"],
      }),
      tokenBucket({
        mode: "LIVE",
        refillRate: 30,
        interval: 5,
        capacity: 20,
      }),
    ],
  });
})();

module.exports = aj;
