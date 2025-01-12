import { google } from 'googleapis';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function GET() {
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
  );

  const scopes = ['https://www.googleapis.com/auth/youtube.force-ssl'];

  const state = crypto.randomBytes(32).toString('hex');

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
    state,
  });

  return NextResponse.json({url});
}
