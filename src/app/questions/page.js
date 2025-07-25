"use client";
import React, { useEffect, useState } from "react";
import QuestionOverview from "@/components/QuestionOverview";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import Search from "./Search";
import { ListOrdered } from "lucide-react";
import { CustomPagination } from "@/components/CustomPagination";
import { useSearchParams } from "next/navigation";
import { Query } from "node-appwrite";
import axios from "axios";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import NotLoggedInPrompt from "@/components/NotLoggedIn";
import { LoaderOne } from "@/components/ui/loader";
import EmailVerificationPrompt from "@/components/EmailVerificationPrompt";

const QUESTIONS_PER_PAGE = 3;

function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const searchParams = useSearchParams();
  const { session, verified } = useAuthStore();
  const router = useRouter();
  const [showPrompt, setShowPrompt] = useState(false);
  const [verifyPrompt, setVerifyPrompt] = useState(false);
  const [totalQuestions, settotalQuestions] = useState(0);
  const [isloading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const currentPage = parseInt(searchParams.get("page")) || 1;
    const searchContent = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";

    const queries = [
      Query.orderDesc("$createdAt"),
      Query.offset((currentPage - 1) * QUESTIONS_PER_PAGE),
      Query.limit(QUESTIONS_PER_PAGE),
    ];

    if (searchContent !== "") {
      queries.push(
        Query.or([
          Query.search("title", searchContent),
          Query.search("content", searchContent),
        ])
      );
    }

    if (tag !== "") {
      queries.push(Query.search("tags", tag));
    }

    const response = await axios.post("/api/questions", { queries });

    setQuestions(response.data.questions);
    settotalQuestions(response.data.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const addQuestionHandle = () => {
    if (!session) {
      setShowPrompt(true);
      return;
    }
    if(!verified){
      setVerifyPrompt(true);
      return;
    }
    router.push("/questions/create");
  };

  const handlePromptClose = () => {
    setShowPrompt(false);
  };

  return (
    <div className="pt-20 min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-3xl font-bold text-gray-800 dark:text-white">
            All Questions
            <div className="flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <ListOrdered className="h-4 w-4" />
              {totalQuestions}
            </div>
          </div>
          <RainbowButton
            size="sm"
            className="font-bold w-full md:w-auto"
            onClick={addQuestionHandle}
          >
            Ask a question
          </RainbowButton>
        </div>
        {verifyPrompt && (
          <EmailVerificationPrompt onClose={() => setVerifyPrompt(false)} />
        )}
        {showPrompt && <NotLoggedInPrompt onClose={handlePromptClose} />}

        {/* Search Bar */}
        <Search />

        {/* Question List */}
        <div className="w-full space-y-6">
          {isloading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <LoaderOne />
            </div>
          )}
          <QuestionOverview questions={questions} />
        </div>

        {/* Pagination */}
        <CustomPagination
          totalItems={totalQuestions}
          itemsPerPage={QUESTIONS_PER_PAGE}
        />
      </div>
    </div>
  );
}

export default QuestionPage;
