import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { calculateGrade } from '@/lib/mockData';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('inspection_reports')
      .select('*')
      .order('inspection_date', { ascending: false });

    if (error) throw error;

    const mapped = (data ?? []).map((r) => ({
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

    return NextResponse.json(mapped);
  } catch (err) {
    console.error('[GET /api/inspections]', err);
    return NextResponse.json({ error: 'Failed to load inspections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get restaurant name for denormalization
    const { data: restaurant, error: restError } = await supabase
      .from('restaurants')
      .select('name, inspections_count')
      .eq('id', body.restaurantId)
      .single();

    if (restError || !restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const c = body.criteria;
    const calculatedScore = (c.cleanliness + c.foodHandling + c.pestControl + c.staffHygiene + c.temperatureControl) * 2;
    const finalGrade = calculateGrade(calculatedScore);
    const dateStr = new Date().toISOString().split('T')[0];

    // Insert inspection report
    const { data: report, error: reportError } = await supabase
      .from('inspection_reports')
      .insert({
        restaurant_id: body.restaurantId,
        restaurant_name: restaurant.name,
        inspector_name: body.inspectorName || 'Officer Alice Smith',
        inspection_date: dateStr,
        score: calculatedScore,
        grade: finalGrade,
        remarks: body.remarks,
        image_url: body.imageUrl,
        crit_cleanliness: c.cleanliness,
        crit_food_handling: c.foodHandling,
        crit_pest_control: c.pestControl,
        crit_staff_hygiene: c.staffHygiene,
        crit_temperature_control: c.temperatureControl,
      })
      .select()
      .single();

    if (reportError) throw reportError;

    // Update restaurant
    const { error: updateError } = await supabase
      .from('restaurants')
      .update({
        hygiene_score: calculatedScore,
        grade: finalGrade,
        last_inspection_date: dateStr,
        inspections_count: restaurant.inspections_count + 1,
        status: calculatedScore < 60 ? 'Suspended' : 'Active',
      })
      .eq('id', body.restaurantId);

    if (updateError) throw updateError;

    return NextResponse.json(
      {
        id: report.id,
        restaurantId: report.restaurant_id,
        restaurantName: report.restaurant_name,
        inspectorName: report.inspector_name,
        date: report.inspection_date,
        score: report.score,
        grade: report.grade,
        remarks: report.remarks,
        imageUrl: report.image_url,
        criteria: {
          cleanliness: report.crit_cleanliness,
          foodHandling: report.crit_food_handling,
          pestControl: report.crit_pest_control,
          staffHygiene: report.crit_staff_hygiene,
          temperatureControl: report.crit_temperature_control,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/inspections]', err);
    return NextResponse.json({ error: 'Failed to process inspection report' }, { status: 400 });
  }
}
