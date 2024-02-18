import sqlite3 from "sqlite3";

const database = {
  init: () =>
    new sqlite3.Database("./mydatabase.db", (err) => {
      if (err) {
        console.error("Error when trying to open the database.", err.message);
      } else {
        console.log("Successfully database created!");
      }
    }),
  createTable: async (dbinstance) => {
    await new Promise((resolve, reject) => {
      dbinstance.run(
        `
                  CREATE TABLE IF NOT EXISTS videos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    url TEXT NOT NULL
                  )
                `,
        (err) => {
          if (err) {
            console.error("Error creating table:", err.message);
            reject(err);
          } else {
            console.log("Table created successfully");
            resolve("Great");
          }
        }
      );
    });
  },
};

export default database;
