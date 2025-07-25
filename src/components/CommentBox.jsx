// CommentBox.js
"use client";

import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "@/store/auth";
import { toast } from "react-hot-toast";
import NotLoggedInPrompt from "@/components/NotLoggedIn";
import EmailVerificationPrompt from "./EmailVerificationPrompt";

const CommentBox = ({ type, typeId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const { session,verified } = useAuthStore();
  const [showPrompt, setShowPrompt] = useState(false);
  const [verifyPrompt, setVerifyPrompt] = useState(false);

  const fetchData = async () => {
    const response = await axios.get("/api/comments", {
      params: { type, typeId },
    });
    if (response.data?.success) {
      setComments(() => response.data.data);
    }
  };

  const onAdd = async (content) => {
    const response = await axios.post("/api/comments", {
      type,
      typeId,
      content,
      authorId: session.userId,
    });
    if (response.data?.success) {
      await fetchData();
      toast.success("comment submitted successfully !!!");
    } else {
      toast.error("comment submission failed !!!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePromptClose = () => {
    setShowPrompt(false);
  };

  const onDelete = async (commentId) => {
    if (!session) {
      setShowPrompt(true);
      return;
    }
    if (!verified) {
      setVerifyPrompt(true);
      return;
    }
    const response = await axios.delete("/api/comments", {
      params: { commentId },
    });
    if (response.data?.success) {
      await fetchData();
      toast.success("comment deleted successfully !!!");
    } else {
      toast.error("comment deletion failed !!!");
    }
  };

  const handleAdd = () => {
    if (!session) {
      setShowPrompt(true);
      return;
    }
    if (!verified) {
      setVerifyPrompt(true);
      return;
    }
    if (newComment.trim()) {
      onAdd(newComment.trim());
      setNewComment("");
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {showPrompt && <NotLoggedInPrompt onClose={handlePromptClose} />}
      {verifyPrompt && (
        <EmailVerificationPrompt onClose={() => setVerifyPrompt(false)} />
      )}
      <h3 className="text-sm font-medium text-muted-foreground">Comments</h3>

      <div className="space-y-2">
        {comments.length > 0 ? (
          comments.map((comment, i) => (
            <div
              key={i}
              className="bg-white/10 border border-white/20 hover:border-white/30 p-2 rounded-lg flex items-start justify-between gap-2 text-sm text-white"
            >
              <span className="flex-1 leading-relaxed">
                <span className="font-semibold mr-1">{comment.author}:</span>
                {comment.content}
              </span>
              {session && comment.authorId === session.userId && (
                <button
                  onClick={() => onDelete(comment.$id)}
                  className="text-red-400 hover:text-red-600"
                  aria-label="Delete comment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        )}
      </div>

      <div className="flex items-start gap-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="bg-white/10 text-white placeholder:text-gray-300 border border-white/20 resize-none"
        />
        <Button
          onClick={handleAdd}
          className="bg-white/20 text-white hover:bg-white/30 mt-1"
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default CommentBox;
