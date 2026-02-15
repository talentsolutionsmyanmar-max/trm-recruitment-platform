import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Generate offer letter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      candidateName, 
      jobTitle, 
      companyName, 
      salary, 
      startDate, 
      reportingTo,
      department,
      probationPeriod,
      benefits
    } = body;

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a professional HR document writer for Myanmar recruitment agencies.
          Generate formal offer letters in English suitable for Myanmar business context.
          Include all standard clauses: position, salary, start date, probation, benefits, acceptance deadline.
          Format as professional business letter.
          Respond in JSON: { "subject": string, "content": string, "keyTerms": [] }`
        },
        {
          role: 'user',
          content: `Generate an offer letter for:
          Candidate: ${candidateName}
          Position: ${jobTitle}
          Company: ${companyName}
          Monthly Salary: ${salary} MMK
          Start Date: ${startDate}
          Reporting To: ${reportingTo}
          Department: ${department}
          Probation Period: ${probationPeriod || '3 months'}
          Benefits: ${benefits || 'Standard company benefits'}
          
          Make it professional and comprehensive.`
        }
      ],
      temperature: 0.3
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    let offerLetter;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      offerLetter = jsonMatch ? JSON.parse(jsonMatch[0]) : { content: responseText };
    } catch {
      offerLetter = { content: responseText };
    }

    // Generate document ID for tracking
    const documentId = `OFF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    return NextResponse.json({
      success: true,
      documentId,
      offerLetter,
      generatedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days to accept
    });

  } catch (error) {
    console.error('Offer generation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate offer letter' }, { status: 500 });
  }
}
