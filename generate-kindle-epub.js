/**
 * Kindle EPUB Generator
 * Generates an EPUB file for Kindle Direct Publishing upload
 *
 * Usage: node generate-kindle-epub.js
 * Output: kindle-cookbook.epub
 */

const fs = require('fs');
const path = require('path');

// Build recipe data from JSON files
const allRecipes = [];

function findRecipes(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules' && item.name !== 'home') {
      findRecipes(fullPath);
    } else if (item.name.endsWith('.json') && item.name !== 'cookbook_manuscript.json' && item.name !== 'complete_cookbook.json' && item.name !== 'package.json' && item.name !== 'package-lock.json' && item.name !== 'image-list.json') {
      try {
        const recipe = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        if (recipe.title) {
          recipe._path = fullPath;
          recipe._category = getCategoryFromPath(fullPath);
          allRecipes.push(recipe);
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
      'thanksgiving': 'Thanksgiving',
      'misc': 'Miscellaneous'
    };
    return categoryMap[folder] || 'Miscellaneous';
  }
  return 'Miscellaneous';
}

findRecipes(__dirname);

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

// Organize recipes by category
const recipesByCategory = {};
for (const recipe of allRecipes) {
  const cat = recipe._category;
  if (!recipesByCategory[cat]) {
    recipesByCategory[cat] = [];
  }
  recipesByCategory[cat].push(recipe);
}

// Sort recipes within each category
for (const cat of Object.keys(recipesByCategory)) {
  recipesByCategory[cat].sort((a, b) => a.title.localeCompare(b.title));
}

// Generate Markdown content for pandoc
let markdown = `---
title: "Dr. Lesa Mulligan's Cookbook"
author: "Dr. Lesa Mulligan"
language: en-US
---

# Dr. Lesa Mulligan's Cookbook

*A Collection of ${allRecipes.length} Family Recipes*

---

## About This Cookbook

Discover treasured family recipes, lovingly transcribed from handwritten recipe cards collected over generations. From comforting soups and hearty entrees to decadent desserts and holiday favorites, this cookbook brings together the best of American home cooking.

**Disclaimer:** The recipes in this cookbook are intended for personal enjoyment and are not medical advice. Despite the author's medical background, this cookbook does not constitute dietary, nutritional, or health guidance. Please consult your healthcare provider for any dietary concerns or restrictions.

---

*Dedicated to all who gather around the table, share a meal, and create memories together.*

> "People who love to eat are always the best people."
> — Julia Child

---

# Table of Contents

`;

// Generate TOC
for (const category of categoryOrder) {
  if (recipesByCategory[category] && recipesByCategory[category].length > 0) {
    markdown += `\n## ${category}\n\n`;
    for (const recipe of recipesByCategory[category]) {
      const anchor = recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      markdown += `- [${recipe.title}](#${anchor})\n`;
    }
  }
}

markdown += `\n---\n\n`;

// Generate recipe chapters
for (const category of categoryOrder) {
  if (recipesByCategory[category] && recipesByCategory[category].length > 0) {
    markdown += `# ${category}\n\n`;

    for (const recipe of recipesByCategory[category]) {
      markdown += `## ${recipe.title}\n\n`;

      // Meta info
      const meta = [];
      if (recipe.prep_time) meta.push(`**Prep:** ${recipe.prep_time}`);
      if (recipe.cooking_time) meta.push(`**Cook:** ${recipe.cooking_time}`);
      if (recipe.time_required) meta.push(`**Time:** ${recipe.time_required}`);
      if (recipe.yields) meta.push(`**Yields:** ${recipe.yields}`);
      if (recipe.servings) meta.push(`**Serves:** ${recipe.servings}`);
      if (recipe.oven_temp) meta.push(`**Oven:** ${recipe.oven_temp}`);
      if (recipe.source) meta.push(`**Source:** ${recipe.source}`);

      if (meta.length > 0) {
        markdown += meta.join(' | ') + '\n\n';
      }

      // Ingredients
      if (recipe.ingredients) {
        markdown += `### Ingredients\n\n`;
        if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
          for (const ing of recipe.ingredients) {
            markdown += `- ${ing}\n`;
          }
        } else if (typeof recipe.ingredients === 'object' && !Array.isArray(recipe.ingredients)) {
          for (const [section, items] of Object.entries(recipe.ingredients)) {
            if (Array.isArray(items) && items.length > 0) {
              const sectionName = section.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
              markdown += `\n**${sectionName}:**\n\n`;
              for (const ing of items) {
                markdown += `- ${ing}\n`;
              }
            }
          }
        }
        markdown += '\n';
      }

      // Instructions
      if (recipe.instructions) {
        markdown += `### Instructions\n\n`;
        if (Array.isArray(recipe.instructions) && recipe.instructions.length > 0) {
          let step = 1;
          for (const inst of recipe.instructions) {
            markdown += `${step}. ${inst}\n`;
            step++;
          }
        } else if (typeof recipe.instructions === 'string' && recipe.instructions.trim()) {
          markdown += `${recipe.instructions}\n`;
        } else if (typeof recipe.instructions === 'object' && !Array.isArray(recipe.instructions)) {
          for (const [section, steps] of Object.entries(recipe.instructions)) {
            if (Array.isArray(steps) && steps.length > 0) {
              const sectionName = section.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
              markdown += `\n**${sectionName}:**\n\n`;
              let step = 1;
              for (const inst of steps) {
                markdown += `${step}. ${inst}\n`;
                step++;
              }
            }
          }
        }
        markdown += '\n';
      }

      // Variations
      if (recipe.variations && recipe.variations.length > 0) {
        markdown += `### Variations\n\n`;
        for (const variation of recipe.variations) {
          markdown += `**${variation.name}:** ${variation.recipe}\n\n`;
        }
      }

      // Notes
      if (recipe.note) {
        markdown += `*Note: ${recipe.note}*\n\n`;
      }

      markdown += `---\n\n`;
    }
  }
}

// Add back matter
markdown += `# Index

`;

// Alphabetical index
const sortedRecipes = [...allRecipes].sort((a, b) =>
  a.title.toLowerCase().localeCompare(b.title.toLowerCase())
);

let currentLetter = '';
for (const recipe of sortedRecipes) {
  const firstLetter = recipe.title.charAt(0).toUpperCase();
  if (firstLetter !== currentLetter) {
    currentLetter = firstLetter;
    markdown += `\n## ${currentLetter}\n\n`;
  }
  const anchor = recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  markdown += `- [${recipe.title}](#${anchor}) *(${recipe._category})*\n`;
}

markdown += `
---

# About the Author

Dr. Lesa Mulligan is a physician and mother of four who has collected these recipes over a lifetime of family gatherings, holiday celebrations, and everyday meals made with love.

---

*Thank you for cooking with us!*

These recipes represent years of family traditions, holiday gatherings, and everyday meals made with love.

Visit us online: [carsonmulligan.github.io/moms-recipes](https://carsonmulligan.github.io/moms-recipes)
`;

// Write markdown file
const mdPath = path.join(__dirname, 'kindle-cookbook.md');
fs.writeFileSync(mdPath, markdown, 'utf8');

console.log(`
✅ Markdown file generated: kindle-cookbook.md

Total Recipes: ${allRecipes.length}

Next steps to create EPUB:
  pandoc kindle-cookbook.md -o kindle-cookbook.epub --toc --toc-depth=2

Then upload kindle-cookbook.epub to KDP (Kindle Direct Publishing).
KDP will automatically convert it to the Kindle format.
`);
