import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: restaurant, error: restError } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', params.id)
      .single();

    if (restError || !restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const { data: inspections, error: inspError } = await supabase
      .from('inspection_reports')
      .select('*')
      .eq('restaurant_id', params.id)
      .order('inspection_date', { ascending: false });

    // Map DB columns to app types
    const mappedRestaurant = {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      cuisine: restaurant.cuisine,
      hygieneScore: restaurant.hygiene_score,
      grade: restaurant.grade,
      lastInspectionDate: restaurant.last_inspection_date ?? 'Never',
      ownerName: restaurant.owner_name,
      ownerEmail: restaurant.owner_email,
      status: restaurant.status,
      inspectionsCount: restaurant.inspections_count,
    };

    const mappedInspections = (inspections ?? []).map((r) => ({
      id: r.id,
      restaurantId: r.restaurant_id,
      restaurantName: r.restaurant_name,
      inspectorName: r.inspector_name,
      date: r.inspection_date,
      score: r.score,
      grade: r.grade,
      remarks: r.remarks,
      imageUrl: r.image_url,
      criteria: {
        cleanliness: r.crit_cleanliness,
        foodHandling: r.crit_food_handling,
        pestControl: r.crit_pest_control,
        staffHygiene: r.crit_staff_hygiene,
        temperatureControl: r.crit_temperature_control,
      },
      createdAt: r.created_at,
    }));

    return NextResponse.json({ restaurant: mappedRestaurant, inspections: mappedInspections });
  } catch (err) {
    console.error(`[GET /api/restaurants/[id]]`, err);
    return NextResponse.json({ error: 'Failed to load restaurant' }, { status: 500 });
  }
}

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await request.json();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const updateData: any = {};
    if (body.status) updateData.status = body.status;
    // can add other fields if needed

    const { error } = await supabase
      .from('restaurants')
      .update(updateData)
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`[PATCH /api/restaurants/[id]]`, err);
    return NextResponse.json({ error: 'Failed to update restaurant' }, { status: 400 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`[DELETE /api/restaurants/[id]]`, err);
    return NextResponse.json({ error: 'Failed to delete restaurant' }, { status: 400 });
  }
}
