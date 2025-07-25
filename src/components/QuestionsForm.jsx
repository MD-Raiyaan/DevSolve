"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileDropzone from "./ui/DragAndDrop";
import { useAuthStore } from "@/store/auth";
import { LoaderOne } from "./ui/loader";
import ErrorMessage from "./ErrorMessage";
import Link from "next/link";
import RTE from "./RTE";
import { ID } from "node-appwrite";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { storage } from "@/models/client/config";
import { questionAttachmentBucket } from "@/models/name";

export default function QuestionForm({ mode = "create", initialData = null }) {
  const [previewUrl, setPreviewUrl] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [attachment, setAttachment] = useState([]);
  const { session, user } = useAuthStore();
  const [isloading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setTags(initialData.tags || []);
      console.log(initialData);
      if (initialData.attachments?.length > 0) {
        // Set preview files for FileDropzone
        const previews = initialData.attachments.map((file) => ({
          name: file.name,
          type: file.mimeType,
          size: file.sizeOriginal,
          url: file.preview, // for rendering
        }));
        setPreviewUrl(previews);
      }
    }
  }, [initialData, mode]);

  if (!session) return null;

  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim() !== "") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,$/, "");
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const isError = () => {
    return error.length > 0;
  };

  const handleFileUpload = (files) => {
    setAttachment(() => files);
    console.log("files ",files);
  };

  const validate = () => {
    // returns true if invalid
    if (title.trim() === "" || content.trim() === "" || tags.length === 0) {
      setError("Please Please fill out all fields");
      return true;
    }
    return false;
  };

  const create = async () => {
    if (validate()) {
      return;
    }
    const attachementIds = await Promise.all(
      attachment.map(async (file) => {
        const attachementId = ID.unique();
        await storage.createFile(questionAttachmentBucket, attachementId, file);
        return attachementId;
      })
    );
    const response = await axios.post("/api/QuestionCreate", {
      title,
      content,
      attachementIds,
      tags,
      user,
    });

    if (!response.data?.success) {
      setError(response.data?.error);
    }
  };
  const Update = async () => {
    if (validate()) {
      return;
    }
    console.log("attachment : ",attachment);
    const attachementIds = await Promise.all(
      attachment.map(async (file) => {
        const attachementId = ID.unique();
        await storage.createFile(questionAttachmentBucket, attachementId, file);
        return attachementId;
      })
    );
    const response = await axios.post("/api/QuestionUpdate", {
      title,
      content,
      tags,
      attachementIds,
      user,
      questionId: initialData?.questionId,
    });
    

    if (!response.data?.success) {
      setError(response.data?.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(() => "");
    if (mode == "create") {
      await create();
    } else {
      await Update();
    }
    setLoading(false);

    if (!isError()) {
      toast.success(`question ${mode}d successfully !!!`);
      router.push("/questions");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl pt-20 mx-auto space-y-8 px-4 py-6 sm:px-6 lg:px-8"
    >
      {isloading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <LoaderOne />
        </div>
      )}
      {isError() && <ErrorMessage message={error} />}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {mode === "edit" ? "Edit Question" : "Ask a Question"}
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        This information will be displayed publicly so be careful what you
        share.
      </p>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Write a short title for your question"
          className="mt-2"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          Content
        </label>
        <RTE value={content} onChange={(value) => setContent(value || "")} />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags
        </label>
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Type a tag and press Enter or Comma"
          className="mt-2"
        />
        <p className="text-sm text-gray-400 mt-1">Add tags one by one</p>

        {/* Tag Preview */}
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-indigo-500 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block mb-6 text-sm font-medium text-gray-700 dark:text-gray-300">
          Upload Image (optional)
        </label>
        <FileDropzone
          onFilesUpload={handleFileUpload}
          previewFiles={previewUrl}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          <Link href={(mode=="create")?"/questions":"/profile"}>Cancel</Link>
        </Button>
        <Button
          type="submit"
          className="bg-indigo-600 text-white hover:bg-indigo-500"
        >
          {mode === "edit" ? "Update Question" : "Post Question"}
        </Button>
      </div>
    </form>
  );
}
