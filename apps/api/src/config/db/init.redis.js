const { createClient } = require("redis");

const client = createClient({
  url: "redis://:PZw4CYoXzVW5Lj5hvzLVazPq8xQoOM8w@redis-15722.c292.ap-southeast-1-1.ec2.cloud.redislabs.com:15722",
  legacyMode: true,
});

const start = async () => {
  await client.connect();
  await client.on("connect", () => {
    console.log("Redis connected");
  });
  await client.ping((err, reply) => {
    if (err) {
      console.log("Redis connect failure");
    } else {
      console.log("Redis connect successfully with URI");
    }
  });
  await client.on("error", (err) => {
    console.log("Redis error: " + err);
  });
};
start();
module.exports = client;
