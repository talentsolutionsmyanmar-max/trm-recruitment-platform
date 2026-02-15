import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// AI Email Generation Endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, context } = body;

    const zai = await ZAI.create();

    const typePrompts: Record<string, string> = {
      interview_invitation: `Generate a professional interview invitation email for a candidate.
        Candidate: ${context.candidateName}
        Position: ${context.jobTitle}
        Company: ${context.companyName}
        Interview Date: ${context.interviewDate}
        Interview Time: ${context.interviewTime}
        Location/Link: ${context.location}
        Make it warm and professional, Myanmar business context.`,
        
      application_received: `Generate an application acknowledgment email.
        Candidate: ${context.candidateName}
        Position: ${context.jobTitle}
        Company: ${context.companyName}
        Thank them and explain next steps.`,
        
      offer_letter: `Generate a professional job offer email.
        Candidate: ${context.candidateName}
        Position: ${context.jobTitle}
        Company: ${context.companyName}
        Salary: ${context.salary} MMK
        Start Date: ${context.startDate}
        Include key benefits and response deadline.`,
        
      rejection: `Generate a respectful rejection email.
        Candidate: ${context.candidateName}
        Position: ${context.jobTitle}
        Keep it professional and encouraging for future opportunities.`,
        
      follow_up: `Generate a follow-up email after interview.
        Candidate: ${context.candidateName}
        Position: ${context.jobTitle}
        Interview Date: ${context.interviewDate}
        Status: ${context.status}
        Keep professional and informative.`
    };

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a professional HR email writer for a Myanmar recruitment agency.
          Write clear, professional emails suitable for Myanmar business culture.
          Always respond in JSON format:
          {
            "subject": "Email subject line",
            "body": "Full email body with proper formatting",
            "keyPoints": ["point1", "point2"]
          }`
        },
        {
          role: 'user',
          content: typePrompts[type] || 'Generate a professional recruitment email.'
        }
      ],
      temperature: 0.5
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    let emailContent;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      emailContent = jsonMatch ? JSON.parse(jsonMatch[0]) : { subject: 'Email', body: responseText };
    } catch {
      emailContent = { subject: 'Email', body: responseText };
    }

    return NextResponse.json({ success: true, data: emailContent });

  } catch (error) {
    console.error('Email generation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate email' }, { status: 500 });
  }
}
