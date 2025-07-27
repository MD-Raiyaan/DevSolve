import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, user } from "@/models/server/config";
import { NextResponse } from "next/server";
import { Query, ID } from "node-appwrite";

export async function POST(request) {
  try {
    const { votedById, typeId, voteStatus, type } = await request.json();

    const response = await databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("votedById", votedById),
    ]);

    // previously some vote is done
    if (response.documents.length > 0) {
      await databases.deleteDocument(
        db,
        voteCollection,
        response.documents[0].$id
      );

      const questionOranswer = await databases.getDocument(
        db,
        type == "question" ? questionCollection : answerCollection,
        typeId
      );

      const prefs = await user.getPrefs(questionOranswer.authorId);
      await user.updatePrefs(questionOranswer.authorId, {
        reputation:
          response.documents[0].voteStatus === "upvoted"
            ? Number(prefs.reputation) - 1
            : Number(prefs.reputation) + 1,
      });
    }

    // new votes is made or different vote than previous is done
    if (response.documents[0]?.voteStatus !== voteStatus) {
      const doc = await databases.createDocument(
        db,
        voteCollection,
        ID.unique(),
        {
          voteStatus: voteStatus,
          votedById: votedById,
          type: type,
          typeId: typeId,
        }
      );

      const questionOranswer = await databases.getDocument(
        db,
        type == "question" ? questionCollection : answerCollection,
        typeId
      );

      const prefs = await user.getPrefs(questionOranswer.authorId);
      await user.updatePrefs(questionOranswer.authorId, {
        reputation:
          voteStatus === "upvoted"
            ? Number(prefs.reputation) +1
            : Number(prefs.reputation) -1,
      });
    }

    const [upvotes, downvotes] = await Promise.all([
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "upvoted"),
        Query.limit(1),
      ]),
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "downvoted"),
        Query.limit(1),
      ]),
    ]);

    return NextResponse.json({
      success:true,
      voteResult: upvotes.total - downvotes.total,
      message: response.documents[0] ? "Vote Status Updated" : "Voted",
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "error in voting",
      },
      {
        status: error?.status || error?.code || 500,
      }
    );
  }
}
