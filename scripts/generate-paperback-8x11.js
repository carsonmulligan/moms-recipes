/**
 * Paperback Cookbook Generator (8.5" x 11")
 * Generates an HTML file optimized for 8.5" x 11" paperback printing
 *
 * Usage: node generate-paperback-8x11.js
 * Output: output/paperback-8x11.html
 * Then: weasyprint ../output/paperback-8x11.html ../output/paperback-8x11.pdf
 */

const fs = require('fs');
const path = require('path');

// Build a map of recipe titles to their source images AND full recipe data
const recipeImageMap = {};
const allRecipes = [];

function findRecipes(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules' && item.name !== 'home' && item.name !== 'scripts' && item.name !== 'output' && item.name !== 'docs') {
      findRecipes(fullPath);
    } else if (item.name.endsWith('.json') && item.name !== 'cookbook_manuscript.json' && item.name !== 'complete_cookbook.json' && item.name !== 'package.json' && item.name !== 'package-lock.json' && item.name !== 'image-list.json') {
      try {
        const recipe = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        if (recipe.title) {
          recipe._path = fullPath;
          recipe._dir = path.dirname(fullPath);
          recipe._category = getCategoryFromPath(fullPath);
          allRecipes.push(recipe);

          const images = recipe.source_images || (recipe.source_image ? [recipe.source_image] : []);
          if (images.length > 0) {
            recipeImageMap[recipe.title] = {
              images: images,
              dir: path.dirname(fullPath)
            };
          }
        }
      } catch (e) {
        // Skip invalid JSON files
      }
    }
  }
}

function getCategoryFromPath(filePath) {
  const parts = filePath.split(path.sep);
  const idx = parts.indexOf('moms-recipes');
  if (idx >= 0 && parts.length > idx + 1) {
    const folder = parts[idx + 1];
    const categoryMap = {
      'appetizers': 'Appetizers',
      'breakfast': 'Breakfast',
      'entrees': 'Entrees',
      'soups': 'Soups',
      'salads': 'Salads',
      'vegetables': 'Vegetables & Sides',
      'breads': 'Breads',
      'cakes': 'Cakes',
      'desserts': 'Desserts',
      'drinks': 'Drinks',
      'thanksgiving': 'Thanksgiving'
    };
    return categoryMap[folder] || 'Miscellaneous';
  }
  return 'Miscellaneous';
}

findRecipes(path.join(__dirname, '..'));
console.log(`Found ${allRecipes.length} recipes with images for ${Object.keys(recipeImageMap).length}`);

// Build manuscript structure
const manuscript = { categories: {} };
for (const recipe of allRecipes) {
  const cat = recipe._category;
  if (!manuscript.categories[cat]) {
    manuscript.categories[cat] = { recipes: [] };
  }
  manuscript.categories[cat].recipes.push(recipe);
}

// Sort recipes within each category
for (const cat of Object.keys(manuscript.categories)) {
  manuscript.categories[cat].recipes.sort((a, b) => a.title.localeCompare(b.title));
}

// Category order
const categoryOrder = [
  'Appetizers',
  'Breakfast',
  'Entrees',
  'Soups',
  'Salads',
  'Vegetables & Sides',
  'Breads',
  'Cakes',
  'Desserts',
  'Drinks',
  'Thanksgiving'
];

