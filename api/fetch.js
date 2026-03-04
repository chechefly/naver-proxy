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
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      }
    });
    const html = await response.text();

    // 이미지와 텍스트를 순서대로 인터리빙
    const blocks = [];
    const regex = /(<img[^>]+src="(https?:\/\/[^"]+)"[^>]*>)|([^<]{10,})/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (match[1]) {
        const src = match[2];
        if (!src.includes('icon') && !src.includes('logo') && !src.includes('btn') && !src.includes('static')) {
          blocks.push({ type: 'image', url: src });
        }
      } else if (match[3]) {
        const text = match[3].replace(/&[^;]+;/g, ' ').trim();
        if (text.length > 5) {
          blocks.push({ type: 'text', content: text });
        }
      }
    }

    res.status(200).json({ blocks: blocks.slice(0, 200) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
