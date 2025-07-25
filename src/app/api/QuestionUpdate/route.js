import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { databases, storage, user } from "@/models/server/config";
import { NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request){
     try {
      const { title, content, tags, user, attachementIds, questionId } =
        await request.json();
      const oldQuestionDoc=await databases.getDocument(db,questionCollection,questionId);

      oldQuestionDoc.attachmentId.forEach( async ( ele) => {
           await storage.deleteFile(questionAttachmentBucket,ele);
      });
       
      await databases.updateDocument(db, questionCollection, questionId, {
        title: title,
        content: content,
        tags: tags,
        authorId: user?.$id,
        attachmentId: attachementIds,
      });

      return NextResponse.json({success:true,error:null});
     } catch (error) {
      return NextResponse.json({ success: false, error: error.message });
     }
}