// Generate HTML
function generateHTML() {
  const totalRecipes = allRecipes.length;

  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Dr. Lesa Mulligan's Cookbook</title>
  <style>
    /*
     * KDP 8.5" x 11" Paperback Specifications
     * For 151-400 pages: Inside margin 0.875", Outside 0.25", Top/Bottom 0.25"
     * No bleed (content doesn't go to edge)
     */
    @page {
      size: 8.5in 11in;
      margin: 0.5in 0.5in 0.5in 0.875in; /* top right bottom left(gutter) */
    }

    @page:right {
      margin: 0.5in 0.5in 0.5in 0.875in; /* odd pages - gutter on left */
    }

    @page:left {
      margin: 0.5in 0.875in 0.5in 0.5in; /* even pages - gutter on right */
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 10pt;
      line-height: 1.3;
      color: #333;
      margin: 0;
      padding: 0;
    }

    /* Page numbers - positioned manually */
    .page-number {
      position: fixed;
      bottom: 0.25in;
      width: 100%;
      text-align: center;
      font-size: 10pt;
      color: #8b4513;
    }

    /* Title Page */
    .title-page {
      page-break-after: always;
      text-align: center;
      padding-top: 3in;
      height: 10in;
    }

    .title-page h1 {
      font-size: 36pt;
      color: #8b4513;
      margin-bottom: 0.3in;
      font-weight: normal;
      line-height: 1.1;
    }

    .title-page .subtitle {
      font-size: 16pt;
      color: #a0522d;
      font-style: italic;
      margin-bottom: 1.5in;
    }

    .title-page .author {
      font-size: 12pt;
      color: #666;
    }

    /* Copyright Page */
    .copyright-page {
      page-break-after: always;
      font-size: 10pt;
      padding-top: 3in;
    }

    /* Dedication */
    .dedication-page {
      page-break-after: always;
      text-align: center;
      padding-top: 2.5in;
      font-style: italic;
      font-size: 14pt;
    }

    /* Table of Contents */
    .toc-page {
      page-break-after: always;
    }

    .toc-page h2 {
      text-align: center;
      color: #8b4513;
      font-size: 28pt;
      margin-bottom: 0.4in;
      font-weight: normal;
    }

    .toc-category {
      font-size: 14pt;
      font-weight: bold;
      color: #8b4513;
      margin-top: 18px;
      margin-bottom: 6px;
      border-bottom: 1px solid #d4a574;
      padding-bottom: 3px;
    }

    .toc-recipe {
      font-size: 11pt;
      margin-left: 20px;
      line-height: 1.6;
    }

    /* Chapter Divider */
    .chapter-divider {
      page-break-before: always;
      page-break-after: always;
      text-align: center;
      padding-top: 3in;
    }

    .chapter-divider h2 {
      font-size: 36pt;
      color: #8b4513;
      font-weight: normal;
      border-bottom: 3px double #d4a574;
      padding-bottom: 10px;
      display: inline-block;
    }

    .chapter-divider .count {
      font-size: 14pt;
      color: #888;
      margin-top: 20px;
    }

    /* Recipe Container */
    .recipe {
      page-break-before: always;
      page-break-inside: avoid;
    }

    .recipe:first-of-type {
      page-break-before: avoid;
    }

    /* Recipe Layout - 2 column (7.125" content width) */
    .recipe-content {
      display: flex;
      gap: 0.25in;
    }

    .recipe-left {
      flex: 0 0 2.5in;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .recipe-right {
      flex: 1;
    }

    .recipe-title {
      font-size: 18pt;
      color: #8b4513;
      margin-bottom: 6px;
      font-weight: bold;
      border-bottom: 2px solid #d4a574;
      padding-bottom: 4px;
    }

    .recipe-meta {
      font-size: 9pt;
      color: #666;
      margin-bottom: 10px;
      font-style: italic;
    }

    h4 {
      color: #a0522d;
      font-size: 11pt;
      margin: 12px 0 6px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    ul, ol {
      margin: 0 0 10px 0;
      padding-left: 18px;
    }

    li {
      margin: 3px 0;
      font-size: 10pt;
    }

    p {
      margin: 0 0 10px 0;
      text-align: justify;
      font-size: 10pt;
    }

    .section-label {
      font-size: 9pt;
      color: #666;
      margin: 8px 0 3px 0;
      font-style: italic;
    }

    /* Recipe Images */
    .recipe-images {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 8px;
    }

    .recipe-images img {
      max-width: 2.4in;
      max-height: 3.2in;
      border: 1px solid #d4a574;
      border-radius: 4px;
    }

    .recipe-images.two-images img {
      max-height: 2.8in;
    }

    .recipe-images-caption {
      font-size: 8pt;
      color: #888;
      text-align: center;
      font-style: italic;
      margin-top: 4px;
    }

    /* No-image placeholder */
    .no-image {
      width: 2.3in;
      height: 3in;
      border: 2px dashed #d4a574;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #888;
      font-style: italic;
      text-align: center;
      border-radius: 8px;
      font-size: 10pt;
    }

    /* Notes */
    .recipe-note {
      background: #faf5f0;
      padding: 8px 12px;
      border-left: 3px solid #d4a574;
      margin: 10px 0;
      font-size: 9pt;
      font-style: italic;
    }

    /* Index */
    .index-page {
      page-break-before: always;
    }

    .index-page h2 {
      text-align: center;
      color: #8b4513;
      font-size: 28pt;
      margin-bottom: 0.4in;
      font-weight: normal;
    }

    .index-columns {
      column-count: 2;
      column-gap: 40px;
    }

    .index-letter {
      font-size: 16pt;
      font-weight: bold;
      color: #8b4513;
      margin-top: 15px;
      margin-bottom: 5px;
    }

    .index-entry {
      font-size: 10pt;
      margin-left: 10px;
      line-height: 1.6;
    }

    /* Notes Page */
    .notes-page {
      page-break-before: always;
    }

    .notes-page h2 {
      text-align: center;
      color: #8b4513;
      font-size: 28pt;
      margin-bottom: 0.4in;
      font-weight: normal;
    }

    .notes-lines {
      border-bottom: 1px solid #ddd;
      height: 40px;
    }

    /* Back Page */
    .back-page {
      page-break-before: always;
      text-align: center;
      padding-top: 3.5in;
    }
  </style>
</head>
<body>

<!-- TITLE PAGE -->
<div class="title-page">
  <h1>Dr. Lesa Mulligan's<br>Cookbook</h1>
  <div class="subtitle">A Collection of ${totalRecipes} Family Recipes</div>
  <div class="author">Compiled with love from handwritten recipe cards</div>
</div>

<!-- COPYRIGHT PAGE -->
<div class="copyright-page">
  <p><strong>Dr. Lesa Mulligan's Cookbook</strong></p>
  <p>A Collection of ${totalRecipes} Family Recipes</p>
  <br><br>
  <p>Copyright &copy; ${new Date().getFullYear()}</p>
  <p>All rights reserved.</p>
  <br><br>
  <p>No part of this publication may be reproduced, distributed, or transmitted
  in any form or by any means without the prior written permission of the publisher.</p>
  <br><br>
  <p>These recipes have been lovingly transcribed from handwritten recipe cards
  collected over generations. Some recipes may have originated from friends,
  family members, or other sources as noted.</p>
  <br><br>
  <p style="font-size: 9pt; color: #666; border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
  <strong>Disclaimer:</strong> The recipes in this cookbook are intended for personal
  enjoyment and are not medical advice. Despite the author's medical background,
  this cookbook does not constitute dietary, nutritional, or health guidance.
  Please consult your healthcare provider for any dietary concerns or restrictions.</p>
  <br>
  <p>First Edition</p>
  <p>Printed in the United States of America</p>
</div>

<!-- DEDICATION PAGE -->
<div class="dedication-page">
  <p>Dedicated to all who gather around the table,<br>
  share a meal, and create memories together.</p>
  <br><br>
  <p>"People who love to eat are always the best people."<br>
  &mdash; Julia Child</p>
</div>

<!-- TABLE OF CONTENTS -->
<div class="toc-page">
  <h2>Table of Contents</h2>
`;

  // Generate TOC
  for (const category of categoryOrder) {
    const categoryData = manuscript.categories[category];
    if (categoryData && categoryData.recipes && categoryData.recipes.length > 0) {
      html += `<div class="toc-category">${category}</div>\n`;
      for (const recipe of categoryData.recipes) {
        html += `<div class="toc-recipe">${recipe.title}</div>\n`;
      }
    }
  }

  html += `</div>\n\n`;

  // Track recipes for index
  const indexRecipes = [];

  // Generate chapters with recipes
  for (const category of categoryOrder) {
    const categoryData = manuscript.categories[category];
    if (categoryData && categoryData.recipes && categoryData.recipes.length > 0) {
      // Chapter divider
      html += `<!-- ${category.toUpperCase()} CHAPTER -->\n`;
      html += `<div class="chapter-divider">\n`;
      html += `  <h2>${category}</h2>\n`;
      html += `  <div class="count">${categoryData.recipes.length} Recipes</div>\n`;
      html += `</div>\n\n`;

      // Recipes
      for (const recipe of categoryData.recipes) {
        html += generateRecipeHTML(recipe);
        indexRecipes.push({ title: recipe.title, category: category });
      }
    }
  }

  // Index
  html += generateIndexHTML(indexRecipes);

  // Notes pages
  html += `
<!-- NOTES -->
<div class="notes-page">
  <h2>Notes</h2>
`;
  for (let i = 0; i < 18; i++) {
    html += `  <div class="notes-lines"></div>\n`;
  }
  html += `</div>\n\n`;

  // Second notes page
  html += `<div class="notes-page">\n`;
  for (let i = 0; i < 22; i++) {
    html += `  <div class="notes-lines"></div>\n`;
  }
  html += `</div>\n\n`;

  // Back page
  html += `
<!-- BACK PAGE -->
<div class="back-page">
  <p style="font-size: 16pt; color: #8b4513;">Thank you for cooking with us!</p>
  <br><br>
  <p style="font-size: 12pt; color: #888;">
    These recipes represent years of family traditions,<br>
    holiday gatherings, and everyday meals made with love.
  </p>
  <br><br>
  <p style="font-size: 11pt; color: #888;">
    Visit us online:<br>
    <strong>carsonmulligan.github.io/moms-recipes</strong>
  </p>
</div>

</body>
</html>`;

  return html;
}

function generateRecipeHTML(recipe) {
  let html = `<div class="recipe">\n`;
  html += `<div class="recipe-content">\n`;

  // LEFT COLUMN - Images
  html += `  <div class="recipe-left">\n`;

  const imageData = recipeImageMap[recipe.title];
  if (imageData && imageData.images.length > 0) {
    const displayImages = imageData.images.slice(0, 2);
    const twoImagesClass = displayImages.length === 2 ? ' two-images' : '';
    html += `    <div class="recipe-images${twoImagesClass}">\n`;
    for (const img of displayImages) {
      const imgPath = path.join(imageData.dir, img);
      html += `      <img src="${imgPath}" alt="Original recipe card">\n`;
    }
    html += `    </div>\n`;
    html += `    <p class="recipe-images-caption">Original recipe card</p>\n`;
  } else {
    html += `    <div class="no-image">Recipe Card<br>Image</div>\n`;
  }

  html += `  </div>\n`;

  // RIGHT COLUMN - Recipe content
  html += `  <div class="recipe-right">\n`;

  html += `    <div class="recipe-title">${recipe.title}</div>\n`;

  // Meta info
  const meta = [];
  if (recipe.prep_time) meta.push(`Prep: ${recipe.prep_time}`);
  if (recipe.cooking_time) meta.push(`Cook: ${recipe.cooking_time}`);
  if (recipe.time_required) meta.push(`Time: ${recipe.time_required}`);
  if (recipe.yields) meta.push(`Yields: ${recipe.yields}`);
  if (recipe.servings) meta.push(`Serves: ${recipe.servings}`);
  if (recipe.source) meta.push(`Source: ${recipe.source}`);
  if (recipe.oven_temp) meta.push(`Oven: ${recipe.oven_temp}`);

  if (meta.length > 0) {
    html += `    <div class="recipe-meta">${meta.join(' &nbsp;|&nbsp; ')}</div>\n`;
  }

  // Ingredients
  if (recipe.ingredients) {
    if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
      html += `    <h4>Ingredients</h4>\n`;
      html += `    <ul>\n`;
      for (const ingredient of recipe.ingredients) {
        html += `      <li>${ingredient}</li>\n`;
      }
      html += `    </ul>\n`;
    } else if (typeof recipe.ingredients === 'object' && !Array.isArray(recipe.ingredients)) {
      html += `    <h4>Ingredients</h4>\n`;
      for (const [section, items] of Object.entries(recipe.ingredients)) {
        if (Array.isArray(items) && items.length > 0) {
          const sectionName = section.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          html += `    <p class="section-label">${sectionName}:</p>\n`;
          html += `    <ul>\n`;
          for (const ingredient of items) {
            html += `      <li>${ingredient}</li>\n`;
          }
          html += `    </ul>\n`;
        }
      }
    }
  }

  // Instructions
  if (recipe.instructions) {
    html += `    <h4>Instructions</h4>\n`;
    if (Array.isArray(recipe.instructions) && recipe.instructions.length > 0) {
      html += `    <ol>\n`;
      for (const step of recipe.instructions) {
        html += `      <li>${step}</li>\n`;
      }
      html += `    </ol>\n`;
    } else if (typeof recipe.instructions === 'string' && recipe.instructions.trim()) {
      html += `    <p>${recipe.instructions}</p>\n`;
    } else if (typeof recipe.instructions === 'object' && !Array.isArray(recipe.instructions)) {
      for (const [section, steps] of Object.entries(recipe.instructions)) {
        if (Array.isArray(steps) && steps.length > 0) {
          const sectionName = section.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          html += `    <p class="section-label">${sectionName}:</p>\n`;
          html += `    <ol>\n`;
          for (const step of steps) {
            html += `      <li>${step}</li>\n`;
          }
          html += `    </ol>\n`;
        }
      }
    }
  }

  // Variations
  if (recipe.variations && recipe.variations.length > 0) {
    html += `    <h4>Variations</h4>\n`;
    for (const variation of recipe.variations) {
      html += `    <p><strong>${variation.name}:</strong> ${variation.recipe}</p>\n`;
    }
  }

  // Notes
  if (recipe.note) {
    html += `    <div class="recipe-note">Note: ${recipe.note}</div>\n`;
  }

  html += `  </div>\n`; // Close recipe-right
  html += `</div>\n`; // Close recipe-content
  html += `</div>\n\n`; // Close recipe

  return html;
}

function generateIndexHTML(recipes) {
  const sorted = [...recipes].sort((a, b) =>
    a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  );

  let html = `\n<!-- INDEX -->\n`;
  html += `<div class="index-page">\n`;
  html += `  <h2>Recipe Index</h2>\n`;
  html += `  <div class="index-columns">\n`;

  let currentLetter = '';
  for (const recipe of sorted) {
    const firstLetter = recipe.title.charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      html += `    <div class="index-letter">${currentLetter}</div>\n`;
    }
    html += `    <div class="index-entry">${recipe.title}</div>\n`;
  }

  html += `  </div>\n`;
  html += `</div>\n`;

  return html;
}

// Generate and save
const htmlContent = generateHTML();
const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, 'paperback-8x11.html');
fs.writeFileSync(outputPath, htmlContent, 'utf8');

console.log(`
========================================
  Paperback Cookbook Generated (8.5x11)
========================================

Output: output/paperback-8x11.html

To generate PDF:
  cd output
  weasyprint paperback-8x11.html paperback-8x11.pdf

Specifications:
- Trim Size: 8.5" x 11" (standard letter)
- Margins: 0.5" gutter, 0.25" outside, 0.5" top/bottom
- Layout: 2-column (image left, recipe right)
- Recommended: Color printing for photos

Total Recipes: ${allRecipes.length}
`);
