#!/usr/bin/env python3
import json
from pathlib import Path

# Load the manuscript
base_dir = Path("/Users/carsonmulligan/Desktop/Workspace/apps/web/simple/moms-recipes")
with open(base_dir / "cookbook_manuscript.json", 'r') as f:
    manuscript = json.load(f)

# Generate text summary
output = []
output.append("=" * 80)
output.append(f"{manuscript['title']}")
output.append("=" * 80)
output.append(f"{manuscript['description']}")
output.append(f"Total Recipes: {manuscript['total_recipes']}")
output.append("=" * 80)
output.append("")

# Process each category
for category_name, category_data in manuscript['categories'].items():
    output.append("")
    output.append("=" * 80)
    output.append(f"{category_name.upper()} ({category_data['count']} recipes)")
    output.append("=" * 80)
    output.append("")

    # List all recipe titles in this category
    for i, recipe in enumerate(category_data['recipes'], 1):
        output.append(f"{i}. {recipe['title']}")

    output.append("")

# Save summary
summary_file = base_dir / "cookbook_summary.txt"
with open(summary_file, 'w') as f:
    f.write('\n'.join(output))

print(f"Summary generated successfully!")
print(f"Output saved to: {summary_file}")
print('\n'.join(output[:50]))  # Print first 50 lines
