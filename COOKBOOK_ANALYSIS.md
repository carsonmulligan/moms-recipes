# Dr. Lesa Mulligan's Cookbook - Complete Analysis

## Overview
This is a comprehensive digital archive of 150 family recipes, transcribed from handwritten recipe cards and photographs.

## Generated Files

### 1. complete_cookbook.json (198 KB)
Complete raw data with all recipe information including source images and file paths.

### 2. cookbook_manuscript.json (121 KB)
Clean manuscript version with only recipe data (title, ingredients, instructions) suitable for publication.

### 3. cookbook_summary.txt
Human-readable index of all recipes organized by category.

## Recipe Distribution

| Category | Count | Percentage |
|----------|-------|------------|
| **Miscellaneous** | 50 | 33.3% |
| **Appetizers** | 22 | 14.7% |
| **Thanksgiving** | 18 | 12.0% |
| **Soups** | 11 | 7.3% |
| **Breakfast** | 9 | 6.0% |
| **Salads** | 9 | 6.0% |
| **Drinks** | 7 | 4.7% |
| **Entrees** | 6 | 4.0% |
| **Cakes** | 6 | 4.0% |
| **Vegetables & Sides** | 6 | 4.0% |
| **Desserts** | 5 | 3.3% |
| **Breads** | 1 | 0.7% |
| **TOTAL** | **150** | **100%** |

## Category Details

### Appetizers (22 recipes)
Dips, spreads, and finger foods including cheese-based appetizers, dipping oils, and entertaining suggestions.

Notable recipes:
- Bruschetta
- Spinach Artichoke Dip
- Deviled Eggs
- Cheese Fondue
- Texas Caviar

### Breakfast (9 recipes)
Morning meals and baked goods including pancakes, waffles, French toast, and pastries.

Notable recipes:
- Quiche
- French Toast Bake
- Cinnamon Roll Cake
- Lemon Blueberry Scones
- Waffles

### Entrees (6 recipes)
Main dishes including pasta, seafood, and sauces.

Subcategories:
- Pasta (2): Caprese Farfalle, Penne Primavera
- Sauces (2): Nonna's Sauce, Giblet Gravy
- Seafood (1): Salmon Tacos
- Other (1): Veggie Quesadillas

### Soups (11 recipes)
Hearty soups and stews for all seasons.

Notable recipes:
- Baked Potato Soup
- Chicken Noodle Soup
- Chicken Tortilla Soup
- Chili
- Roasted Red Pepper, Tomato & Smoked Gouda Bisque

### Salads (9 recipes)
Fresh salads including pasta salads, fruit salads, and vegetable-based sides.

Notable recipes:
- Marinated Vegetable Salad
- Cucumber Mango Salad
- Spaghetti Salad
- Candy Bar Apple Salad
- Macaroni Salad

### Vegetables & Sides (6 recipes)
Side dishes featuring vegetables and grains.

Notable recipes:
- Garlic Roasted Potato Wedges
- Green Beans & Cheese
- Baked Cheese Grits
- Twice Baked Sweet Potatoes with Ricotta Cheese
- Zucchini & Corn Skillet

### Breads (1 recipe)
- Bountiful Beer Bread Suggestions

### Cakes (6 recipes)
Cake recipes including dump cakes and traditional layer cakes.

Notable recipes:
- Hisae's Choc Cake
- Thunder Cake
- Apple Dump Cake
- Upside Down Pumpkin Cake
- Upside Down Blueberry Dump Cake

### Desserts (5 recipes)
Sweet treats excluding cakes (note: many more desserts are in Miscellaneous category).

Notable recipes:
- Apple Pie
- Creamy Coconut Cake
- No Bake Cookies
- Raspberry Prosecco Tulip
- Cinnamon Sugar Pie Crust Cookies

### Drinks (7 recipes)
Beverages including cocktails, hot drinks, and party punches.

Notable recipes:
- Egg Nog (with variations)
- Sangria
- Pumpkin Spiced Latte
- White Hot Chocolate
- Mango Breeze Margarita Mix

### Thanksgiving (18 recipes)
Holiday-specific recipes divided into desserts and savory dishes.

Desserts (7):
- Pumpkin Pie
- Pecan Pie
- Buttermilk Chess Pie
- Peanut Butter Balls (3 variations)
- No Bake Cookies
- Caramel Apple Crumble Pie

