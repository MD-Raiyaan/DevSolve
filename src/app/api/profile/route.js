import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, user } from "@/models/server/config";
import { useAuthStore } from "@/store/auth";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function POST(request){
    try {
        const {userId}=await request.json();
        const userData=await user.get(userId);
    
        const votedList= await databases.listDocuments(db,voteCollection,[
            Query.equal("votedById",userId),
            Query.limit(1)
        ])
        const queries = [
          Query.orderDesc("$createdAt"),
          Query.equal("authorId", userId),
        ];
        const answerList = await databases.listDocuments(
          db,
          answerCollection,
          queries
        );
        
        const questionList=await databases.listDocuments(db,questionCollection,queries);
        
        const data = {
          avatarUrl: userData.prefs.avatar,
          name: userData.name,
          email: userData.email,
          reputation: userData.prefs.reputation,
          votes: votedList.total,
          questionsAsked: questionList.documents,
          answersGiven:answerList.documents
        };
        
        return NextResponse.json({success:true,data});
    } catch (error) {
        return NextResponse.json({success:false,error:error.message}); 
    }
}