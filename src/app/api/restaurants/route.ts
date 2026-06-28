import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map snake_case DB columns → camelCase app types
    const mapped = (data ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      address: r.address,
      cuisine: r.cuisine,
      hygieneScore: r.hygiene_score,
      grade: r.grade,
      lastInspectionDate: r.last_inspection_date ?? 'Never',
      ownerName: r.owner_name,
      ownerEmail: r.owner_email,
      status: r.status,
      inspectionsCount: r.inspections_count,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error('[GET /api/restaurants]', err);
    return NextResponse.json({ error: 'Failed to load restaurants' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('restaurants')
      .insert({
        name: body.name,
        address: body.address,
        cuisine: body.cuisine,
        owner_name: body.ownerName,
        owner_email: body.ownerEmail,
        status: body.status ?? 'Pending Inspection',
        hygiene_score: 100,
        grade: 'A',
        inspections_count: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        id: data.id,
        name: data.name,
        address: data.address,
        cuisine: data.cuisine,
        hygieneScore: data.hygiene_score,
        grade: data.grade,
        lastInspectionDate: data.last_inspection_date ?? 'Never',
        ownerName: data.owner_name,
        ownerEmail: data.owner_email,
        status: data.status,
        inspectionsCount: data.inspections_count,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/restaurants]', err);
    return NextResponse.json({ error: 'Failed to create restaurant' }, { status: 400 });
  }
}
