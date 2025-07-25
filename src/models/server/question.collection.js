import { databases } from "./config";
import { questionCollection, db } from "../name";
import { IndexType, Permission } from "node-appwrite";

export default async function createQuestionCollection() {
  await databases.createCollection(db, questionCollection, questionCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.update("users"),
    Permission.create("users"), 
    Permission.delete("users"),
  ]);
  console.log("question collection is created ");
  await Promise.all([
    databases.createStringAttribute(db, questionCollection, "title", 100, true),
    databases.createStringAttribute(db, questionCollection, "content", 10000, true),
    databases.createStringAttribute(db, questionCollection, "authorId",50,true),
    databases.createStringAttribute(db,questionCollection,"tags",50,true,undefined,true),
    databases.createStringAttribute(db,questionCollection,"attachmentId",100,true,undefined,true)
  ]);
  console.log("attributes of question is created ");
  await Promise.all([
       databases.createIndex(db,questionCollection,"title",IndexType.Fulltext,["title"],["asc"]),
       databases.createIndex(db,questionCollection,"content",IndexType.Fulltext,["content"],["asc"]),
  ]);
}
