export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url required' });

  try {
    const mobileUrl = url.replace('blog.naver.com', 'm.blog.naver.com');
    const response = await fetch(mobileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'text/html',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      }
    });
    const html = await response.text();

    const blocks = [];
    const imgRegex = /<img[^>]+src="(https:\/\/(?:blogfiles|postfiles)[^"]+)"/g;
    let m;
    while ((m = imgRegex.exec(html)) !== null) {
      blocks.push({ type: 'image', url: m[1] });
    }

    const textRegex = />([\uAC00-\uD7A3][^<]{2,})</g;
    while ((m = textRegex.exec(html)) !== null) {
      const t = m[1].trim();
      if (t.length > 3) blocks.push({ type: 'text', content: t });
    }

    res.status(200).json({ blocks: blocks.slice(0, 150) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
