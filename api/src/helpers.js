const mysql = require("mysql2/promise");

const toBase64 = (text) => {
  return Buffer.from(text, "base64").toString();
};

const fromBase64 = (text) => {
  return Buffer.from(text, "ascii").toString();
};

const updateAllNodes = async (localConnection, query, resultId) => {
  const queueInsertQuery = `INSERT INTO queue (id_users_conn, id_credentials, query, status) VALUES ('${resultId}', '-1', "${query}", 1)`;

  const queueResponse = await localConnection.query(queueInsertQuery);

  // distant nodes update
  if (queueResponse) {
    const [credentials] = await localConnection.query(
      "SELECT * FROM connections"
    );

    await credentials.forEach(async ({ id, host, user, database }) => {
      const queueInsertQuery = `INSERT INTO queue (id_users_conn, id_credentials, query, status) VALUES ('${resultId}', '${id}', "${query}", 0)`;

      console.log(query);

      await localConnection.query(queueInsertQuery);

      let distantConnection;
      try {
        distantConnection = await mysql.createConnection(
          `mysql://${user}@${host}/${database}`
        );
      } catch (err) {
        console.log(err);
        return;
      }

      console.log("connected to distant node");

      const queueSelect = `SELECT * FROM queue WHERE status = 0 and id_credentials = ${id} ORDER BY \`id\` ASC`;

      const [queueRows] = await localConnection.query(queueSelect);

      await queueRows.forEach(async ({ id, query }) => {
        const maxIdQuery = "select max(id) as max_id from users";

        const [maxIdRowsBefore] = await distantConnection.query(maxIdQuery);

        const queueQueryResponse = await distantConnection.query(query);

        const [maxIdRowsAfter] = await distantConnection.query(maxIdQuery);

        console.log(
          queueQueryResponse,
          maxIdRowsBefore[0].max_id,
          maxIdRowsAfter[0].max_id
        );

        if (queueQueryResponse) {
          console.log("queryId: ", id);

          const updateString = `UPDATE queue SET status = 1 WHERE id = ${id}`;

          await localConnection.query(updateString);
        }
      });
    });
  }
};

module.exports = { toBase64, fromBase64, updateAllNodes };
