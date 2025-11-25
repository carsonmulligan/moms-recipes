# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a recipe image archive containing family recipes as photographs, with JSON transcriptions for easy viewing. The cookbook is titled "Dr. Lesa Mulligan's Cookbook".

## Structure

- `appetizers/` - Appetizer recipes
- `breads/` - Bread recipes
- `breakfast/` - Breakfast recipes
- `cakes/` - Cake and cookie recipes (6 JSON transcriptions)
- `desserts/` - Dessert recipes (5 JSON transcriptions)
- `drinks/` - Beverage recipes (7 JSON transcriptions)
- `entrees/` - Main dish recipes
  - `pasta/` - Pasta recipes (2 JSON transcriptions)
  - `sauces/` - Sauce recipes (2 JSON transcriptions)
  - `seafood/` - Seafood recipes (1 JSON transcription)
  - `veggie-quesadillas.json`
- `salads/` - Salad recipes (9 JSON transcriptions)
- `soups/` - Soup recipes (11 JSON transcriptions)
- `vegetables/` - Vegetable side dish recipes
- `home/` - Homepage assets
- `thanksgiving/` - Original thanksgiving recipe folders

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

## Transcription Progress

### Completed
- cakes/ - 6 recipes
- desserts/ - 5 recipes
- drinks/ - 7 recipes
- entrees/ - 6 recipes (veggie-quesadillas, 2 pasta, 2 sauces, 1 seafood)
- salads/ - 9 recipes
- soups/ - 11 recipes

### Needs Transcription
- appetizers/
- breads/
- breakfast/
- vegetables/

## Known Issues

### Image Size Limitation
When processing many images in a single conversation, Claude's API has a limit on image dimensions (max 2000 pixels per dimension for many-image requests). If you encounter errors like:
```
"At least one of the image dimensions exceed max allowed size for many-image requests: 2000 pixels"
```

**Workaround:** Start a new conversation to clear the image context, or process images in smaller batches.

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

## Notes

- Original images were in HEIC format, now converted to JPG
- Images are named with original iPhone photo IDs (IMG_XXXX)
- To add new recipes, organize images into appropriate category folders
- Use `index.html` to view recipes via GitHub Pages
