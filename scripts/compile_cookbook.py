#!/usr/bin/env python3
import json
import os
from pathlib import Path

# Base directory
base_dir = Path("/Users/carsonmulligan/Desktop/Workspace/apps/web/simple/moms-recipes")

# Define category structure
categories = {
    "Appetizers": "appetizers",
    "Breakfast": "breakfast",
    "Entrees": "entrees",
    "Soups": "soups",
    "Salads": "salads",
    "Vegetables & Sides": "vegetables",
    "Breads": "breads",
    "Cakes": "cakes",
    "Desserts": "desserts",
    "Drinks": "drinks",
    "Thanksgiving": "thanksgiving",
    "Miscellaneous": "misc"
}

cookbook = {
    "title": "Dr. Lesa Mulligan's Cookbook",
    "description": "A digital archive of 150 family recipes, transcribed from handwritten recipe cards",
    "categories": {}
}

# Read all JSON files by category
for category_name, folder_name in categories.items():
    category_path = base_dir / folder_name
    recipes = []

    if category_path.exists():
        # Find all JSON files recursively
        for json_file in category_path.rglob("*.json"):
            try:
                with open(json_file, 'r') as f:
                    recipe_data = json.load(f)
                    recipe_data['file_path'] = str(json_file.relative_to(base_dir))
                    recipes.append(recipe_data)
            except Exception as e:
                print(f"Error reading {json_file}: {e}")

    # Sort recipes by title
    recipes.sort(key=lambda x: x.get('title', ''))
    cookbook['categories'][category_name] = recipes

# Calculate total recipes
total_recipes = sum(len(recipes) for recipes in cookbook['categories'].values())
cookbook['total_recipes'] = total_recipes

# Write to output file
output_file = base_dir / "complete_cookbook.json"
with open(output_file, 'w') as f:
    json.dump(cookbook, f, indent=2)

print(f"Cookbook compiled successfully!")
print(f"Total recipes: {total_recipes}")
print(f"\nRecipe count by category:")
for category, recipes in cookbook['categories'].items():
    print(f"  {category}: {len(recipes)}")
print(f"\nOutput saved to: {output_file}")
