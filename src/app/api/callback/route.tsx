import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

let userCredential: OAuthTokens | undefined;

export async function GET(req: NextRequest) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
  );

  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');
  
  const sessionState = req.cookies.get('state') || '';

  if (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: `OAuth Error: ${error}` });
  }

  if (state !== sessionState) {
    console.error('State mismatch. Possible CSRF attack');
    return NextResponse.json({ error: 'State mismatch. Possible CSRF attack' }, { status: 400 });
  }

  try {
    const tokenResponse = await oauth2Client.getToken(code || '');
    const tokens = tokenResponse.tokens;
    oauth2Client.setCredentials(tokens);

    userCredential = tokens as OAuthTokens;

    // Use YouTube API to fetch channel details
    const youtubeService = google.youtube('v3');
    const youtubeApiResponse = await youtubeService.channels.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails,statistics',
      forUsername: 'GoogleDevelopers',
    });

    const channels = youtubeApiResponse.data.items;

    if (channels.length === 0) {
      console.log('No channel found.');
      return NextResponse.json({ message: 'No channel found.' });
    } else {
      const channel = channels[0];
      console.log(
        `This channel's ID is ${channel.id}. Its title is '${channel.snippet.title}', and it has ${channel.statistics.viewCount} views.`
      );

      return NextResponse.json({
        id: channel.id,
        title: channel.snippet.title,
        viewCount: channel.statistics.viewCount,
      });
    }
  } catch (err) {
    console.error('Error during token exchange or API request:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
