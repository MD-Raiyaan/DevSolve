import { storage } from "./config";
import { questionAttachmentBucket } from "../name";
import { Permission } from "appwrite";

export default async function getOrCreateStorage() {
  try {
    await storage.getBucket(questionAttachmentBucket);
    console.log("Storage connected ");
  } catch (error1) {
    try {
      await storage.createBucket(
        questionAttachmentBucket,
        questionAttachmentBucket,
        [
          Permission.read("users"),
          Permission.update("users"),
          Permission.delete("users"),
          Permission.create("users"),
          Permission.read("any"),
        ],
        false,
        undefined,
        undefined,
        ["jpg", "png", "gif", "jpeg", "webp", "heic"]
      );
      console.log("Storage created");
      console.log("Storage connected");
    } catch (error) {
      console.log("Error creating storage : ", error);
    }
  }
}
