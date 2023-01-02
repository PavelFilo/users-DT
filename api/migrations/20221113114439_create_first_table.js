/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.createTable("connections", (table) => {
    table.increments("id").primary();
    table.string("host", 45);
    table.string("user", 45);
    table.string("database", 45);
  });
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name", 45);
    table.string("surname", 45);
    table.string("email", 45);
  });

  await knex.schema.createTable("queue", (table) => {
    table.increments("id").primary();
    table.integer("id_users_conn");
    table.integer("id_credentials");
    table.string("query", 255);
    table.integer("status");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("users");
  await knex.schema.dropTableIfExists("queue");
  await knex.schema.dropTableIfExists("connections");
};
