// import { MongoClient, Db } from "mongodb";
// import dotenv from "dotenv";

// dotenv.config();

// const client = new MongoClient(process.env.MONGO_URI!);

// let db: Db;


// export const connectDB = async () => {
//   await client.connect();
//   db = client.db("cooltimeDB");
//   console.log("MongoDB connected");
// };

// export const getDB = () => {
//   if (!db) throw new Error("Database not initialized");
//   return db;
// };
