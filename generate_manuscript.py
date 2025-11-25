#!/usr/bin/env python3
import json
from pathlib import Path

# Load the compiled cookbook
base_dir = Path("/Users/carsonmulligan/Desktop/Workspace/apps/web/simple/moms-recipes")
with open(base_dir / "complete_cookbook.json", 'r') as f:
    cookbook = json.load(f)

# Generate manuscript structure
manuscript = {
    "title": cookbook["title"],
    "description": cookbook["description"],
    "total_recipes": cookbook["total_recipes"],
    "categories": {}
}

# Process each category
for category_name, recipes in cookbook['categories'].items():
    category_data = {
        "count": len(recipes),
        "recipes": []
    }

    for recipe in recipes:
        recipe_entry = {
            "title": recipe.get("title", "Untitled"),
            "ingredients": recipe.get("ingredients", []),
            "instructions": recipe.get("instructions", [])
        }

        # Add optional fields if present
        if "servings" in recipe:
            recipe_entry["servings"] = recipe["servings"]
        if "source" in recipe:
            recipe_entry["source"] = recipe["source"]
        if "prep_time" in recipe:
            recipe_entry["prep_time"] = recipe["prep_time"]
        if "cooking_time" in recipe:
            recipe_entry["cooking_time"] = recipe["cooking_time"]
        if "time_required" in recipe:
            recipe_entry["time_required"] = recipe["time_required"]
        if "note" in recipe:
            recipe_entry["note"] = recipe["note"]
        if "yields" in recipe:
            recipe_entry["yields"] = recipe["yields"]
        if "oven_temp" in recipe:
            recipe_entry["oven_temp"] = recipe["oven_temp"]
        if "suggestions" in recipe:
            recipe_entry["suggestions"] = recipe["suggestions"]
        if "type" in recipe:
            recipe_entry["type"] = recipe["type"]

        category_data["recipes"].append(recipe_entry)

    manuscript["categories"][category_name] = category_data

# Save manuscript
output_file = base_dir / "cookbook_manuscript.json"
with open(output_file, 'w') as f:
    json.dump(manuscript, f, indent=2)

print(f"Manuscript generated successfully!")
print(f"Output saved to: {output_file}")
print(f"\nManuscript Summary:")
print(f"Total Recipes: {manuscript['total_recipes']}")
print(f"\nCategory Breakdown:")
for category, data in manuscript['categories'].items():
    print(f"  {category}: {data['count']} recipes")
