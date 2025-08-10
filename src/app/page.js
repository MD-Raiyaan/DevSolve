"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { AnimatedList } from "@/components/magicui/animated-list";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { useEffect, useState } from "react";
import axios from "axios";
import QuestionOverview from "@/components/QuestionOverview";
import { LoaderOne } from "@/components/ui/loader";
import { useAuthStore } from "@/store/auth";


export const products = [
  {
    title: "VS Code",
    link: "https://code.visualstudio.com",
    thumbnail: "/assets/tech-logos/vscode.png",
  },
  {
    title: "GitHub",
    link: "https://github.com",
    thumbnail: "/assets/tech-logos/github.jpg",
  },
  {
    title: "Tailwind CSS",
    link: "https://tailwindcss.com",
    thumbnail: "/assets/tech-logos/tailwind.png",
  },
  {
    title: "React",
    link: "https://react.dev",
    thumbnail: "/assets/tech-logos/react.png",
  },
  {
    title: "Next.js",
    link: "https://nextjs.org",
    thumbnail: "/assets/tech-logos/nextjs.jpg",
  },
  {
    title: "Appwrite",
    link: "https://appwrite.io",
    thumbnail: "/assets/tech-logos/appwrite.jpg",
  },
  {
    title: "Vercel",
    link: "https://vercel.com",
    thumbnail: "/assets/tech-logos/vercel.png",
  },
  {
    title: "Figma",
    link: "https://figma.com",
    thumbnail: "/assets/tech-logos/figma.jpg",
  },
  {
    title: "ShadCN UI",
    link: "https://ui.shadcn.dev",
    thumbnail: "/assets/tech-logos/shadcn.png",
  },
  {
    title: "OpenAI",
    link: "https://platform.openai.com",
    thumbnail: "/assets/tech-logos/openai.png",
  },
  {
    title: "Lucide Icons",
    link: "https://lucide.dev",
    thumbnail: "/assets/tech-logos/lucide.png",
  },
  {
    title: "Zustand",
    link: "https://zustand-demo.pmnd.rs",
    thumbnail: "/assets/tech-logos/zustand.jpg",
  },
  {
    title: "Immer",
    link: "https://immerjs.github.io/immer/",
    thumbnail: "/assets/tech-logos/immer.png",
  },
  {
    title: "Framer Motion",
    link: "https://www.framer.com/motion/",
    thumbnail: "/assets/tech-logos/framer.jpg",
  },
];


const getData=async ()=>{
     const response=await axios.get('/api/home');
     return response.data;
}


export default  function Home() {
  const [questions,setQuestions]=useState([]);
  const [contributors,setContributors]=useState([]);
  const [isloading, setLoading] =useState(false);
  const {user}=useAuthStore();
  console.log("user : ",user);
  
   useEffect(() => {
     (async () => {
       setLoading(()=>true);
       const data = await getData();
       setQuestions(data.questions);
       setContributors(data.contributors);
       setLoading(()=>false);
     })();
   }, []);


  return (
    <div className="h-screen w-full">
      <HeroParallax products={products} />

      <div className="max-w-7xl mx-auto  px-4 py-6 lg:flex gap-8">
        {/* Latest Questions */}
        <div className="w-full lg:w-2/3 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Latest Questions
          </h2>

        {isloading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <LoaderOne />
                </div>
              )}
        <QuestionOverview questions={questions}/>
        </div>

        {/* Top Contributors */}
        <div className="w-full lg:w-1/3 mt-10 lg:mt-0">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Top Contributors
            </h2>
            <ul className="space-y-4">
              <AnimatedList>
                {contributors && contributors.map((c, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="font-medium">{c.name}</span>
                  </li>
                ))}
              </AnimatedList>
            </ul>
          </div>
        </div>
      </div>

      <NeonGradientCard className="max-w-sm items-center justify-center text-center m-auto h-fit mt-28 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]">
        <div className="px-6 md:px-12 py-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Welcome to <span className="text-primary">Devsolve</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ask questions, get answers, and grow your developer journey.
          </p>

          <Button className="mt-6 px-6 py-3 text-sm sm:text-base font-medium rounded-xl transition-all hover:scale-105">
            <Link
              href="/questions"
              className="w-full h-full flex justify-center items-center"
            >
              Ask a Question
            </Link>
          </Button>
        </div>
      </NeonGradientCard>
    </div>
  );
}
