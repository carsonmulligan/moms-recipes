# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**Dr. Lesa Mulligan's Cookbook** - A digital archive of 150 family recipes, transcribed from handwritten recipe cards and photographs into a searchable web application.

## Live Site

Visit: https://carsonmulligan.github.io/moms-recipes/

## Structure

```
├── index.html           # Main recipe viewer with search & category filters
├── appetizers/          # 24 appetizer recipes
├── breads/              # 4 bread recipes
├── breakfast/           # 11 breakfast recipes
├── cakes/               # 7 cake recipes
├── desserts/            # 30 dessert recipes (including cookies & candy)
├── drinks/              # 7 beverage recipes
├── entrees/             # 10 main dish recipes
│   ├── pasta/           # Pasta recipes
│   ├── sauces/          # Sauce recipes
│   └── seafood/         # Seafood recipes
├── salads/              # 10 salad recipes
├── soups/               # 11 soup recipes
├── vegetables/          # 10 vegetable & side dish recipes
├── thanksgiving/        # 18 thanksgiving-specific recipes
│   ├── desserts/
│   └── savory-tings/
├── misc/                # Additional recipes
└── home/                # Homepage assets
```

## Photo Convention for Two-Sided Recipe Cards

When photographing recipe cards that have content on both sides:
1. **First photo**: Front of the card (usually has title and ingredients)
2. **Second photo**: Back of the card (usually has instructions)
3. **Third photo**: Back of the card WITH TWO FINGERS visible in the frame

The **two fingers** indicate this is the BACK side of a two-sided card. This helps Claude identify which images belong together as a single recipe when transcribing.

Example sequence:
- `IMG_7495.jpg` - Front of "Baked Potato Soup" card
- `IMG_7496.jpg` - Back of card (instructions)
- `IMG_7497.jpg` - Back of card with two fingers (confirms this is the back)

## Transcription Status

**COMPLETE** - All 150 recipes have been transcribed!

| Category | Recipes |
|----------|---------|
| Appetizers | 24 |
| Breakfast | 11 |
| Entrees | 10 |
| Soups | 11 |
| Salads | 10 |
| Vegetables & Sides | 10 |
| Cakes | 7 |
| Desserts | 30 |
| Drinks | 7 |
| Breads | 4 |
| Thanksgiving | 18 |
| **Total** | **150** |

## JSON Recipe Format

Each recipe JSON file follows this structure:
```json
{
  "title": "Recipe Name",
  "source_images": ["IMG_XXXX.jpg"],
  "ingredients": ["..."],
  "instructions": ["..."]
}
```

Some recipes include additional fields:
- `source`: Attribution for the recipe
- `servings`: Number of servings
- `time_required`: Cooking/prep time
- `note`: Special instructions or tips

## Known Issues

### Image Size Limitation
When processing many images in a single conversation, Claude's API has a limit on image dimensions (max 2000 pixels per dimension for many-image requests).

**Workaround:** Start a new conversation to clear the image context, or process images in smaller batches.

## Adding New Recipes

1. Take photos of the recipe card (use two-finger convention for two-sided cards)
2. Convert HEIC to JPG if needed
3. Place images in appropriate category folder
4. Create JSON file with recipe transcription
5. Add entry to `index.html` in the appropriate `<optgroup>`

## Notes

- All images are in JPG format (converted from iPhone HEIC)
- Images use original iPhone photo IDs (IMG_XXXX.jpg)
- Website hosted via GitHub Pages
