import { NextRequest, NextResponse } from 'next/server';

const API_KEY  = process.env.MAILCHIMP_API_KEY;
const LIST_ID  = process.env.MAILCHIMP_AUDIENCE_ID;
const SERVER   = process.env.MAILCHIMP_SERVER_PREFIX;
const TAG_ID   = process.env.MAILCHIMP_TAG_ID; // optional — adds subscriber to a specific tag

function authHeader() {
  return `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`;
}

export async function POST(req: NextRequest) {
  if (!API_KEY || !LIST_ID || !SERVER) {
    return NextResponse.json(
      { error: 'Newsletter not configured. Add MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID, and MAILCHIMP_SERVER_PREFIX to Vercel environment variables.' },
      { status: 503 }
    );
  }

  const { email } = await req.json().catch(() => ({ email: '' }));
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required.' }, { status: 400 });
  }

  const base = `https://${SERVER}.api.mailchimp.com/3.0`;
  const headers = { 'Content-Type': 'application/json', Authorization: authHeader() };

  // Step 1 — add/update member in the audience
  const memberRes = await fetch(`${base}/lists/${LIST_ID}/members`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email_address: email, status: 'subscribed' }),
  });

  const memberData = await memberRes.json();
  const alreadyExists = memberData.title === 'Member Exists';

  if (!memberRes.ok && !alreadyExists) {
    return NextResponse.json(
      { error: memberData.detail || 'Subscription failed. Please try again.' },
      { status: 400 }
    );
  }

  // Step 2 — add to tag/segment if configured
  if (TAG_ID) {
    await fetch(`${base}/lists/${LIST_ID}/segments/${TAG_ID}/members`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email_address: email }),
    }).catch(() => {}); // tag assignment is best-effort, don't fail the whole request
  }

  return NextResponse.json({ ok: true });
}
