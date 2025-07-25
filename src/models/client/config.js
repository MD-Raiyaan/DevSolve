import { env } from "@/env";
import { Client, Account, Databases, Avatars, Storage } from "appwrite";

const client = new Client()
  .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
  .setProject(env.appwrite.projectid); // Your project ID

const account = new Account(client);
const databases=new Databases(client);
const avatar=new Avatars(client);
const storage=new Storage(client);

export {account,databases,avatar,storage,client};
