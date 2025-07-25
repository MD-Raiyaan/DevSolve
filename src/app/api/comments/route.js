import { commentCollection, db } from "@/models/name";
import { databases, user } from "@/models/server/config";
import { NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request){
     try {
        const CommentData=await request.json();
   
        await databases.createDocument(db,commentCollection,ID.unique(),CommentData);

   
        return NextResponse.json({success:true,error:false});
     } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
     } 
}

export async function GET(request){
     try {
        const url = new URL(request.url);
        const type = url.searchParams.get("type");
        const typeId=url.searchParams.get("typeId");
        let comments= await databases.listDocuments(db,commentCollection,[
            Query.orderDesc("$createdAt"),
            Query.equal("type",type),
            Query.equal("typeId",typeId)
        ])
         
        comments=await Promise.all(comments.documents.map(async(comm)=>{
             const author=await user.get(comm.authorId);
             return {...comm,author:author.name};
        }))
        

         return NextResponse.json({ success: true, data:comments});
     } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
     }
}

export async function DELETE(request){
    try {
       const url = new URL(request.url);
      const commentId = url.searchParams.get("commentId");

      await databases.deleteDocument(db,commentCollection,commentId);

      return NextResponse.json({ success: true, error: false });
    } catch (error) {
      return NextResponse.json({ success: false, error: error.message });
    }
}