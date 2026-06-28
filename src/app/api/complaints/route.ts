import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map snake_case → camelCase
    const mapped = (data ?? []).map((c) => ({
      id: c.id,
      restaurantId: c.restaurant_id,
      restaurantName: c.restaurant_name,
      customerName: c.customer_name,
      customerEmail: c.customer_email,
      incidentDate: c.incident_date,
      description: c.description,
      category: c.category,
      status: c.status,
      createdAt: c.created_at,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error('[GET /api/complaints]', err);
    return NextResponse.json({ error: 'Failed to load complaints' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Look up restaurant name from the DB using the provided UUID
    const { data: restaurant, error: restError } = await supabase
      .from('restaurants')
      .select('name')
      .eq('id', body.restaurantId)
      .single();

    if (restError || !restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('complaints')
      .insert({
        restaurant_id: body.restaurantId,
        restaurant_name: restaurant.name,
        customer_name: body.customerName,
        customer_email: body.customerEmail,
        incident_date: body.incidentDate,
        description: body.description,
        category: body.category,
        status: 'Pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        id: data.id,
        restaurantId: data.restaurant_id,
        restaurantName: data.restaurant_name,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        incidentDate: data.incident_date,
        description: data.description,
        category: data.category,
        status: data.status,
        createdAt: data.created_at,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/complaints]', err);
    return NextResponse.json({ error: 'Failed to file complaint' }, { status: 400 });
  }
}
