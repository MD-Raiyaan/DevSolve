"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pencil } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuthStore } from "@/store/auth";
import { LoaderOne } from "@/components/ui/loader";
import ErrorMessage from "@/components/ErrorMessage";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import Link from "next/link";

const MarkdownViewer = ({ content }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = content?.length > 300;
  const preview = isLong && !expanded ? content.slice(0, 300) + "..." : content;
  const theme=useTheme();

  return (
    <div className="w-full">
      <div data-color-mode={theme === "dark" ? "dark" : "light"}>
        <MDEditor.Markdown
          source={preview}
          className="bg-background px-2 py-1 rounded-md text-sm"
        />
      </div>
      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 text-blue-600 text-xs hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

const AvatarWithEdit = ({ src, name}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative w-24 h-24">
      {src ? (
        <img src={src} className="w-24 h-24 rounded-full object-cover shadow" />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-bold text-xl flex items-center justify-center shadow-inner">
          {initials}
        </div>
      )}
    </div>
  );
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("questions");
  const [User, setUser] = useState({
    avatarUrl: "",
    name: "",
    email: "",
    reputation: 0,
    votes: 0,
    questionsAsked: [],
    answersGiven: [],
  });

  const [isloading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { session } = useAuthStore();

  const fetchData = async () => {
    if (!session) return;
    try {
      setLoading(true);
      const response = await axios.post("/api/profile", {
        userId: session.userId,
      });

      if (response.data.success === false) {
        setError(response.data.error || "Something went wrong.");
      } else {
        setUser(response.data.data);
      }
    } catch (err) {
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-8 space-y-6 mt-15"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isloading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <LoaderOne />
        </div>
      )}
      {error && <ErrorMessage message={error} />}

      {/* Profile Info */}
      <Card className="p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg">
        <AvatarWithEdit
          src={User.avatarUrl}
          name={User.name}
        />
        <div className="flex-1 text-center md:text-left space-y-1">
          <h2 className="text-2xl font-bold">{User.name}</h2>
          <p className="text-sm text-gray-500">{User.email}</p>
          <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
            <Badge>Reputation: {User.reputation}</Badge>
            <Badge variant="secondary">Votes: {User.votes}</Badge>
            <Badge variant="outline">
              Questions: {User.questionsAsked.length}
            </Badge>
            <Badge variant="outline">Answers: {User.answersGiven.length}</Badge>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mx-auto w-max">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="answers">Answers</TabsTrigger>
        </TabsList>

        {/* Questions */}
        <TabsContent value="questions">
          {User.questionsAsked.length === 0 ? (
            <p className="text-gray-500 mt-4 text-center">No questions yet.</p>
          ) : (
            <div className="mt-4 space-y-6">
              {User.questionsAsked.map((q) => (
                <Card
                  key={q.$id}
                  className="bg-background/70 backdrop-blur-md border border-border rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="text-lg font-semibold text-foreground">
                        <Link href={`/questions/${q.$id}`}>{q.title}</Link>
                      </div>
                      <Link href={`/questions/${q.$id}/edit`}>
                        <Button size="icon" variant="ghost">
                          <Pencil className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </Button>
                      </Link>
                    </div>
                    <MarkdownViewer content={q.content} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Answers */}
        <TabsContent value="answers">
          {User.answersGiven.length === 0 ? (
            <p className="text-gray-500 mt-4 text-center">No answers yet.</p>
          ) : (
            <div className="mt-4 space-y-6">
              {User.answersGiven.map((a) => (
                <Card
                  key={a.$id}
                  className="bg-background/70 backdrop-blur-md border border-border rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="text-lg font-semibold text-foreground">
                        {a.title}
                      </div>
                      <Link href={`/answers/${a.$id}/edit`}>
                        <Button size="icon" variant="ghost">
                          <Pencil className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </Button>
                      </Link>
                    </div>
                    <MarkdownViewer content={a.content} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProfilePage;
