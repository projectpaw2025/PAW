import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Naver Login Server is running!');
});

app.post('/api/naver-token', async (req, res) => {
  const { code, state } = req.body;

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&state=${state}`;

  const tokenRes = await fetch(tokenUrl);
  const tokenJson = await tokenRes.json();

  if (tokenJson.access_token) {
    const profileRes = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${tokenJson.access_token}`
      }
    });

    const profileJson = await profileRes.json();

    res.json({
      ok: true,
      profile: profileJson.response
    });
  } else {
    res.status(400).json({ ok: false, error: tokenJson });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
