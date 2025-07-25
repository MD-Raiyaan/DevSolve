// VotePanel.js
"use client";

import React, { useEffect, useState } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import axios from "axios";
import NotLoggedInPrompt from "@/components/NotLoggedIn";
import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { Query } from "appwrite";
import { LoaderOne } from "./ui/loader";
import EmailVerificationPrompt from "./EmailVerificationPrompt";

const VotePanel = ({ type, typeId }) => {
  const { session, verified } = useAuthStore();
  const [votes, setVotes] = useState(0);
  const [clickupvote, setClickupvote] = useState(false);
  const [clickdownvote, setClickdownvote] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isloading, setLoading] = React.useState(false);
  const [verifyPrompt, setVerifyPrompt] = useState(false);

  const fetchData = async (voteStatus) => {
    setLoading(true);
    const response = await axios.post("/api/voting", {
      type,
      typeId,
      voteStatus,
      votedById: session.userId,
    });

    if (response.data?.success) {
      setVotes(response.data?.voteResult);
    }
    setLoading(false);
  };

  const upvoteClick = () => {
    if (!session) {
      setShowPrompt(true);
      return;
    }
    if (!verified) {
      setVerifyPrompt(true);
      return;
    }
    if (clickdownvote) setClickdownvote(() => false);
    setClickupvote((prev) => !prev);
    fetchData("upvoted");
  };

  const downvoteClick = () => {
    if (!session) {
      setShowPrompt(true);
      return;
    }
    if (!verified) {
      setVerifyPrompt(true);
      return;
    }
    if (clickupvote) setClickupvote(() => false);
    setClickdownvote((prev) => !prev);
    fetchData("downvoted");
  };

  const voteFetch = async () => {
    setLoading(true);
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
    setVotes(upvotes.total - downvotes.total);
    setLoading(false);
  };

  useEffect(() => {
    voteFetch();
  }, []);

  const handlePromptClose = () => {
    setShowPrompt(false);
  };

  return (
    <div className="flex flex-col items-center text-gray-400 dark:text-gray-200">
      {isloading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <LoaderOne />
        </div>
      )}
      {showPrompt && <NotLoggedInPrompt onClose={handlePromptClose} />}
      {verifyPrompt && (
        <EmailVerificationPrompt onClose={() => setVerifyPrompt(false)} />
      )}
      <button
        onClick={() => upvoteClick()}
        className={`hover:text-green-500 transition ${
          clickupvote ? "text-green-400" : ""
        }`}
        aria-label="Upvote"
      >
        <ArrowBigUp className="w-6 h-6" />
      </button>
      <span className="font-medium py-1 text-basetext-white">{votes}</span>
      <button
        onClick={() => downvoteClick()}
        className={`hover:text-red-500 transition ${
          clickdownvote ? "text-red-400" : ""
        }`}
        aria-label="Downvote"
      >
        <ArrowBigDown className="w-6 h-6" />
      </button>
    </div>
  );
};

export default VotePanel;
