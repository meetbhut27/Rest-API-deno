import { Db, MongoClient } from "npm:mongodb@6";

const url = "mongodb+srv://meet:s2H5sJtBHiQJ66xE@cluster0.nidm3mk.mongodb.net/";
const client = new MongoClient(url);
const dbName = "todo-app";

let db:Db;

export async function connect(){
    await client.connect();
    console.log("Connected to MongoDB server Successfully!");
    
    db = client.db(dbName);
}

export function getDb() {
    return db;
}

