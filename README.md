# Dr. Lesa Mulligan's Cookbook

A digital archive of 150 family recipes, lovingly transcribed from handwritten recipe cards into a searchable web application.

## View Online

**[https://carsonmulligan.github.io/moms-recipes/](https://carsonmulligan.github.io/moms-recipes/)**

Features:
- Search recipes by name
- Filter by category
- View original recipe card photos
- Full ingredient lists and instructions

## Recipe Categories (150 Total)

### Appetizers (24)
Balsamic & Basil Dipping Oil, Bruschetta, Cashew Crab Artichoke Dip, Cheese Dip with Beer, Cheese Dreams, Cheese Fondue, Cilantro & Olive Salsa, Cranberry Pecan Brie Cups, Cream Cheese Penguins, Deviled Eggs, Farmer's Medley Dip, Italian Dipping Oil, Key Lime Cheese Ball, Pecan Cheese Ball, Pepperoni Pizza Dip, Roasted Pumpkin Seed Hummus, Spice Roasted Honeynut Squash & Chickpeas, Spinach Artichoke Dip, Spinach Artichoke Pasta, Stuffed Celery, Stuffed Mushrooms, Sweet Almond Crackers, Sweet Pepper Jalapeno Jam, Texas Caviar

### Breakfast (11)
Cinnamon Cottage Cheese Pancakes, Cinnamon Crunch Bagels, Cinnamon Roll Cake, Cinnamon Rolls (Puff Pastry), French Toast Bake, German Pancakes, Lemon Blueberry Dutch Baby, Lemon Blueberry Scones, Pumpkin Breakfast Casserole, Quiche, Waffles

### Entrees (10)
Bourbon BBQ Pork Chops, Caprese Farfalle, Caprese Stuffed Chicken, Giblet Gravy, Nonna's Sauce, Penne Primavera, Salmon Tacos, Sausage Quiche, Veggie Quesadillas, Zucchini Lasagna

### Soups (11)
Baked Potato Soup, Chicken & Rice Soup, Chicken Noodle Soup, Chicken Tortilla Soup, Chili, Egg Drop Soup, Lentil Ham Soup, Potato Leek Soup, Roasted Red Pepper Tomato & Smoked Gouda Bisque, Shrimp & Sausage Stew, White Bean Soup with Greens & Turkey

### Salads (10)
Cabbage Ramen Salad, Candy Bar Apple Salad, Charred Corn & Chicken Cheese Salad, Cucumber Mango Salad, Cucumber Salad, Egg Salad, Lime Jello Salad, Macaroni Salad, Marinated Vegetable Salad, Spaghetti Salad

### Vegetables & Sides (10)
Baked Cheese Grits, Black Eyed Peas, Creamy Parmesan Spinach Bake, Garlic Roasted Potato Wedges, Green Beans & Cheese, Mac & Cheese, Sage and Onion Stuffing, Tomato Relish, Twice Baked Sweet Potatoes with Ricotta, Zucchini & Corn Skillet

### Cakes (7)
Apple Dump Cake, Chewy Gingerbread Cookies, Gooey Butter Cake, Hisae's Chocolate Cake, Thunder Cake, Upside Down Blueberry Dump Cake, Upside Down Pumpkin Cake

### Desserts & Cookies (30)
Apple Pie, Baklava Palmiers, Banana Cream Pretzel Pie, Banana Pineapple Pudding Pie, Bourbon Salted Caramel Brownies, Bread Pudding, Chocolate Almond Macaroons, Chocolate Cookies, Chocolate Crackle Cookie, Chocolate Cream Layered Dessert, Chocolate Mice, Cinnamon Sugar Pie Crust Cookies, Creamy Coconut Cake, Cut Out Sugar Cookies, English Toffee, Frosted Butter Cutout Cookies, Glazed Lemon Cookies, Hedgehog Cookies, Knox Blox, Lemon Pecan Slab Pie, Lime Pretzel Jello, Meringue Cookies, Mini Strawberry Santas, Night Before Christmas Mice, No Bake Chocolate Oatmeal Cookies, No Bake Cookies, Nutella Bread Pudding, Nutella Tart, Palmiers, Paula Deen's Banana Pudding, Peach Crumble, Pesto Palmiers, Pumpkin Pudding, Raspberry Prosecco Tulip, S'more Pie, Witch's Hat Cookies

### Drinks (7)
Egg Nog, Egg Nog Variations, Mango Breeze Margarita, Pumpkin Spiced Latte, Raspberry Prosecco Cocktail, Sangria, White Hot Chocolate

### Breads (4)
Almond Tea Bread, Bountiful Beer Bread, Cream Cheese Pastry, Nutella Christmas Tree

### Thanksgiving Favorites (18)
Buttermilk Chess Pie, Caramel Apple Crumble Pie, Caramels, Corn Casserole, Cranberry Salad, Fruit Salad with Cannoli Cream, Garlic Mashed Potatoes, Green Beans Amandine, Marinated Vegetable Salad, No Bake Cookies, Peanut Butter Ball Dip, Peanut Butter Balls, Pecan Pie, Pumpkin Pie, Sweet Potato Casserole, Taffy Apple Salad, Thanksgiving Turkey Dressing

## Project Structure

```
├── index.html           # Recipe viewer with search & filters
├── appetizers/          # Appetizer recipes & images
├── breads/              # Bread recipes & images
├── breakfast/           # Breakfast recipes & images
├── cakes/               # Cake recipes & images
├── desserts/            # Dessert recipes & images
├── drinks/              # Beverage recipes & images
├── entrees/             # Main dish recipes & images
│   ├── pasta/
│   ├── sauces/
│   └── seafood/
├── salads/              # Salad recipes & images
├── soups/               # Soup recipes & images
├── vegetables/          # Side dish recipes & images
├── thanksgiving/        # Thanksgiving recipes & images
└── misc/                # Additional recipes
```

Each recipe includes:
- Original recipe card photo (JPG)
- JSON file with structured data (title, ingredients, instructions)

## Tech Stack

- Pure HTML, CSS, and JavaScript
- No build tools or frameworks required
- Hosted on GitHub Pages

## Contributing

To add new recipes:
1. Take photos of the recipe card
2. Convert to JPG format
3. Place in appropriate category folder
4. Create JSON file with transcription
5. Add entry to index.html

## License

Family recipes shared with love.
