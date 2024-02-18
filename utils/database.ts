import sqlite3 from "sqlite3";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const database = {
  init: () => {
    console.log("yay");
  } /* 
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
  }, */,
};

export default database;
