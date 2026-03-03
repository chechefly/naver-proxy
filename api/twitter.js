export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { username = "Kpopidol_closet", limit = 20 } = req.query;
  const APIFY_TOKEN = process.env.APIFY_TOKEN;

  if (!APIFY_TOKEN) return res.status(500).json({ error: "APIFY_TOKEN not set" });

  try {
    const runRes = await fetch(
      `https://api.apify.com/v2/acts/apidojo~tweet-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=60`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twitterHandles: [username],
          maxItems: parseInt(limit),
          addUserInfo: false,
        }),
      }
    );

    const tweets = await runRes.json();

    const fashionTweets = tweets
      .filter((t) => {
        const text = t.full_text || t.text || "";
        return (
          text.includes("브랜드") ||
          text.includes("착장") ||
          text.includes("musinsa") ||
          text.includes("무신사") ||
          text.includes("패션 정보")
        );
      })
      .map((t) => {
        const text = t.full_text || t.text || "";
        return {
          text,
          date: t.created_at,
          images: t.entities?.media?.map((m) => m.media_url_https) || [],
          musinsaLinks: (text.match(/musinsa\.com\/[^\s]+/g) || []),
          urls: t.entities?.urls?.map((u) => u.expanded_url) || [],
        };
      });

    return res.status(200).json({ total: fashionTweets.length, tweets: fashionTweets });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
