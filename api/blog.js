export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { query, display = 10 } = req.query;
  if (!query) return res.status(400).json({ error: "query required" });

  const CLIENT_ID = "314G6dR9GG6iOZamOOlz";
  const CLIENT_SECRET = "1zyVJ0lNgy";

  try {
    const searchUrl = `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(query + " 착장 브랜드")}&display=${display}&sort=date`;

    const searchRes = await fetch(searchUrl, {
      headers: {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET,
      },
    });

    const searchData = await searchRes.json();
    const items = searchData.items || [];

    const results = items.map((item) => ({
      title: item.title.replace(/<[^>]+>/g, ""),
      description: item.description.replace(/<[^>]+>/g, ""),
      link: item.link,
      bloggerName: item.bloggername,
      date: item.postdate,
      hasMusinsa: item.description.includes("musinsa") || item.description.includes("무신사"),
      has29cm: item.description.includes("29cm") || item.description.includes("29CM"),
      hasLink: item.description.includes("http"),
    }));

    return res.status(200).json({ total: searchData.total, results });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
