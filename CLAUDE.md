# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a recipe image archive containing family recipes as photographs, with JSON transcriptions for easy viewing.

## Structure

- `appetizers/` - Appetizer recipes
- `breads/` - Bread recipes
- `breakfast/` - Breakfast recipes
- `cakes/` - Cake and cookie recipes (12 images, 6 JSON transcriptions)
- `desserts/` - Dessert recipes (11 images, 5 JSON transcriptions)
- `drinks/` - Beverage recipes (15 images, 7 JSON transcriptions)
- `entrees/` - Main dish recipes
  - `pasta/` - Pasta recipes (4 images, needs transcription)
  - `sauces/` - Sauce recipes (2 images, needs transcription)
  - `seafood/` - Seafood recipes (1 image, needs transcription)
- `salads/` - Salad recipes (15 images, needs transcription)
- `soups/` - Soup recipes (29 images, needs transcription)
- `vegetables/` - Vegetable side dish recipes
- `home/` - Homepage assets
- `thanksgiving/` - Original thanksgiving recipe folders

## Transcription Progress

### Completed
- cakes/ - 6 recipes transcribed
- desserts/ - 5 recipes transcribed
- drinks/ - 7 recipes transcribed
- entrees/veggie-quesadillas.json - transcribed

### Needs Transcription
- entrees/pasta/ (4 images)
- entrees/sauces/ (2 images)
- entrees/seafood/ (1 image)
- salads/ (15 images)
- soups/ (29 images)
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
