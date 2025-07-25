import { databases, user } from "@/models/server/config";
import {
  db,
  questionCollection,
  voteCollection,
  answerCollection,
} from "@/models/name";
import { Query } from "node-appwrite";
import { formatDistanceToNow } from "date-fns";
import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    const { queries } = await request.json();
    const questionList = await databases.listDocuments(
      db,
      questionCollection,
      queries
    );
    const questiondocuments=questionList.documents;
    const questions = await Promise.all(
      questiondocuments.map(async (doc) => {
        const author = await user.get(doc.authorId);
        const votes = await databases.listDocuments(db, voteCollection, [
          Query.equal("type", "question"),
          Query.equal("typeId", doc.$id),
          Query.limit(1),
        ]);
        const answers = await databases.listDocuments(db, answerCollection, [
          Query.equal("questionId", doc.$id),
          Query.limit(1),
        ]);

        return {
          votes: votes.total,
          answers: answers.total,
          title: doc.title,
          tags: doc.tags,
          user: author.name,
          askedAt: formatDistanceToNow(doc.$createdAt, { addSuffix: true }),
          id:doc.$id
        };
      })
    );

    return NextResponse.json({ success: true, questions,total:questionList.total });
  } catch (error) {
      console.error("API ERROR:", error);
    return NextResponse.json({error:error.message , success:false});
  }
}
