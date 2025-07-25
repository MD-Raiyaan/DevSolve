import { answerCollection, db, questionCollection } from "@/models/name";
import { databases, user } from "@/models/server/config";
import { NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { answer, questionId, authorId } = reqBody;

    const response = await databases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        content: answer,
        questionId: questionId,
        authorId: authorId,
      }
    );

    const usePrefs = user.getPrefs(authorId);

    await user.updatePrefs(authorId, {
      reputation: Number(usePrefs.reputation) + 1,
    });

    return NextResponse.json(response, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "answer creation error ",
      },
      {
        status: error?.status || error?.code || 500,
      }
    );
  }
}

export async function GET(request) {
  try {
   const url = new URL(request.url);
   const questionId = url.searchParams.get("questionId");

    const questionDoc = await databases.getDocument(
      db,
      questionCollection,
      questionId
    );

    const author = await user.get(questionDoc.authorId);

    let answers = await databases.listDocuments(db, answerCollection, [
      Query.equal("questionId", questionId),
      Query.orderDesc("$createdAt"),
    ]);

      answers = await Promise.all(
        answers.documents.map(async (answer) => {
          const answerAuthor = await user.get(answer.authorId);
          return { ...answer, author: answerAuthor.name };
        })
      );

    return NextResponse.json({
      success: true,
      question: {
        ...questionDoc,
        author: author.name,
      },
      answers,
    });
  } catch (error) {
     return NextResponse.json({success:false,error:error.message});
  }
}

export async function DELETE(request) {
  try {
    const reqBody = await request.json();
    const { answerId } = reqBody;

    const answer = await databases.deleteDocument(
      db,
      answerCollection,
      answerId
    );
    const usePrefs = user.getPrefs(answer.authorId);

    await user.updatePrefs(answer.authorId, {
      reputation: Number(usePrefs.reputation) + 1,
    });

    return NextResponse.json(response, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "answer creation error ",
      },
      {
        status: error?.status || error?.code || 500,
      }
    );
  }
}
