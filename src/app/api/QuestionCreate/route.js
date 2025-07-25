import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { databases, storage, user } from "@/models/server/config";
import { NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request){
     try {
      const { title, content, tags, attachementIds, user } =
        await request.json();

      
      await databases.createDocument(db,questionCollection,ID.unique(),{
         title:title,
         content:content,
         tags:tags,
         authorId:user?.$id,
         attachmentId:attachementIds,
      })

      return NextResponse.json({success:true,error:null});
     } catch (error) {
      return NextResponse.json({ success: false, error: error.message });
     }
}