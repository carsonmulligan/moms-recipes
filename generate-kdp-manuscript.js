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

// Build a map of recipe titles to their source images by reading original JSON files
const recipeImageMap = {};

function findRecipeImages(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      findRecipeImages(fullPath);
    } else if (item.name.endsWith('.json') && item.name !== 'cookbook_manuscript.json' && item.name !== 'complete_cookbook.json' && item.name !== 'package.json' && item.name !== 'package-lock.json') {
      try {
        const recipe = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        if (recipe.title) {
          const images = recipe.source_images || (recipe.source_image ? [recipe.source_image] : []);
          if (images.length > 0) {
            // Store relative path from recipe JSON to images
            const recipeDir = path.dirname(fullPath);
            recipeImageMap[recipe.title] = {
              images: images,
              dir: recipeDir
            };
          }
        }
      } catch (e) {
        // Skip invalid JSON files
      }
    }
  }
}

findRecipeImages(__dirname);
console.log(`Found images for ${Object.keys(recipeImageMap).length} recipes`);

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
    /* KDP 8.5x11 with proper margins for ~150 pages (0.5" gutter, 0.5" outside, 0.75" top/bottom) */
    @page {
      size: 8.5in 11in;
      margin: 0.75in 0.5in 0.75in 0.625in;
      @bottom-center {
        content: counter(page);
        font-family: Georgia, serif;
        font-size: 10pt;
        color: #8b4513;
      }
    }

    /* No page number on title page */
    @page:first {
      @bottom-center {
        content: none;
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 9.5pt;
      line-height: 1.25;
      color: #333;
      max-width: 7.25in;
      margin: 0 auto;
      padding: 0;
      counter-reset: page;
    }

    /* Page number in footer (fallback for non-CSS3 renderers) */
    .page-number {
      text-align: center;
      font-size: 10pt;
      color: #8b4513;
      margin-top: 10px;
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
      display: flex;
      justify-content: space-between;
    }

    .toc-category .page-num {
      font-weight: normal;
      color: #a0522d;
    }

    .toc-recipe {
      font-size: 11pt;
      margin-left: 20px;
      line-height: 1.8;
      display: flex;
      justify-content: space-between;
    }

    .toc-recipe .dots {
      flex: 1;
      border-bottom: 1px dotted #ccc;
      margin: 0 8px;
      position: relative;
      top: -4px;
    }

    .toc-recipe .page-num {
      color: #8b4513;
      font-weight: normal;
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

    /* Recipe page - contains 1 or 2 recipes */
    .recipe-page {
      page-break-before: always;
      page-break-inside: avoid;
      min-height: 9in;
    }

    .recipe-page:first-of-type {
      page-break-before: avoid;
    }

    /* Single recipe - full page with 2-column layout */
    .recipe-full {
      display: flex;
      gap: 0.2in;
      min-height: 8.5in;
      padding-bottom: 0.25in;
    }

    .recipe-full .recipe-left {
      flex: 0 0 2.8in;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .recipe-full .recipe-right {
      flex: 1;
    }

    /* Half-page recipe for 2-per-page layout */
    .recipe-half {
      display: flex;
      gap: 0.15in;
      height: 4.4in;
      padding-bottom: 0.15in;
      border-bottom: 1px solid #d4a574;
      margin-bottom: 0.15in;
    }

    .recipe-half:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .recipe-half .recipe-left {
      flex: 0 0 2in;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .recipe-half .recipe-right {
      flex: 1;
    }

    .recipe-half .recipe-images img {
      max-width: 1.9in;
      max-height: 2.8in;
    }

    .recipe-half .recipe-title {
      font-size: 13pt;
    }

    .recipe-half h4 {
      font-size: 9pt;
      margin: 6px 0 3px 0;
    }

    .recipe-half li {
      font-size: 8.5pt;
      margin: 1px 0;
    }

    .recipe-half p {
      font-size: 8.5pt;
    }

    .recipe-title {
      font-size: 16pt;
      color: #8b4513;
      margin-bottom: 4px;
      font-weight: bold;
      border-bottom: 2px solid #d4a574;
      padding-bottom: 3px;
    }

    .recipe-meta {
      font-size: 8pt;
      color: #666;
      margin-bottom: 6px;
      font-style: italic;
    }

    .recipe-full h4, .recipe-half h4 {
      color: #a0522d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .recipe-full h4 {
      font-size: 10pt;
      margin: 8px 0 4px 0;
    }

    .recipe-full ul, .recipe-half ul {
      margin: 0 0 6px 0;
      padding-left: 15px;
    }

    .recipe-full li {
      margin: 1px 0;
      font-size: 9pt;
    }

    .recipe-full ol, .recipe-half ol {
      margin: 0 0 6px 0;
      padding-left: 15px;
    }

    .recipe-full ol li {
      margin: 2px 0;
      font-size: 9pt;
    }

    .recipe-half ol li {
      margin: 1px 0;
      font-size: 8.5pt;
    }

    .recipe-full p {
      margin: 0 0 6px 0;
      text-align: justify;
      font-size: 9pt;
    }

    .suggestions {
      background: #faf5f0;
      padding: 5px 8px;
      border-left: 2px solid #d4a574;
      margin: 5px 0;
      font-size: 8pt;
    }

    .suggestions h4 {
      margin-top: 0;
      font-size: 9pt;
    }

    /* Recipe Images */
    .recipe-images {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-top: 5px;
    }

    .recipe-full .recipe-images img {
      max-width: 2.6in;
      max-height: 3.2in;
      border: 1px solid #d4a574;
      border-radius: 3px;
    }

    .recipe-full .recipe-images.two-images img {
      max-height: 2.8in;
    }

    .recipe-images-caption {
      font-size: 7pt;
      color: #888;
      text-align: center;
      font-style: italic;
      margin-top: 2px;
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
      display: flex;
      justify-content: space-between;
    }

    .index-entry .page-num {
      color: #8b4513;
      margin-left: 5px;
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

  // Helper function to check if recipe can fit on half page
  function canFitHalfPage(recipe) {
    const imageData = recipeImageMap[recipe.title];
    const hasMultipleImages = imageData && imageData.images && imageData.images.length >= 2;

    // Count ingredients (handle both array and nested object)
    let ingredientCount = 0;
    if (Array.isArray(recipe.ingredients)) {
      ingredientCount = recipe.ingredients.length;
    } else if (typeof recipe.ingredients === 'object' && recipe.ingredients) {
      for (const items of Object.values(recipe.ingredients)) {
        if (Array.isArray(items)) ingredientCount += items.length;
      }
    }

    // Count instructions (handle both array, string, and nested object)
    let instructionLength = 0;
    if (Array.isArray(recipe.instructions)) {
      instructionLength = recipe.instructions.length;
    } else if (typeof recipe.instructions === 'string') {
      instructionLength = recipe.instructions.length; // character count for strings
    } else if (typeof recipe.instructions === 'object' && recipe.instructions) {
      for (const steps of Object.values(recipe.instructions)) {
        if (Array.isArray(steps)) instructionLength += steps.length;
      }
    }

    const hasSuggestions = recipe.suggestions && recipe.suggestions.length > 0;

    // Full page if: 2+ images, many ingredients, long instructions, or has suggestions
    if (hasMultipleImages) return false;
    if (ingredientCount > 12) return false;
    if (Array.isArray(recipe.instructions) && instructionLength > 8) return false;
    if (typeof recipe.instructions === 'string' && instructionLength > 400) return false;
    if (typeof recipe.instructions === 'object' && !Array.isArray(recipe.instructions) && instructionLength > 6) return false;
    if (hasSuggestions && recipe.suggestions.length > 4) return false;

    return true;
  }

  // Calculate page numbers with 2-per-page support
  const tocData = [];
  const categoryPages = {};

  // Front matter = 3 pages, TOC = ~4 pages = start at page 8
  let currentPage = 8;

  // First pass: calculate all page numbers considering 2-per-page
  for (const category of categoryOrder) {
    const categoryData = manuscript.categories[category];
    if (categoryData && categoryData.recipes && categoryData.recipes.length > 0) {
      categoryPages[category] = currentPage;
      currentPage++; // chapter divider takes 1 page

      const recipes = categoryData.recipes;
      let i = 0;
      while (i < recipes.length) {
        const recipe1 = recipes[i];
        const recipe2 = recipes[i + 1];

        // Check if we can pair two recipes on one page
        if (recipe2 && canFitHalfPage(recipe1) && canFitHalfPage(recipe2)) {
          // Both recipes on same page
          tocData.push({ title: recipe1.title, category: category, page: currentPage, half: true });
          tocData.push({ title: recipe2.title, category: category, page: currentPage, half: true });
          i += 2;
        } else {
          // Single recipe on full page
          tocData.push({ title: recipe1.title, category: category, page: currentPage, half: false });
          i += 1;
        }
        currentPage++;
      }
    }
  }

  // Generate TOC with page numbers
  for (const category of categoryOrder) {
    const categoryData = manuscript.categories[category];
    if (categoryData && categoryData.recipes && categoryData.recipes.length > 0) {
      html += `<div class="toc-category"><span>${category}</span><span class="page-num">${categoryPages[category]}</span></div>\n`;

      const categoryRecipes = tocData.filter(r => r.category === category);
      for (const recipe of categoryRecipes) {
        html += `<div class="toc-recipe"><span>${recipe.title}</span><span class="dots"></span><span class="page-num">${recipe.page}</span></div>\n`;
      }
    }
  }

  html += `</div>\n\n`;

  // Generate chapters with recipes (2 per page when possible)
  for (const category of categoryOrder) {
    const categoryData = manuscript.categories[category];
    if (categoryData && categoryData.recipes && categoryData.recipes.length > 0) {
      // Chapter divider
      html += `<!-- ${category.toUpperCase()} CHAPTER -->\n`;
      html += `<div class="chapter-divider">\n`;
      html += `  <h2>${category}</h2>\n`;
      html += `  <div class="count">${categoryData.recipes.length} Recipes</div>\n`;
      html += `</div>\n\n`;

      // Recipes - pair them when possible
      const recipes = categoryData.recipes;
      let i = 0;
      while (i < recipes.length) {
        const recipe1 = recipes[i];
        const recipe2 = recipes[i + 1];

        if (recipe2 && canFitHalfPage(recipe1) && canFitHalfPage(recipe2)) {
          // Two recipes on one page
          html += `<div class="recipe-page">\n`;
          html += generateRecipeHTML(recipe1, true);
          html += generateRecipeHTML(recipe2, true);
          html += `</div>\n\n`;
          i += 2;
        } else {
          // Single recipe on full page
          html += `<div class="recipe-page">\n`;
          html += generateRecipeHTML(recipe1, false);
          html += `</div>\n\n`;
          i += 1;
        }
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

function generateRecipeHTML(recipe, isHalf = false) {
  const recipeClass = isHalf ? 'recipe-half' : 'recipe-full';
  let html = `<div class="${recipeClass}">\n`;

  // LEFT COLUMN - Images
  html += `  <div class="recipe-left">\n`;

  // Recipe card images
  const imageData = recipeImageMap[recipe.title];
  if (imageData && imageData.images.length > 0) {
    // For half-page, only show first image; for full page, show up to 2
    const maxImages = isHalf ? 1 : 2;
    const displayImages = imageData.images.slice(0, maxImages);
    const twoImagesClass = displayImages.length === 2 ? ' two-images' : '';
    html += `    <div class="recipe-images${twoImagesClass}">\n`;
    for (const img of displayImages) {
      const imgPath = path.join(imageData.dir, img);
      html += `      <img src="${imgPath}" alt="Original recipe card">\n`;
    }
    html += `    </div>\n`;
    if (!isHalf) {
      html += `    <p class="recipe-images-caption">Original recipe card</p>\n`;
    }
  } else if (!isHalf) {
    // Placeholder only for full-page recipes without images
    html += `    <div style="width: 2.5in; height: 3in; border: 2px dashed #d4a574; display: flex; align-items: center; justify-content: center; color: #888; font-style: italic; text-align: center; border-radius: 8px; font-size: 9pt;">Recipe Card<br>Image</div>\n`;
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
    html += `    <div class="recipe-meta">${meta.join(' | ')}</div>\n`;
  }

  // Ingredients - handle both array and object (nested) formats
  if (recipe.ingredients) {
    if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
      // Simple array format
      html += `    <h4>Ingredients</h4>\n`;
      html += `    <ul>\n`;
      for (const ingredient of recipe.ingredients) {
        html += `      <li>${ingredient}</li>\n`;
      }
      html += `    </ul>\n`;
    } else if (typeof recipe.ingredients === 'object' && !Array.isArray(recipe.ingredients)) {
      // Nested object format (e.g., {soup: [...], toppings: [...]})
      html += `    <h4>Ingredients</h4>\n`;
      for (const [section, items] of Object.entries(recipe.ingredients)) {
        if (Array.isArray(items) && items.length > 0) {
          const sectionName = section.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          html += `    <p style="font-size: 8pt; color: #666; margin: 4px 0 2px 0; font-style: italic;">${sectionName}:</p>\n`;
          html += `    <ul style="margin-top: 0;">\n`;
          for (const ingredient of items) {
            html += `      <li>${ingredient}</li>\n`;
          }
          html += `    </ul>\n`;
        }
      }
    }
  }

  // Instructions - handle both array, string, and object (nested) formats
  if (recipe.instructions) {
    html += `    <h4>Instructions</h4>\n`;
    if (Array.isArray(recipe.instructions) && recipe.instructions.length > 0) {
      // Simple array format
      html += `    <ol>\n`;
      for (const step of recipe.instructions) {
        html += `      <li>${step}</li>\n`;
      }
      html += `    </ol>\n`;
    } else if (typeof recipe.instructions === 'string' && recipe.instructions.trim()) {
      // Simple string format
      html += `    <p>${recipe.instructions}</p>\n`;
    } else if (typeof recipe.instructions === 'object' && !Array.isArray(recipe.instructions)) {
      // Nested object format (e.g., {tortilla_strips: [...], soup: [...]})
      for (const [section, steps] of Object.entries(recipe.instructions)) {
        if (Array.isArray(steps) && steps.length > 0) {
          const sectionName = section.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          html += `    <p style="font-size: 8pt; color: #666; margin: 4px 0 2px 0; font-style: italic;">${sectionName}:</p>\n`;
          html += `    <ol style="margin-top: 0;">\n`;
          for (const step of steps) {
            html += `      <li>${step}</li>\n`;
          }
          html += `    </ol>\n`;
        }
      }
    }
  }

  // Suggestions (for Tastefully Simple products)
  if (recipe.suggestions && recipe.suggestions.length > 0) {
    html += `    <div class="suggestions">\n`;
    html += `      <h4>Serving Suggestions</h4>\n`;
    html += `      <ul>\n`;
    for (const suggestion of recipe.suggestions) {
      html += `        <li>${suggestion}</li>\n`;
    }
    html += `      </ul>\n`;
    html += `    </div>\n`;
  }

  // Notes
  if (recipe.note) {
    html += `    <p><em>Note: ${recipe.note}</em></p>\n`;
  }

  html += `  </div>\n`; // Close recipe-right
  html += `</div>\n\n`; // Close recipe
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
    html += `    <div class="index-entry"><span>${recipe.title}</span><span class="page-num">${recipe.page}</span></div>\n`;
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
- Trim Size: 8.25" x 11" (KDP large format)
- Layout: 2-column (image left, recipe right)
- Color: Premium color (for photos)
- Paper: 70# white
- Binding: Hardcover (case laminate)

Total Recipes: ${manuscript.total_recipes}
`);
