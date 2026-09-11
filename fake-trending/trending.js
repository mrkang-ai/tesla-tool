// trending.js - Fake X Trending Generator
document.addEventListener('DOMContentLoaded', () => {
  const trendKeyword = document.getElementById('trendKeyword');
  const tweetCount = document.getElementById('tweetCount');
  const trendCategory = document.getElementById('trendCategory');

  const cardKeyword = document.getElementById('cardKeyword');
  const cardCount = document.getElementById('cardCount');
  const cardCategory = document.getElementById('cardCategory');

  function update() {
    cardKeyword.textContent = trendKeyword.value.trim() || "실시간 트렌드";
    cardCount.textContent = tweetCount.value.trim() || "1.2M Tweets";
    cardCategory.textContent = `1 · ${trendCategory.value.trim() || "대한민국에서 트렌드 중"}`;
  }

  trendKeyword.addEventListener('input', update);
  tweetCount.addEventListener('input', update);
  trendCategory.addEventListener('input', update);

  update();
});