Savory (11):
- Thanksgiving Turkey Dressing
- Garlic Mashed Potatoes
- Sweet Potato Casserole
- Green Beans Amandine
- Corn Casserole
- Cranberry Salad
- Fruit Salad with Cannoli Cream
- Marinated Vegetable Salad
- Taffy Apple Salad
- Caramels

### Miscellaneous (50 recipes)
A diverse collection of recipes that don't fit neatly into other categories, including many cookies, desserts, and holiday treats.

Cookies & Bars (15):
- Snickerdoodles
- Cut Out Sugar Cookies with Royal Icing
- Frosted Butter Cutout Cookies
- Glazed Lemon Cookies
- Chocolate Cookies
- Chocolate Crackle Cookie
- Meringue Cookies
- Hedgehog Cookies
- Night Before Christmas Mice
- Chocolate Mice
- Chewy Gingerbread Cookies
- No Bake Chocolate Oatmeal Cookies
- Bourbon Salted Caramel Brownies
- English Toffee

Pies & Tarts (6):
- Banana Cream Pretzel Pie
- Banana Pineapple Vanilla Pudding Pie
- Lemon Pecan Slab Pie
- Nutella Tart with Toasted Hazelnut Crust
- S'more Pie
- Peach Crumble

Desserts & Puddings (8):
- Bread Pudding with Vanilla Sauce
- Nutella Bread Pudding
- Paula Deen's Banana Pudding
- Pumpkin Pudding
- Chocolate Cream Layered Dessert
- Gooey Butter Cake
- Knox Blox
- Lime Pretzel Jello

Pastries (4):
- Palmiers (Sugar)
- Pesto Palmiers
- Baklava Palmiers with Chocolate Pecan
- Cream Cheese Pastry

Holiday/Themed (6):
- Mini Strawberry Santas
- Witch's Hat Cookies
- Nutella Christmas Tree
- Cranberry Pecan Brie Cups

Breakfast/Brunch (3):
- German Pancakes in the Oven
- Lemon Blueberry Dutch Baby
- Sausage Quiche

Savory Dishes (8):
- Bourbon BBQ Pork Chops
- Caprese Stuffed Chicken with Roasted Balsamic Veggies
- Zucchini Lasagna
- Mac & Cheese
- Bruschetta
- Stuffed Mushrooms
- Creamy Parmesan Spinach Bake
- Sage and Onion Stuffing

Breads & Sides (2):
- Almond Tea Bread
- Cabbage Ramen Salad
- Tomato Relish

## Recipe Format Structure

Each recipe in the manuscript includes:

### Required Fields
- `title`: Recipe name
- `ingredients`: Array of ingredient strings
- `instructions`: String or array of instruction steps

### Optional Fields
- `servings`: Number of servings
- `yields`: What the recipe yields (e.g., "4 cups", "24 cookies")
- `prep_time`: Preparation time
- `cooking_time`: Cooking/baking time
- `time_required`: Total time required
- `oven_temp`: Oven temperature
- `source`: Where the recipe came from
- `note`: Special notes or tips
- `suggestions`: Array of serving suggestions (for suggestion-type recipes)
- `type`: Recipe type (e.g., "serving suggestions")

## Usage

### For Manuscript Publication
Use `cookbook_manuscript.json` - it contains clean recipe data without image references or file paths.

### For Recipe Website/App
Use `complete_cookbook.json` - it includes source image paths and file locations for linking to original recipe cards.

### For Quick Reference
Use `cookbook_summary.txt` - a simple text index of all recipes by category.

## Statistics

- **Total Recipes**: 150
- **Categories**: 12
- **Recipes with Multiple Images**: 95+ (recipes with front/back cards)
- **Original Format**: Handwritten recipe cards and photographs
- **Digital Format**: JSON
- **Live Website**: https://carsonmulligan.github.io/moms-recipes/

## Notes

- The large Miscellaneous category (50 recipes) contains recipes that were added later and not yet categorized into specific folders
- Some recipes appear in multiple categories (e.g., "No Bake Cookies" appears in both Desserts and Thanksgiving)
- Some Thanksgiving recipes reference the same base recipe but with variations (e.g., three Peanut Butter Ball variations)
- The website includes all 150 recipes with search and filter functionality
