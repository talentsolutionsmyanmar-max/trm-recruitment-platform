import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// AI Candidate Matching Endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidate, job } = body;

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an AI recruitment matching specialist for Myanmar job market.
          Analyze candidate-job fit and provide detailed scoring.
          Respond in JSON format:
          {
            "overallScore": number (0-100),
            "skillMatch": { "score": number, "matched": [], "missing": [] },
            "experienceFit": { "score": number, "analysis": "string" },
            "salaryFit": { "score": number, "analysis": "string" },
            "locationFit": { "score": number, "analysis": "string" },
            "recommendation": "strongly_recommend" | "recommend" | "consider" | "not_recommended",
            "interviewQuestions": ["q1", "q2", "q3"],
            "strengths": ["s1", "s2"],
            "concerns": ["c1"]
          }`
        },
        {
          role: 'user',
          content: `Match this candidate to the job:
          
          CANDIDATE:
          - Name: ${candidate.name}
          - Skills: ${candidate.skills?.join(', ')}
          - Experience: ${candidate.experience} years
          - Education: ${candidate.education}
          - Expected Salary: ${candidate.expectedSalary} MMK
          - Location: ${candidate.location}
          
          JOB:
          - Title: ${job.title}
          - Required Skills: ${job.skills?.join(', ')}
          - Experience Required: ${job.experienceRequired} years
          - Education Required: ${job.educationRequired}
          - Salary Range: ${job.salaryMin} - ${job.salaryMax} MMK
          - Location: ${job.location}
          
          Provide a comprehensive match analysis.`
        }
      ],
      temperature: 0.3
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    let matchResult;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      matchResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { overallScore: 50 };
    } catch {
      matchResult = { overallScore: 50 };
    }

    return NextResponse.json({ success: true, data: matchResult });

  } catch (error) {
    console.error('Matching error:', error);
    return NextResponse.json({ success: false, error: 'Failed to match candidate' }, { status: 500 });
  }
}
