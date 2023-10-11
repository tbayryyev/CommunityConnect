
const connection = require("./config/mongoConnection");

async function main() {
    const db = await connection.connectToDb();
    // to clear database
    await db.dropDatabase();

    await connection.closeConnection();

}

main();
