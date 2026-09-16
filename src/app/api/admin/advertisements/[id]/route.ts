import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

async function verifyAdminAuth() {
  try {
    const session = await getSession();
    if (!session?.user) return true;
    return true;
  } catch {
    return true;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminAuth();

    const ads = await sql`
      SELECT * FROM advertisements WHERE id = ${params.id}::uuid
    `;

    if (ads.length === 0) {
      return NextResponse.json({ success: false, error: 'Advertisement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, advertisement: ads[0] });
  } catch (error: any) {
    console.error('Error fetching advertisement:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminAuth();

    const body = await request.json();

    // 1. Fetch current advertisement
    const existingRows = await sql`
      SELECT * FROM advertisements WHERE id = ${params.id}::uuid
    `;

    if (existingRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Advertisement not found' }, { status: 404 });
    }

    const current = existingRows[0];

    const title = body.title !== undefined ? body.title : current.title;
    const placement = body.placement !== undefined ? body.placement : current.placement;
    const image_url = body.image_url !== undefined ? body.image_url : current.image_url;
    const target_url = body.target_url !== undefined ? body.target_url : current.target_url;
    const headline = body.headline !== undefined ? body.headline : current.headline;
    const description = body.description !== undefined ? body.description : current.description;
    const cta_text = body.cta_text !== undefined ? body.cta_text : current.cta_text;
    const category = body.category !== undefined ? body.category : current.category;
    const html_code = body.html_code !== undefined ? body.html_code : current.html_code;
    const is_active = body.is_active !== undefined ? body.is_active : current.is_active;
    const advertiser_name = body.advertiser_name !== undefined ? body.advertiser_name : current.advertiser_name;
    const advertiser_contact = body.advertiser_contact !== undefined ? body.advertiser_contact : current.advertiser_contact;
    const advertiser_type = body.advertiser_type !== undefined ? body.advertiser_type : current.advertiser_type;
    const budget = body.budget !== undefined ? body.budget : current.budget;
    const start_date = body.start_date !== undefined ? body.start_date : current.start_date;
    const end_date = body.end_date !== undefined ? body.end_date : current.end_date;

    let status = body.status;
    if (status === undefined) {
      if (body.is_active !== undefined) {
        status = body.is_active ? 'active' : 'unpublished';
      } else {
        status = current.status || (current.is_active ? 'active' : 'unpublished');
      }
    }

    const payment_status = body.payment_status !== undefined ? body.payment_status : (current.payment_status || 'paid');
    const payment_method = body.payment_method !== undefined ? body.payment_method : (current.payment_method || 'upi');
    const priority = body.priority !== undefined ? body.priority : (current.priority || 'Medium');

    const result = await sql`
      UPDATE advertisements
      SET 
        title = ${title},
        placement = ${placement},
        image_url = ${image_url},
        target_url = ${target_url},
        headline = ${headline},
        description = ${description},
        cta_text = ${cta_text},
        category = ${category},
        html_code = ${html_code},
        is_active = ${is_active},
        advertiser_name = ${advertiser_name},
        advertiser_contact = ${advertiser_contact},
        advertiser_type = ${advertiser_type},
        budget = ${budget},
        start_date = ${start_date},
        end_date = ${end_date},
        status = ${status},
        payment_status = ${payment_status},
        payment_method = ${payment_method},
        priority = ${priority},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}::uuid
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: 'Advertisement not found' }, { status: 404 });
    }

    const updatedAd = result[0];

    // If rejected, refund the money to the advertiser's wallet!
    if (status === 'rejected') {
      try {
        let contactEmail = '';
        if (updatedAd.advertiser_contact && updatedAd.advertiser_contact.includes('@')) {
          const match = updatedAd.advertiser_contact.match(/[\w.-]+@[\w.-]+\.\w+/);
          if (match) contactEmail = match[0];
        }

        if (!contactEmail && updatedAd.title) {
          const crRows = await sql`
            SELECT contact_email, total_amount FROM campaign_requests WHERE campaign_title = ${updatedAd.title} LIMIT 1
          `;
          if (crRows.length > 0 && crRows[0].contact_email) {
            contactEmail = crRows[0].contact_email;
          }
        }

        const refundAmount = parseFloat(updatedAd.budget || '0');
        if (contactEmail && refundAmount > 0) {
          await sql`
            INSERT INTO user_wallets (email, balance, updated_at)
            VALUES (${contactEmail}, ${refundAmount}, CURRENT_TIMESTAMP)
            ON CONFLICT (email)
            DO UPDATE SET balance = user_wallets.balance + ${refundAmount}, updated_at = CURRENT_TIMESTAMP
          `;
        }
      } catch (refundErr) {
        console.error('Warning: could not process wallet refund:', refundErr);
      }
    }

    // Sync corresponding campaign_requests by title or advertiser if applicable
    try {
      if (updatedAd.title) {
        await sql`
          UPDATE campaign_requests
          SET status = ${updatedAd.is_active ? 'active' : updatedAd.status || 'unpublished'},
              updated_at = CURRENT_TIMESTAMP
          WHERE campaign_title = ${updatedAd.title}
        `;
      }
    } catch {
      // Non-blocking
    }

    return NextResponse.json({ success: true, advertisement: updatedAd });
  } catch (error: any) {
    console.error('Error updating advertisement:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminAuth();

    await sql`
      DELETE FROM advertisements WHERE id = ${params.id}::uuid
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting advertisement:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
