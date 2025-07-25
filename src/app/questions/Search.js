"use client";
import React,{useEffect, useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function Search() {
    const router=useRouter();
    const pathName=usePathname();
    const searchParams=useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  
  useEffect(()=>{
     setSearchTerm(searchParams.get("search") || "");
  },[searchParams]);

  const handleClick= ()=>{
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("search", searchTerm);
      router.push(`${pathName}?${newSearchParams}`);
  }
   
  return (
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex w-full sm:max-w-md gap-2">
          <Input
            type="text"
            placeholder="Search questions..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <Button
            onClick={handleClick}
            className="whitespace-nowrap"
          >
            Search
          </Button>
        </div>
      </div>
  );
}

export default Search
