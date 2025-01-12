import https from 'https';

export default async function handler(req:any, res:any) {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  const postData = `token=${access_token}`;

  const postOptions = {
    host: 'oauth2.googleapis.com',
    port: '443',
    path: '/revoke',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const postReq = https.request(postOptions, (response) => {
    response.setEncoding('utf8');
    response.on('data', (d) => {
      console.log('Response:', d);
    });
  });

  postReq.on('error', (error) => {
    console.error(error);
    res.status(500).json({ error: 'Failed to revoke token' });
  });

  postReq.write(postData);
  postReq.end();

  res.status(200).json({ message: 'Token revocation request sent' });
}
