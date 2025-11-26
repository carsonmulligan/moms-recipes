# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**Dr. Lesa Mulligan's Cookbook** - A digital archive of 140 family recipes, transcribed from handwritten recipe cards into a searchable web application and publishable cookbook formats.

## Live Site

https://carsonmulligan.github.io/moms-recipes/

## Project Structure

```
moms-recipes/
├── index.html              # Main recipe viewer (search & category filters)
├── CLAUDE.md               # This file - LLM instructions
├── README.md               # Project documentation
│
├── scripts/                # Build & generation scripts
│   ├── generate-kdp-manuscript.js   # KDP print PDF generator
│   ├── generate-kindle-epub.js      # Kindle ebook generator
│   ├── generate-gallery.js          # Image gallery generator
│   └── *.py                         # Legacy Python scripts
│
├── output/                 # Generated files (gitignored for large files)
│   ├── kdp-manuscript.pdf           # Print-ready PDF (8.25x11)
│   ├── kdp-manuscript.html          # HTML source for PDF
│   ├── kindle-cookbook.epub         # Kindle ebook
│   └── image-gallery.html           # Recipe card gallery
│
├── docs/                   # Documentation & marketing
│   ├── book-description.txt         # KDP book description
│   ├── cover-image-prompt.txt       # AI cover image prompt
│   └── *.md                         # Strategy & analysis docs
│
├── home/                   # Homepage assets
│
└── [category]/             # Recipe folders (each contains .json + .jpg files)
    ├── appetizers/         # 18 recipes
    ├── breakfast/          # 12 recipes
    ├── entrees/            # 10 recipes
    ├── soups/              # 11 recipes
    ├── salads/             # 10 recipes
    ├── vegetables/         # 9 recipes
    ├── breads/             # 1 recipe
    ├── cakes/              # 7 recipes
    ├── desserts/           # 38 recipes
    ├── drinks/             # 6 recipes
    └── thanksgiving/       # 18 recipes (desserts/ & savory-tings/)
```

## Recipe JSON Schema

Each recipe is a JSON file with this structure:

```json
{
  "title": "Recipe Name",
  "source_images": ["IMG_XXXX.jpg", "IMG_XXXX.jpg"],
  "ingredients": {
    "section_name": ["ingredient 1", "ingredient 2"]
  },
  "instructions": "Step-by-step instructions as string or array",
  "yields": "4 servings",
  "servings": 8,
  "oven_temp": "350°",
  "prep_time": "15 minutes",
  "cooking_time": "30 minutes",
  "source": "Grandma Smith",
  "note": "Optional tips"
}
```

**Important:** The `ingredients` field can be:
- An object with named sections: `{"crust": [...], "filling": [...]}`
- A simple array: `["item1", "item2"]`

## Common Tasks

### Regenerate KDP Print Manuscript
```bash
cd scripts && node generate-kdp-manuscript.js
weasyprint ../output/kdp-manuscript.html ../output/kdp-manuscript.pdf
```

### Regenerate Kindle EPUB
```bash
cd scripts && node generate-kindle-epub.js
pandoc ../output/kindle-cookbook.md -o ../output/kindle-cookbook.epub --toc
```

### Add a New Recipe
1. Place images in appropriate category folder
2. Create `recipe-name.json` with schema above
3. Images should be named `IMG_XXXX.jpg` (iPhone convention)
4. Run generation scripts to update outputs

### Photo Convention (Two-Sided Cards)
1. First photo: Front of card (title/ingredients)
2. Second photo: Back of card (instructions)
3. Third photo: Back with TWO FINGERS visible (confirms back side)

## Current Stats

| Category | Count |
|----------|-------|
| Appetizers | 18 |
| Breakfast | 12 |
| Entrees | 10 |
| Soups | 11 |
| Salads | 10 |
| Vegetables | 9 |
| Breads | 1 |
| Cakes | 7 |
| Desserts | 38 |
| Drinks | 6 |
| Thanksgiving | 18 |
| **Total** | **140** |

## Notes

- All images are JPG (converted from iPhone HEIC)
- Website hosted via GitHub Pages
- KDP manuscript is 8.25" x 11" format
- Medical disclaimer included in all outputs
