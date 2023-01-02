require("dotenv").config();

const fastify = require("fastify")({
  logger: true,
});

fastify.get("/", async (request, reply) => {
  reply.send({ hello: "world" + process.env.DB_PORT });
});

const cors = require("@fastify/cors");

fastify.register(cors, {
  // put your options here
});

fastify.register(require("./src/routes"));

fastify.listen(
  { port: process.env.NODE_DOCKER_PORT, host: "0.0.0.0" },
  (err) => {
    if (err) throw err;
    console.log(`server listening on ${fastify.server.address().port}`);
  }
);
