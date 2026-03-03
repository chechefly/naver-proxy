export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).json({ error: "keyword required" });
  }

  const url = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(keyword)}&display=5&sort=sim`;

  const response = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": "314G6dR9GG6iOZamOOlz",
      "X-Naver-Client-Secret": "1zyVJ0lNgy",
    },
  });

  const data = await response.json();
  return res.status(200).json(data);
}
