import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// GET - Fetch all data
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase not configured',
        usingLocalStorage: true 
      });
    }

    const [candidates, jobs, clients, interviews, tasks, deals, placements] = await Promise.all([
      supabase.from('candidates').select('*'),
      supabase.from('jobs').select('*'),
      supabase.from('clients').select('*'),
      supabase.from('interviews').select('*'),
      supabase.from('tasks').select('*'),
      supabase.from('deals').select('*'),
      supabase.from('placements').select('*')
    ]);

    return NextResponse.json({
      success: true,
      data: {
        candidates: candidates.data || [],
        jobs: jobs.data || [],
        clients: clients.data || [],
        interviews: interviews.data || [],
        tasks: tasks.data || [],
        deals: deals.data || [],
        placements: placements.data || []
      }
    });
  } catch (error) {
    console.error('Database fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch data',
      usingLocalStorage: true 
    }, { status: 500 });
  }
}

// POST - Sync data to Supabase
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase not configured',
        usingLocalStorage: true 
      });
    }

    const body = await request.json();
    const { table, data, action } = body;

    let result;

    switch (action) {
      case 'insert':
        result = await supabase.from(table).insert(data).select();
        break;
      case 'update':
        result = await supabase.from(table).update(data.updates).eq('id', data.id).select();
        break;
      case 'delete':
        result = await supabase.from(table).delete().eq('id', data.id);
        break;
      case 'upsert':
        result = await supabase.from(table).upsert(data).select();
        break;
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    if (result.error) {
      throw result.error;
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Database sync error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to sync data',
      usingLocalStorage: true 
    }, { status: 500 });
  }
}
