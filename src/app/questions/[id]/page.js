"use client";

import React, { useState, useEffect } from "react";
import VotePanel from "@/components/VotePanel";
import CommentBox from "@/components/CommentBox";
import { Badge } from "@/components/ui/badge";
import { MarkdownPreview } from "@/components/RTE";
import RTE from "@/components/RTE";
import { Particles } from "@/components/magicui/particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import axios from "axios";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import NotLoggedInPrompt from "@/components/NotLoggedIn";
import { storage } from "@/models/client/config";
import { questionAttachmentBucket } from "@/models/name";
import { LoaderOne } from "@/components/ui/loader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import EmailVerificationPrompt from "@/components/EmailVerificationPrompt";
import { useRouter } from "next/navigation";

const AttachmentCarousel = ({ question }) => {
  if (!question?.attachmentId || question.attachmentId.length === 0)
    return null;

  return (
    <div className="mt-4">
      <Carousel>
        <CarouselContent>
          {question.attachmentId.map((attachmentId, index) => {
            const preview = storage.getFileView(
              questionAttachmentBucket,
              attachmentId
            );

            return (
              <CarouselItem key={attachmentId} className="flex justify-center">
                <img
                  src={preview}
                  alt={question.title || `Image ${index + 1}`}
                  className="rounded-lg max-h-96 object-contain"
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className={"bg-black"} />
        <CarouselNext className={"bg-black"} />
      </Carousel>
    </div>
  );
};

const QuestionPage = () => {
  const { id } = useParams();
    const [isloading, setLoading] = React.useState(false);
  const [question, setQuestion] = useState({
    tags: [],
  });
  const [answers, setAnswers] = useState([]);
  const { session ,verified} = useAuthStore();
  const [localTime, setLocalTime] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [verifyPrompt, setVerifyPrompt] = useState(false);
  const router=useRouter()
  
  const fetchData = async () => {
    setLoading(()=>true);
    const response = await axios.get("/api/answers", {
      params: { questionId: id },
    });
    if (response.data?.success) {
      setQuestion(() => response.data.question);
      setAnswers(() => response.data.answers);
    }
    setLoading(()=>false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAnswer = async () => {
    if (!session) {
      setShowPrompt(true);
      return;
    }
    if (!verified) {
      setVerifyPrompt(true);
      return;
    }
    setLoading(()=>true);
    if (newAnswer.trim()) {
      const response = await axios.post("/api/answers", {
        answer: newAnswer,
        questionId: id,
        authorId: session.userId,
      });
      await fetchData();
      setNewAnswer("");
      setShowAnswerForm(false);
    }
  };

  useEffect(() => {
    if (question?.$createdAt) {
      setLocalTime(
        formatDistanceToNow(question.$createdAt, { addSuffix: true })
      );
    }
  }, [question]);

  const handlePromptClose = () => {
    setShowPrompt(false);
  };

  const handleAskQuestion = ()=>{
      if(!session){
        setShowPrompt(true);
        return;
      }
      if(!verified){
        setVerifyPrompt(true);
        return;
      }
      router.push("/question/create");
  }

  return (
    <div className="relative min-h-screen w-full bg-black text-white">
      {showPrompt && <NotLoggedInPrompt onClose={handlePromptClose} />}
      {verifyPrompt && (
                <EmailVerificationPrompt onClose={() => setVerifyPrompt(false)} />
              )}
      {isloading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <LoaderOne />
        </div>
      )}
      <Particles quantity={100} ease={80} className="fixed inset-0 z-0" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-36 pb-20">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold leading-tight">{question.title}</h1>
          <ShimmerButton className="ml-auto dark:text-white" onClick={handleAskQuestion}>
            Ask Question
          </ShimmerButton>
        </div>
        {localTime && (
          <p className="text-sm mt-1 text-muted-foreground">
            Asked {localTime} — {question.author}
          </p>
        )}

        <div className="mt-6 flex gap-4">
          <VotePanel type={"question"} typeId={id} />
          <div className="flex-1">
            <MarkdownPreview
              className="rounded-xl p-4 bg-white/10"
              source={question.content}
            />
            {question?.attachmentId && (
              <AttachmentCarousel question={question} />
            )}
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {question.tags.map((tag, i) => (
                <Badge
                  key={i}
                  className="bg-white/10 px-2 py-1 text-white rounded-lg"
                >
                  <Link href={`/questions?tag=${tag}`}>#{tag}</Link>
                </Badge>
              ))}
            </div>
            <CommentBox type={"question"} typeId={id} />
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-semibold">Answers</h2>
        <div className="space-y-6 mt-4">
          {answers.map((ans) => (
            <div key={ans.$id} className="flex gap-4 bg-white/5 p-4 rounded-xl">
              <VotePanel type={"answer"} typeId={ans.$id} />
              <div className="flex-1">
                <MarkdownPreview
                  className="text-sm mb-2 leading-relaxed"
                  source={ans.content}
                />
                <p className="text-xs text-muted-foreground">— {ans.author}</p>
                <CommentBox type={"answer"} typeId={ans.$id} />
              </div>
            </div>
          ))}
        </div>

        {/* Add Answer Section */}
        {showAnswerForm && (
          <div className="mt-6 border border-border bg-white/5 dark:bg-black/30 backdrop-blur-sm rounded-xl p-4 animate-in slide-in-from-bottom-4">
            <h3 className="text-xl font-semibold mb-2">Your Answer</h3>

            <RTE
              value={newAnswer}
              onChange={(value) => setNewAnswer(value || "")}
            />

            <div className="mt-3 flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  if (!session) {
                    setShowPrompt(true);
                    return;
                  }
                  return setShowAnswerForm(false);
                }}
                className="text-muted-foreground hover:text-red-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddAnswer}
                className="bg-primary text-white"
              >
                Submit Answer
              </Button>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setShowAnswerForm(true);
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Write Answer
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;
