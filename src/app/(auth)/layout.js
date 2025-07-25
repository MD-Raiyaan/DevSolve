"use client";
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation';
import React from 'react'

function Layout({children}) {
   const {session}=useAuthStore();
   const router = useRouter();

   React.useEffect(()=>{
       if(session){
         router.push('/');
       }
   },[session,router]);
   
   if(session)return null;

  return (
    <div className="h-screen w-full flex justify-center items-center">
      {children}
    </div>
  );
}

export default Layout
