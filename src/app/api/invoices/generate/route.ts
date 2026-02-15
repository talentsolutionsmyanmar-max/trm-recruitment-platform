import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Generate professional invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      invoiceNumber,
      clientName, 
      clientAddress,
      clientEmail,
      placements,
      dueDate,
      companyName,
      companyAddress,
      bankDetails
    } = body;

    // Calculate totals
    const subtotal = placements.reduce((sum: number, p: { fee: number }) => sum + p.fee, 0);
    const tax = 0; // No tax for recruitment services in Myanmar
    const total = subtotal + tax;

    const invoice = {
      invoiceNumber: invoiceNumber || `INV-${Date.now()}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      
      // Company info
      from: {
        name: companyName || 'Talent Resources Myanmar',
        address: companyAddress || 'Yangon, Myanmar',
        email: 'billing@trm.com.mm',
        phone: '+95 9 123 456 789'
      },
      
      // Client info
      to: {
        name: clientName,
        address: clientAddress,
        email: clientEmail
      },
      
      // Line items
      items: placements.map((p: { candidateName: string; position: string; salary: number; feePercentage: number; fee: number }, idx: number) => ({
        id: idx + 1,
        description: `Placement Fee - ${p.candidateName} (${p.position})`,
        salary: p.salary,
        feePercentage: p.feePercentage,
        amount: p.fee
      })),
      
      // Totals
      subtotal,
      tax,
      total,
      
      // Payment info
      paymentTerms: 'Net 30',
      bankDetails: bankDetails || {
        bank: 'KBZ Bank',
        accountName: 'Talent Resources Myanmar Co., Ltd.',
        accountNumber: '1234 5678 9012 3456'
      },
      
      // Status
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    // Generate invoice document using AI
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Generate a professional invoice document in text format.
          Include all standard invoice elements: header, invoice number, dates, company details, client details, line items, totals, payment terms, bank details.
          Format clearly with proper spacing.`
        },
        {
          role: 'user',
          content: `Generate invoice with these details:
          ${JSON.stringify(invoice, null, 2)}`
        }
      ],
      temperature: 0.2
    });

    const documentContent = completion.choices[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      invoice,
      documentContent,
      pdfUrl: `/api/invoices/pdf/${invoice.invoiceNumber}`, // Would generate PDF in production
      message: 'Invoice generated successfully'
    });

  } catch (error) {
    console.error('Invoice generation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate invoice' }, { status: 500 });
  }
}

// Get invoice templates
export async function GET() {
  const templates = [
    { id: 'standard', name: 'Standard Invoice', description: 'Default invoice template' },
    { id: 'detailed', name: 'Detailed Invoice', description: 'Includes salary breakdown' },
    { id: 'simple', name: 'Simple Invoice', description: 'Minimal invoice format' }
  ];

  return NextResponse.json({ success: true, templates });
}
