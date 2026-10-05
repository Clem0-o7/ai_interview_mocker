"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { generateContent } from '@/utils/GeminiAIModal';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '@/utils/schema';
import {db} from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';


function AddNewInterview() {
  const [openDailog, setOpenDailog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    console.log(jobPosition, jobDesc, jobExperience);

    const InputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Based on the Job Position, Job Description & Years of experience, generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION} interview questions along with answers in JSON format. Please provide the response in the following JSON structure:
    {
      "questions": [
        {
          "question": "question text here",
          "answer": "answer text here"
        }
      ]
    }
    Only return valid JSON, no additional text or formatting.`;

    try {
      const result = await generateContent(InputPrompt);
      console.log("Raw AI Response:", result);
      
      // Clean up the response to extract JSON
      let cleanedResponse = result.trim();
      
      // Remove markdown code blocks if present
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '');
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
      
      // Remove any text before the first { and after the last }
      const firstBrace = cleanedResponse.indexOf('{');
      const lastBrace = cleanedResponse.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedResponse = cleanedResponse.substring(firstBrace, lastBrace + 1);
      }
      
      console.log("Cleaned Response:", cleanedResponse);
      
      // Validate JSON
      const parsedJson = JSON.parse(cleanedResponse);
      console.log("Parsed JSON:", parsedJson);
      
      setJsonResponse(cleanedResponse);
      
      if (cleanedResponse) {
        const resp = await db.insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: cleanedResponse,
            jobPosition: jobPosition,
            jobDesc: jobDesc,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-yyyy')
          }).returning({ mockId: MockInterview.mockId });

        console.log("Inserted ID:", resp);
        if (resp) {
          setOpenDailog(false);
          router.push('/dashboard/interview/' + resp[0]?.mockId);
        }
      } else {
        console.log("ERROR: No valid JSON response");
        alert("Failed to generate interview questions. Please try again.");
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      alert("An error occurred while generating interview questions. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer
        transition-all'
        onClick={() => setOpenDailog(true)}
      >
        <h2 className='text-lg text-center'>+ Add New</h2>
      </div>

      <Dialog open={openDailog}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tell us more about your job interviewing</DialogTitle>
            <DialogDescription>
              Add details about your job position/role, job description and years of experience
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div>
              <div className='mt-7 my-3'>
                    <label>Job Role/Job Position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div className='my-3'>
                    <label>Job Description/ Tech Stack (In short)</label>
                    <Textarea
                      placeholder="Ex. React, Angular, NodeJs, MySql etc"
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>
                  <div className='my-3'>
                    <label>Years of experience</label>
                    <Input
                      placeholder="Ex.5"
                      type="number"
                      max="100"
                      required
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                </div>
                <div className='flex gap-5 justify-end'>
                  <Button type="button" variant="ghost" onClick={() => setOpenDailog(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading}>
                    {loading ?
                      <>
                        <LoaderCircle className='animate-spin' /> Generating from AI
                      </> : 'Start Interview'}
                  </Button>
                </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
