import { NextRequest, NextResponse } from 'next/server';

// Bulk import candidates from CSV/Excel data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, mapping, assignedTo } = body;

    // Validate required fields
    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No data provided' 
      }, { status: 400 });
    }

    // Process each row
    const results = {
      success: [] as object[],
      failed: [] as object[],
      duplicates: [] as object[]
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // Map CSV columns to candidate fields
        const candidate = {
          id: `can-import-${Date.now()}-${i}`,
          name: row[mapping.name] || row['name'] || row['Name'] || '',
          email: row[mapping.email] || row['email'] || row['Email'] || row['Email Address'] || '',
          phone: row[mapping.phone] || row['phone'] || row['Phone'] || row['Mobile'] || '',
          location: row[mapping.location] || row['location'] || row['City'] || 'Yangon',
          skills: (row[mapping.skills] || row['skills'] || row['Skills'] || '').split(',').map((s: string) => s.trim()).filter(Boolean),
          experience: parseInt(row[mapping.experience] || row['experience'] || row['Experience'] || '0') || 0,
          education: row[mapping.education] || row['education'] || row['Education'] || '',
          currentCompany: row[mapping.currentCompany] || row['company'] || row['Current Company'] || '',
          expectedSalary: parseInt(row[mapping.expectedSalary] || row['salary'] || row['Expected Salary'] || '0') || 0,
          status: 'new',
          source: 'Bulk Import',
          appliedJobs: [],
          createdAt: new Date().toISOString(),
          assignedTo: assignedTo || 'unassigned',
          notes: row[mapping.notes] || row['notes'] || row['Notes'] || `Imported on ${new Date().toLocaleDateString()}`,
          tags: ['Bulk Import'],
          matchScore: null
        };

        // Validate required fields
        if (!candidate.name || !candidate.email) {
          results.failed.push({
            row: i + 1,
            data: row,
            error: 'Missing required fields (name, email)'
          });
          continue;
        }

        // Check for duplicates (by email)
        // In production, would check against database
        results.success.push(candidate);
        
      } catch (error) {
        results.failed.push({
          row: i + 1,
          data: row,
          error: 'Processing error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: data.length,
        imported: results.success.length,
        failed: results.failed.length,
        duplicates: results.duplicates.length
      },
      results,
      message: `Successfully imported ${results.success.length} of ${data.length} candidates`
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ success: false, error: 'Import failed' }, { status: 500 });
  }
}

// Get import template
export async function GET() {
  const template = {
    columns: [
      { name: 'name', required: true, description: 'Candidate full name' },
      { name: 'email', required: true, description: 'Email address' },
      { name: 'phone', required: false, description: 'Phone number' },
      { name: 'location', required: false, description: 'City/Location' },
      { name: 'skills', required: false, description: 'Comma-separated skills' },
      { name: 'experience', required: false, description: 'Years of experience' },
      { name: 'education', required: false, description: 'Highest education' },
      { name: 'currentCompany', required: false, description: 'Current employer' },
      { name: 'expectedSalary', required: false, description: 'Expected salary in MMK' },
      { name: 'notes', required: false, description: 'Additional notes' }
    ],
    sampleCsv: `name,email,phone,location,skills,experience,education,currentCompany,expectedSalary,notes
Mg Aung,mgaung@gmail.com,+95 9 111 222 333,Yangon,"Machine Operation, Quality Control",5,High School,ABC Factory,300000,Available immediately
Ma Hla Hla,hlahla@gmail.com,+95 9 222 333 444,Mandalay,"Sewing, Quality Control",3,Middle School,XYZ Garment,250000,Experienced in garment`
  };

  return NextResponse.json({ success: true, template });
}
