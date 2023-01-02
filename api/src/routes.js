const mysql = require("mysql2/promise");
require("dotenv").config();
const { toBase64, fromBase64, updateAllNodes } = require("../src/helpers");

const animalBodyJsonSchema = {
  type: "object",
  required: ["name", "surname", "email"],
  properties: {
    name: { type: "string" },
    surname: { type: "string" },
    email: { type: "string" },
  },
};

const schema = {
  body: animalBodyJsonSchema,
};

const routes = (fastify, opts, next) => {
  fastify.get("/get-user", async (request, reply) => {
    if (!request.query.id) {
      return reply.send({ message: "no id provided" });
    }
    let localConnection;
    try {
      localConnection = await mysql.createConnection(
        `mysql://root:secret@host.docker.internal:${process.env.DB_PORT}/projekt`
      );
    } catch (err) {
      console.error(err);
      return reply.send({ message: "cannot connect to local db" });
    }

    const [rows] = await localConnection.query(
      "SELECT * FROM users WHERE id = " + request.query.id
    );

    reply.send(rows[0]);
  });

  fastify.get("/remove-user", async (request, reply) => {
    if (!request.query.id) {
      return reply.send({ message: "no id provided" });
    }
    let localConnection;
    try {
      localConnection = await mysql.createConnection(
        `mysql://root:secret@host.docker.internal:${process.env.DB_PORT}/projekt`
      );
    } catch (err) {
      console.error(err);
      return reply.send({ message: "cannot connect to local db" });
    }

    await localConnection.query(
      "DELETE FROM users WHERE id = " + request.query.id
    );

    reply.send({ success: true, message: "user deleted" });
  });

  fastify.get("/get-users", async (request, reply) => {
    let localConnection;
    try {
      localConnection = await mysql.createConnection(
        `mysql://root:secret@host.docker.internal:${process.env.DB_PORT}/projekt`
      );
    } catch (err) {
      console.error(err);
      return reply.send({ message: "cannot connect to local db" });
    }

    const [rows] = await localConnection.query("SELECT * FROM users");

    reply.send(rows);
  });

  fastify.post("/add-item", { schema }, async (request, reply) => {
    const { name, surname, email } = request.body;

    let localConnection;

    // local update
    try {
      localConnection = await mysql.createConnection(
        `mysql://root:secret@host.docker.internal:${process.env.DB_PORT}/projekt`
      );
    } catch (err) {
      console.error(err);
      return reply.send({ message: "cannot connect to local db" });
    }

    const insertQuery = `INSERT INTO users (name, surname, email) VALUES ('${name}', '${surname}', '${email}')`;

    const result = await localConnection.query(insertQuery);

    const resultId = result[0].insertId;

    await updateAllNodes(localConnection, insertQuery, resultId);

    reply.send({ name, surname, email });
  });

  fastify.post("/edit-item", { schema }, async (request, reply) => {
    const { id, name, surname, email } = request.body;

    let localConnection;

    // local update
    try {
      localConnection = await mysql.createConnection(
        `mysql://root:secret@host.docker.internal:${process.env.DB_PORT}/projekt`
      );
    } catch (err) {
      console.error(err);
      return reply.send({ message: "cannot connect to local db" });
    }

    const insertQuery = `UPDATE users SET name = '${name}', surname = '${surname}', email = '${email}' WHERE id = ${id};`;

    const result = await localConnection.query(insertQuery);

    const resultId = result[0].insertId;

    await updateAllNodes(localConnection, insertQuery, resultId);

    reply.send({ name, surname, email });
  });

  next();
};

module.exports = routes;

// fastify.get("/activate-user", async (request, reply) => {
//   if (!request.params.token)
//     return reply.send({ message: "Token was not provided!" });

//   const id = decodeId(request.params.token);

//   let localConnection;
//   try {
//     localConnection = await mysql.createConnection(
//       `mysql://root:secret@host.docker.internal:${process.env.DB_PORT}/projekt`
//     );
//   } catch (err) {
//     console.error(err);
//     return reply.send({ message: "cannot connect to local db" });
//   }

//   const updateUserQuery = `UPDATE pouzivatel SET stav = "aktivovany" WHERE id_pouzivatel = ${id}`;

//   await localConnection.query(updateUserQuery);

//   reply.send({ message: "User activated successfully", status: 200 });
// });
