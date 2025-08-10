import { databases } from "@/models/server/config";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { Query } from "node-appwrite";
import { user } from "@/models/server/config";
import { formatDistanceToNow } from "date-fns";
import { NextResponse } from "next/server";
export async function GET(){
    try {
        const questiondata = await databases.listDocuments(
          db,
          questionCollection,
          [Query.orderDesc("$createdAt"), Query.limit(10)]
        );
        const questiondocuments = questiondata.documents;
        const questions = await Promise.all(
          questiondocuments.map(async (doc) => {
            const author = await user.get(doc.authorId);
            const votes = await databases.listDocuments(db, voteCollection, [
              Query.equal("type", "question"),
              Query.equal("typeId", doc.$id),
              Query.limit(1),
            ]);
            const answers = await databases.listDocuments(
              db,
              answerCollection,
              [Query.equal("questionId", doc.$id), Query.limit(1)]
            );

            return {
              id:doc.$id,
              votes: votes.total,
              answers: answers.total,
              title: doc.title,
              tags: doc.tags,
              user: author.name,
              askedAt: formatDistanceToNow(doc.$createdAt, { addSuffix: true }),
            };
          })
        );

        const allUsers = await user.list();

        const contributors = allUsers.users
          .sort((a, b) => a.prefs.reputation > b.prefs.reputation)
          .slice(0, 10)
          .map((user) => {
            return { name: user.name, reputation: user.prefs.reputation };
          });


        return NextResponse.json({success:true ,contributors,questions});
    } catch (error) {
        return NextResponse.json({error:error.message , success:false});
    }
}