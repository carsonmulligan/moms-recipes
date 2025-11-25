/**
 * KDP Manuscript Generator
 * Generates an HTML file that can be opened in Word and saved as PDF for KDP upload
 *
 * Usage: node generate-kdp-manuscript.js
 * Output: kdp-manuscript.html (open in Word, save as PDF)
 */

const fs = require('fs');
const path = require('path');

// Read the manuscript JSON
const manuscriptPath = path.join(__dirname, 'cookbook_manuscript.json');
const manuscript = JSON.parse(fs.readFileSync(manuscriptPath, 'utf8'));

// Category order for the cookbook
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
  'Cookies',
  'Candy & Treats',
  'Drinks',
  'Thanksgiving',
  'Miscellaneous'
];

// Generate HTML
function generateHTML() {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Dr. Lesa Mulligan's Cookbook</title>
  <style>
    @page {
      size: 8in 10in;
      margin: 0.75in 0.5in 0.5in 0.75in;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #333;
      max-width: 7in;
      margin: 0 auto;
      padding: 20px;
    }

    /* Title Page */
    .title-page {
      page-break-after: always;
      text-align: center;
      padding-top: 3in;
    }

    .title-page h1 {
      font-size: 36pt;
      color: #8b4513;
      margin-bottom: 0.5in;
      font-weight: normal;
    }

    .title-page .subtitle {
      font-size: 18pt;
      color: #a0522d;
      font-style: italic;
      margin-bottom: 2in;
    }

    .title-page .author {
      font-size: 16pt;
      color: #666;
    }

    /* Copyright Page */
    .copyright-page {
      page-break-after: always;
      font-size: 10pt;
      padding-top: 4in;
    }

    /* Dedication */
    .dedication-page {
      page-break-after: always;
      text-align: center;
      padding-top: 3in;
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
      font-size: 24pt;
      margin-bottom: 0.5in;
    }

    .toc-category {
      font-size: 14pt;
      font-weight: bold;
      color: #8b4513;
      margin-top: 20px;
      margin-bottom: 5px;
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
      font-size: 32pt;
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

    /* Recipe */
    .recipe {
      page-break-inside: avoid;
      margin-bottom: 0.5in;
      padding-bottom: 0.3in;
      border-bottom: 1px solid #eee;
    }

    .recipe:last-child {
      border-bottom: none;
    }

    .recipe-title {
      font-size: 16pt;
      color: #8b4513;
      margin-bottom: 8px;
      font-weight: bold;
    }

    .recipe-meta {
      font-size: 10pt;
      color: #888;
      margin-bottom: 12px;
      font-style: italic;
    }

    .recipe h4 {
      font-size: 12pt;
      color: #a0522d;
      margin: 15px 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .recipe ul {
      margin: 0 0 15px 0;
      padding-left: 25px;
    }

    .recipe li {
      margin: 4px 0;
    }

    .recipe ol {
      margin: 0 0 15px 0;
      padding-left: 25px;
    }

    .recipe ol li {
      margin: 6px 0;
    }

    .recipe p {
      margin: 0 0 10px 0;
      text-align: justify;
    }

    .suggestions {
      background: #faf5f0;
      padding: 10px 15px;
      border-left: 3px solid #d4a574;
      margin: 10px 0;
    }

    .suggestions h4 {
      margin-top: 0;
    }

    /* Index */
    .index-page {
      page-break-before: always;
    }

    .index-page h2 {
      text-align: center;
      color: #8b4513;
      font-size: 24pt;
      margin-bottom: 0.5in;
    }

    .index-columns {
      column-count: 2;
      column-gap: 30px;
    }

    .index-letter {
      font-size: 14pt;
      font-weight: bold;
      color: #8b4513;
      margin-top: 15px;
      margin-bottom: 5px;
    }

    .index-entry {
      font-size: 10pt;
      margin-left: 10px;
      line-height: 1.5;
    }

    /* Notes Page */
    .notes-page {
      page-break-before: always;
    }

    .notes-page h2 {
      text-align: center;
      color: #8b4513;
      font-size: 24pt;
      margin-bottom: 0.5in;
    }

    .notes-lines {
      border-bottom: 1px solid #ddd;
      height: 35px;
    }
  </style>
</head>
<body>

<!-- TITLE PAGE -->
<div class="title-page">
  <h1>Dr. Lesa Mulligan's<br>Cookbook</h1>
  <div class="subtitle">A Collection of 150 Family Recipes</div>
  <div class="author">Compiled with love from handwritten recipe cards</div>
</div>

<!-- COPYRIGHT PAGE -->
<div class="copyright-page">
  <p><strong>Dr. Lesa Mulligan's Cookbook</strong></p>
  <p>A Collection of 150 Family Recipes</p>
  <br><br>
  <p>Copyright © ${new Date().getFullYear()}</p>
  <p>All rights reserved.</p>
  <br><br>
  <p>No part of this publication may be reproduced, distributed, or transmitted
  in any form or by any means without the prior written permission of the publisher.</p>
  <br><br>
  <p>These recipes have been lovingly transcribed from handwritten recipe cards
  collected over generations. Some recipes may have originated from friends,
  family members, or other sources as noted.</p>
  <br><br>
  <p>First Edition</p>
  <p>Printed in the United States of America</p>
</div>

<!-- DEDICATION PAGE -->
<div class="dedication-page">
  <p>Dedicated to all who gather around the table,<br>
  share a meal, and create memories together.</p>
  <br><br>
  <p>"People who love to eat are always the best people."<br>
  — Julia Child</p>
</div>

<!-- TABLE OF CONTENTS -->
<div class="toc-page">
  <h2>Table of Contents</h2>
`;

  // Generate TOC
  let pageNum = 7; // Start after front matter
  const tocData = [];

  for (const category of categoryOrder) {
    const categoryData = manuscript.categories[category];
    if (categoryData && categoryData.recipes && categoryData.recipes.length > 0) {
      html += `<div class="toc-category">${category} (${categoryData.recipes.length})</div>\n`;

      for (const recipe of categoryData.recipes) {
        html += `<div class="toc-recipe">${recipe.title}</div>\n`;
        tocData.push({title: recipe.title, category: category});
      }
    }
  }

  html += `</div>\n\n`;

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
      }
    }
  }

  // Index
  html += generateIndexHTML(tocData);

  // Notes pages
  html += `
<!-- NOTES -->
<div class="notes-page">
  <h2>Notes</h2>
`;
  for (let i = 0; i < 20; i++) {
    html += `  <div class="notes-lines"></div>\n`;
  }
  html += `</div>\n\n`;

  // Second notes page
  html += `<div class="notes-page" style="page-break-before: always;">\n`;
  for (let i = 0; i < 25; i++) {
    html += `  <div class="notes-lines"></div>\n`;
  }
  html += `</div>\n\n`;

  // Closing
  html += `
<!-- BACK MATTER -->
<div style="page-break-before: always; text-align: center; padding-top: 4in;">
  <p style="font-size: 14pt; color: #8b4513;">Thank you for cooking with us!</p>
  <br><br>
  <p style="font-size: 11pt; color: #888;">
    These recipes represent years of family traditions,<br>
    holiday gatherings, and everyday meals made with love.
  </p>
  <br><br>
  <p style="font-size: 10pt; color: #888;">
    Visit us online:<br>
    carsonmulligan.github.io/moms-recipes
  </p>
</div>

</body>
</html>`;

  return html;
}

function generateRecipeHTML(recipe) {
  let html = `<div class="recipe">\n`;
  html += `  <div class="recipe-title">${recipe.title}</div>\n`;

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
    html += `  <div class="recipe-meta">${meta.join(' | ')}</div>\n`;
  }

  // Ingredients
  if (recipe.ingredients && recipe.ingredients.length > 0) {
    html += `  <h4>Ingredients</h4>\n`;
    html += `  <ul>\n`;
    for (const ingredient of recipe.ingredients) {
      html += `    <li>${ingredient}</li>\n`;
    }
    html += `  </ul>\n`;
  }

  // Instructions
  if (recipe.instructions) {
    html += `  <h4>Instructions</h4>\n`;
    if (Array.isArray(recipe.instructions) && recipe.instructions.length > 0) {
      html += `  <ol>\n`;
      for (const step of recipe.instructions) {
        html += `    <li>${step}</li>\n`;
      }
      html += `  </ol>\n`;
    } else if (typeof recipe.instructions === 'string' && recipe.instructions.trim()) {
      html += `  <p>${recipe.instructions}</p>\n`;
    }
  }

  // Suggestions (for Tastefully Simple products)
  if (recipe.suggestions && recipe.suggestions.length > 0) {
    html += `  <div class="suggestions">\n`;
    html += `    <h4>Serving Suggestions</h4>\n`;
    html += `    <ul>\n`;
    for (const suggestion of recipe.suggestions) {
      html += `      <li>${suggestion}</li>\n`;
    }
    html += `    </ul>\n`;
    html += `  </div>\n`;
  }

  // Notes
  if (recipe.note) {
    html += `  <p><em>Note: ${recipe.note}</em></p>\n`;
  }

  html += `</div>\n\n`;
  return html;
}

function generateIndexHTML(recipes) {
  // Sort recipes alphabetically
  const sorted = [...recipes].sort((a, b) =>
    a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  );

  let html = `\n<!-- INDEX -->\n`;
  html += `<div class="index-page">\n`;
  html += `  <h2>Index</h2>\n`;
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
const outputPath = path.join(__dirname, 'kdp-manuscript.html');
fs.writeFileSync(outputPath, htmlContent, 'utf8');

console.log(`
✅ KDP Manuscript Generated!

Output: kdp-manuscript.html

Next Steps:
1. Open kdp-manuscript.html in Microsoft Word
2. Review and make any final edits
3. File → Save As → PDF (choose "Best for printing")
4. Upload the PDF to KDP

Specifications:
- Trim Size: 8" x 10"
- Color: Standard color
- Paper: 70# white
- Binding: Hardcover (case laminate)

Total Recipes: ${manuscript.total_recipes}
`);
