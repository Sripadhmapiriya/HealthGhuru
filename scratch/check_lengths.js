const http = require('http');

http.get('http://localhost:3000/api/admin/magazine/articles?year=2026&month=9', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log('Total articles:', json.articles.length);
    json.articles.forEach((a, i) => {
      const excerptLen = (a.excerpt || '').length;
      const descLen = (a.description || '').length;
      const blocksLen = a.article_blocks ? JSON.stringify(a.article_blocks).length : 0;
      console.log(`${i+1}. [${a.content_type}] "${a.title.slice(0, 35)}" -> excerpt: ${excerptLen}, desc: ${descLen}, blocks: ${blocksLen}, img: ${!!a.image_url}`);
    });
  });
});
