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

    // 본문 영역만 추출
    const bodyMatch = html.match(/se-main-container[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<div class="[^"]*author/);
    const bodyHtml = bodyMatch ? bodyMatch[1] : html;

    // 이미지와 텍스트를 순서대로 추출
    const blocks = [];
    const regex = /<img[^>]+src="(https:\/\/blogfiles[^"]+)"|<img[^>]+src="(https:\/\/postfiles[^"]+)"|>([\uAC00-\uD7A3a-zA-Z0-9,. ₩\n]{5,})</g;
    let match;
    while ((match = regex.exec(bodyHtml)) !== null) {
      const imgUrl = matc
