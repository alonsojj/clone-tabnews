import database from "infra/database.js";
import { connectionString } from "pg/lib/defaults";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseName = process.env.POSTGRES_DB;
  const databaseActiveConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int FROM PG_STAT_ACTIVITY WHERE datname = $1;",
    values: [databaseName],
  });
  
  const databaseActiveConnectionsValue =
    databaseActiveConnectionsResult.rows[0].count;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  response.status(200).json({
    updated_at: updatedAt,
    dependecies: {
      database: {
        version: parseInt(databaseVersionValue),
        max_connections: parseInt(databaseMaxConnectionsValue),
        active_connections: databaseActiveConnectionsValue,
      },
    },
  });
}
export default status;
