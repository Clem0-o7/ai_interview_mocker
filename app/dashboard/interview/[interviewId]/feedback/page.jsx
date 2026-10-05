"use client"
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.jsx"
import { ChevronsUpDown, Sparkles, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'


function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [overallRating, setOverallRating] = useState(0);
  const router=useRouter();
  useEffect(() => {
    GetFeedback();
  }, [])

  const GetFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    console.log(result);
    setFeedbackList(result);
    
    if (result.length > 0) {
      const totalRating = result.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0);
      setOverallRating((totalRating / result.length).toFixed(1));
    }
  }

  return (
    <div className='p-10 max-w-4xl mx-auto'>
      {feedbackList?.length == 0 ? (
        <div className='flex flex-col items-center justify-center mt-20 p-10 bg-secondary rounded-xl border'>
          <h2 className='font-bold text-2xl text-gray-500'>No Interview Feedback Record Found</h2>
          <p className='text-muted-foreground mt-2'>It looks like you haven't answered any questions yet.</p>
          <Button className='mt-5 bg-primary text-white' onClick={() => router.replace('/dashboard')}>
            <Home className="mr-2 h-4 w-4" /> Go Home
          </Button>
        </div>
      ) : (
        <>
          <div className='flex flex-col gap-3 mb-10'>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full w-fit">
              <Sparkles className="h-5 w-5" />
              <h2 className='text-sm font-bold uppercase tracking-wider'>Interview Complete</h2>
            </div>
            
            <h1 className='text-4xl font-extrabold text-green-500 tracking-tight'>Congratulations!</h1>
            <h2 className='font-semibold text-2xl text-foreground'>Here is your detailed interview feedback.</h2>
            
            <div className='mt-4 p-5 bg-card border rounded-xl shadow-sm max-w-sm'>
              <h2 className='text-muted-foreground text-sm font-medium'>Overall Session Rating</h2>
              <p className={`text-4xl font-black mt-1 ${overallRating >= 7 ? 'text-green-500' : overallRating >= 4 ? 'text-yellow-500' : 'text-red-500'}`}>
                {overallRating}<span className='text-2xl text-muted-foreground'>/10</span>
              </p>
            </div>

            <p className='text-sm text-muted-foreground mt-2'>
              Below are the questions from your session, along with the correct answers, your responses, and AI-generated suggestions for improvement.
            </p>
          </div>
          
          <div className="space-y-4">
            {feedbackList.map((item, index) => (
              <Collapsible key={index} className='border rounded-xl shadow-sm bg-card overflow-hidden'>
                <CollapsibleTrigger className='p-5 hover:bg-secondary/50 transition-colors flex justify-between items-center text-left gap-4 w-full'>
                  <span className="font-semibold text-foreground text-lg flex-1">
                    <span className="text-muted-foreground mr-2">{index + 1}.</span> 
                    {item.question}
                  </span>
                  <ChevronsUpDown className='h-5 w-5 text-muted-foreground shrink-0' />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-5 border-t bg-secondary/20">
                  <div className='flex flex-col gap-4'>
                    <div className='flex items-center gap-2'>
                      <span className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Rating:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.rating >= 7 ? 'bg-green-100 text-green-700' : item.rating >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {item.rating} / 10
                      </span>
                    </div>

                    <div className='p-4 border rounded-lg bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'>
                      <h3 className='font-bold text-red-800 dark:text-red-400 mb-1 text-sm'>Your Answer:</h3>
                      <p className='text-red-900 dark:text-red-300 text-sm leading-relaxed'>{item.userAns}</p>
                    </div>

                    <div className='p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30'>
                      <h3 className='font-bold text-green-800 dark:text-green-400 mb-1 text-sm'>Correct Answer:</h3>
                      <p className='text-green-900 dark:text-green-300 text-sm leading-relaxed'>{item.correctAns}</p>
                    </div>

                    <div className='p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30'>
                      <h3 className='font-bold text-blue-800 dark:text-blue-400 mb-1 text-sm'>AI Feedback:</h3>
                      <p className='text-blue-900 dark:text-blue-300 text-sm leading-relaxed'>{item.feedback}</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
          
          <Button className='mt-10 bg-primary text-white w-full md:w-auto md:px-8 h-12 text-lg' onClick={() => router.replace('/dashboard')}>
            <Home className="mr-2 h-5 w-5" /> Return to Dashboard
          </Button>
        </>
      )}
    </div>
  )
}

export default Feedback
