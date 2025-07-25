import createAnswerCollection from "./answer.collection";
import createQuestionCollection from "./question.collection";
import createCommentCollection from "./comment.collection";
import createVoteCollection from "./vote.collection";
import { db } from "../name";
import { databases } from "./config";

export default async function getOrCreateDb() {
     try {
         await databases.get(db);
         console.log("Database connected");
     } catch (error1) {
        try {
            await databases.create(db,db);
            console.log("Database created ");
            await Promise.all([
                createAnswerCollection(),
                createCommentCollection(),
                createQuestionCollection(),
                createVoteCollection(),
            ]);
            console.log("Database connected")
        } catch (error) {
            console.log("Error in creating Database : ",error);
        }
     }
}