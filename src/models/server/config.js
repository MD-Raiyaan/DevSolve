import { env } from "@/env";
import { Client , Databases,Storage,Users,Avatars} from "node-appwrite";

let client = new Client();

client
  .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
  .setProject(env.appwrite.projectid) // Your project ID
  .setKey(env.appwrite.apikey) // Your secret API key

const databases=new Databases(client);
const storage=new Storage(client);
const user=new Users(client);
const avatar=new Avatars(client);

export { user, databases, avatar, storage, client };