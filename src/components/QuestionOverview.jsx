import React from "react";
import { ShineBorder } from "@/components/magicui/shine-border.jsx";
import Link from "next/link";

function QuestionOverview({ questions }) {
  return (
    <>
      {questions &&
        questions.map((q) => (
          <div
            key={q.id}
            className="relative overflow-hidden border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-900"
          >
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <div className="flex gap-4 items-start">
              {/* Votes and Answers Column */}
              <div className="flex flex-col items-center justify-center w-16 text-sm text-gray-600 dark:text-gray-300">
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {q.votes}
                </div>
                <div className="text-xs">votes</div>
                <div className="mt-3 text-lg font-semibold text-green-600 dark:text-green-400">
                  {q.answers}
                </div>
                <div className="text-xs">answers</div>
              </div>

              {/* Main Question Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer">
                  <Link href={`questions/${q.id}`}>{q.title}</Link>
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {q.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs"
                    >
                      <Link href={`/questions?tag=${tag}`}>{tag}</Link>
                    </span>
                  ))}
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Asked by <span className="font-medium">{q.user}</span> •{" "}
                  {q.askedAt}
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}

export default QuestionOverview;
