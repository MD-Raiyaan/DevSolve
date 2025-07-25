import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { databases, storage } from "@/models/server/config";
import { NextResponse } from "next/server";
export async function POST(request){
    try {
        const {questionId}=await request.json();
        const document= await databases.getDocument(db,questionCollection,questionId);
        
        const data = {
          title: document.title,
          content: document.content,
          attachments: document.attachmentId,
          questionId,
          tags: document.tags,
        };
        return NextResponse.json({success:true,data});
    } catch (error) {
        return NextResponse.json({success:false,error:error.message});
    }
}