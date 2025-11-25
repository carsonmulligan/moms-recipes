const fs = require('fs');
const path = require('path');

const images = [];

function findImages(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      findImages(fullPath);
    } else if (item.name.endsWith('.json') && !['cookbook_manuscript.json', 'complete_cookbook.json', 'package.json', 'package-lock.json'].includes(item.name)) {
      try {
        const recipe = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        if (recipe.title) {
          const imgList = recipe.source_images || (recipe.source_image ? [recipe.source_image] : []);
          const recipeDir = path.dirname(fullPath);
          for (const img of imgList) {
            const imgPath = path.join(recipeDir, img);
            if (fs.existsSync(imgPath)) {
              images.push({ title: recipe.title, path: imgPath });
            }
          }
        }
      } catch (e) {}
    }
  }
}

findImages('.');

// Generate gallery HTML with numbered images
const galleryHTML = `<!DOCTYPE html>
<html>
<head>
  <title>Recipe Card Image Gallery - Rotation Check</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #333;
      color: white;
      padding: 20px;
    }
    h1 { text-align: center; }
    .instructions {
      background: #444;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 8px;
      max-width: 800px;
      margin: 0 auto 20px auto;
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 15px;
    }
    .image-card {
      background: #444;
      border-radius: 8px;
      padding: 10px;
      position: relative;
    }
    .image-card img {
      width: 100%;
      max-height: 280px;
      object-fit: contain;
      background: #222;
    }
    .image-num {
      position: absolute;
      top: 15px;
      left: 15px;
      background: #f0c040;
      color: black;
      font-weight: bold;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 14px;
    }
    .image-card .title {
      font-weight: bold;
      margin: 10px 0 5px 0;
      color: #f0c040;
      font-size: 13px;
    }
    .image-card .path {
      font-size: 10px;
      color: #888;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <h1>Recipe Card Image Gallery (${images.length} images)</h1>

  <div class="instructions">
    <h3>Instructions:</h3>
    <p>Scroll through and note the <strong>numbers</strong> of any images where the recipe card text is SIDEWAYS.</p>
    <p>Then tell me: "Rotate images: 5, 12, 23, 45" (or whatever numbers need rotation)</p>
  </div>

  <div class="gallery">
${images.map((img, idx) => `    <div class="image-card">
      <span class="image-num">#${idx + 1}</span>
      <img src="${img.path}" alt="${img.title}">
      <div class="title">${img.title}</div>
      <div class="path">${img.path}</div>
    </div>`).join('\n')}
  </div>

</body>
</html>`;

fs.writeFileSync('image-gallery.html', galleryHTML);

// Also save image list as JSON for easy reference
fs.writeFileSync('image-list.json', JSON.stringify(images.map((img, idx) => ({
  num: idx + 1,
  title: img.title,
  path: img.path
})), null, 2));

console.log('Generated gallery with ' + images.length + ' images');
console.log('Open image-gallery.html in your browser to review');
