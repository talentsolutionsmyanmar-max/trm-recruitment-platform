import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// AI Resume Parsing Endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, jobRequirements } = body;

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert resume parser and candidate matching AI for a recruitment agency in Myanmar. 
          Extract structured information from resumes and provide match scores.
          Always respond in JSON format with the following structure:
          {
            "candidate": {
              "name": "string",
              "email": "string",
              "phone": "string",
              "location": "string",
              "skills": ["skill1", "skill2"],
              "experience": number,
              "education": "string",
              "currentCompany": "string",
              "expectedSalary": number,
              "summary": "string"
            },
            "matchScore": number,
            "matchReasons": ["reason1"],
            "gaps": ["gap1"],
            "recommendations": ["rec1"]
          }`
        },
        {
          role: 'user',
          content: `Parse this resume and match against job requirements:
          RESUME: ${resumeText}
          JOB REQUIREMENTS: ${jobRequirements || 'General recruitment position'}
          Provide a comprehensive analysis.`
        }
      ],
      temperature: 0.3
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    let parsedResponse;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsedResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : { matchScore: 50 };
    } catch {
      parsedResponse = { matchScore: 50 };
    }

    return NextResponse.json({ success: true, data: parsedResponse });

  } catch (error) {
    console.error('Resume parsing error:', error);
    return NextResponse.json({ success: false, error: 'Failed to parse resume' }, { status: 500 });
  }
}
