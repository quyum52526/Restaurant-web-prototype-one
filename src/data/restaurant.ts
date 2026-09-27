/**
 * Single source of truth for restaurant content.
 *
 * Everything here is demo content for the prototype: the restaurant name,
 * address, prices, ratings, reviews and chef bios are placeholders to be
 * replaced with the client's real data. Images are Unsplash CDN URLs; every
 * image is rendered through <SafeImage>, which falls back to an inline
 * illustration if a URL ever fails to load.
 */

export type MenuCategory = "Starters" | "Mains" | "Desserts" | "Drinks";

export type DietaryTag = "Signature" | "Vegetarian" | "Gluten-Free" | "Seafood" | "Spicy";

export type Dish = {
  id: string;
  name: string;
  category: MenuCategory;
  subtitle: string;
  price: number;
  rating: number;
  calories: number;
  /** Minutes from order to pass. */
  prepTime: number;
  description: string;
  chefNote: string;
  ingredients: string[];
  tags: DietaryTag[];
  /** Hex colour tweened into the hero backdrop when this dish is active. */
  bgAccent: string;
  image: string;
};

export type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number;
  tags: DietaryTag[];
  image?: string;
};

const unsplash = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const RESTAURANT = {
  name: "Ai Restaurant",
  tagline: "Fire, Field & Sea",
  logo: "/logo.png",
  favicon: "/favicon.png",
  phone: "+1 (555) 014-2290",
  email: "hello@ai-restaurant.example",
  address: {
    line1: "128 Harbour Lane",
    line2: "Old Town, Riverside 10021",
  },
  mapsQuery: "128 Harbour Lane Old Town",
  instagram: "@ai.restaurant",
};

export const HOURS = [
  { days: "Monday", time: "Closed" },
  { days: "Tue – Thu", time: "5:30 PM – 10:30 PM" },
  { days: "Fri – Sat", time: "5:00 PM – 11:30 PM" },
  { days: "Sunday", time: "12:00 PM – 9:00 PM" },
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Reservations" },
  { href: "/about", label: "Story" },
  { href: "/contact", label: "Contact" },
] as const;

export const DISHES: Dish[] = [
  {
    id: "ribeye",
    name: "Grilled Ribeye Steak",
    category: "Mains",
    subtitle: "Dry-aged 45 days, charred over oak embers",
    price: 58,
    rating: 4.9,
    calories: 820,
    prepTime: 25,
    description:
      "A 400g bone-in ribeye, dry-aged in-house and finished over glowing oak. Served with smoked bone-marrow butter, blistered shallots and a glossy red-wine jus.",
    chefNote:
      "We rest every steak for exactly as long as it cooked. Ask for medium-rare — the marbling was made for it.",
    ingredients: ["Bone-in ribeye", "Bone-marrow butter", "Banana shallots", "Red-wine jus", "Flaky sea salt", "Thyme"],
    tags: ["Signature", "Gluten-Free"],
    bgAccent: "#6b4423",
    image: unsplash("photo-1600891964092-4316c288032e"),
  },
  {
    id: "salmon",
    name: "Herb Butter Salmon",
    category: "Mains",
    subtitle: "Crisp skin, lemon-dill beurre blanc",
    price: 42,
    rating: 4.8,
    calories: 610,
    prepTime: 18,
    description:
      "Line-caught salmon pan-roasted skin-side down until glass-crisp, basted in herb butter and plated over charred tenderstem and a bright lemon-dill beurre blanc.",
    chefNote:
      "The skin is the best part. We press it flat for the first minute so every millimetre crisps evenly.",
    ingredients: ["Atlantic salmon", "Cultured butter", "Dill & chives", "Tenderstem broccoli", "Meyer lemon", "Capers"],
    tags: ["Seafood", "Gluten-Free"],
    bgAccent: "#8a5a1c",
    image: unsplash("photo-1467003909585-2f8a72700288"),
  },
  {
    id: "risotto",
    name: "Truffle Mushroom Risotto",
    category: "Mains",
    subtitle: "Carnaroli, wild mushrooms, shaved black truffle",
    price: 38,
    rating: 4.7,
    calories: 690,
    prepTime: 22,
    description:
      "Aged Carnaroli rice stirred slowly with roasted mushroom stock, finished with 36-month Parmigiano, cultured butter and black truffle shaved tableside.",
    chefNote:
      "We never rush risotto. Twenty minutes of patience is what gives it that wave-like, all'onda texture.",
    ingredients: ["Carnaroli rice", "Porcini & chanterelle", "Black truffle", "Parmigiano Reggiano", "Dry white wine", "Cultured butter"],
    tags: ["Vegetarian", "Gluten-Free"],
    bgAccent: "#5a4a2e",
    image: unsplash("photo-1476124369491-e7addf5db371"),
  },
  {
    id: "pizza",
    name: "Woodfired Neapolitan Pizza",
    category: "Mains",
    subtitle: "72-hour dough, San Marzano, fior di latte",
    price: 26,
    rating: 4.8,
    calories: 760,
    prepTime: 12,
    description:
      "A slow-fermented dough blistered for ninety seconds at 480°C, topped with hand-crushed San Marzano tomatoes, fior di latte, basil and Ligurian olive oil.",
    chefNote:
      "Look for the leopard spots on the crust — that's the sign the oven and the dough agreed with each other.",
    ingredients: ["72-hour dough", "San Marzano tomato", "Fior di latte", "Fresh basil", "Extra-virgin olive oil", "Sea salt"],
    tags: ["Vegetarian"],
    bgAccent: "#7a5220",
    image: unsplash("photo-1574071318508-1cdbab80d002"),
  },
  {
    id: "scallops",
    name: "Pan-Seared Scallops",
    category: "Starters",
    subtitle: "Hand-dived, cauliflower velouté, brown butter",
    price: 32,
    rating: 4.9,
    calories: 380,
    prepTime: 14,
    description:
      "Three hand-dived king scallops seared to a deep caramel crust, served on silky cauliflower velouté with hazelnut brown butter and golden raisins.",
    chefNote:
      "Ninety seconds a side in a smoking-hot pan. Any longer and you lose the sweetness of the sea.",
    ingredients: ["King scallops", "Cauliflower", "Hazelnut brown butter", "Golden raisins", "Micro herbs", "Lemon oil"],
    tags: ["Seafood", "Signature", "Gluten-Free"],
    bgAccent: "#2f4b5a",
    image: unsplash("photo-1532636875304-0c89119d9b4d"),
  },
  {
    id: "panna-cotta",
    name: "Matcha Panna Cotta",
    category: "Desserts",
    subtitle: "Ceremonial matcha, yuzu gel, black sesame crumble",
    price: 16,
    rating: 4.8,
    calories: 340,
    prepTime: 8,
    description:
      "A barely-set panna cotta infused with ceremonial Uji matcha, crowned with sharp yuzu gel, black sesame crumble and a few fresh berries.",
    chefNote:
      "It should tremble when the plate lands on the table. That wobble is the whole point.",
    ingredients: ["Ceremonial matcha", "Double cream", "Yuzu", "Black sesame", "Vanilla bean", "Seasonal berries"],
    tags: ["Vegetarian", "Gluten-Free"],
    bgAccent: "#4b6a2f",
    image: unsplash("photo-1488477181946-6428a0291777"),
  },
];

const dishToMenuItem = (dish: Dish): MenuItem => ({
  id: dish.id,
  name: dish.name,
  category: dish.category,
  description: dish.subtitle,
  price: dish.price,
  tags: dish.tags,
  image: dish.image,
});

export const MENU: MenuItem[] = [
  ...DISHES.map(dishToMenuItem),
  { id: "burrata", name: "Burrata & Heirloom Tomato", category: "Starters", description: "Puglian burrata, heirloom tomatoes, aged balsamic, basil oil", price: 19, tags: ["Vegetarian", "Gluten-Free"] },
  { id: "tartare", name: "Wagyu Beef Tartare", category: "Starters", description: "Hand-cut wagyu, cured yolk, capers, charred sourdough", price: 24, tags: ["Signature"] },
  { id: "bisque", name: "Lobster Bisque", category: "Starters", description: "Cognac-flamed lobster, crème fraîche, chive oil", price: 21, tags: ["Seafood"] },
  { id: "duck", name: "Duck à l'Orange", category: "Mains", description: "Honey-lacquered duck breast, blood orange, confit leg croquette", price: 46, tags: ["Signature"] },
  { id: "arrabbiata", name: "Nduja Arrabbiata", category: "Mains", description: "Bronze-cut rigatoni, spicy nduja, San Marzano, pecorino", price: 28, tags: ["Spicy"] },
  { id: "fondant", name: "Dark Chocolate Fondant", category: "Desserts", description: "70% Valrhona, molten centre, salted caramel ice cream", price: 15, tags: ["Vegetarian"] },
  { id: "tart", name: "Amalfi Lemon Tart", category: "Desserts", description: "Buttery pâte sucrée, torched Italian meringue", price: 14, tags: ["Vegetarian"] },
  { id: "old-fashioned", name: "Smoked Old Fashioned", category: "Drinks", description: "Bourbon, demerara, orange bitters, cherrywood smoke", price: 18, tags: ["Signature"] },
  { id: "yuzu-spritz", name: "Yuzu Spritz", category: "Drinks", description: "Yuzu, elderflower, prosecco, soda", price: 15, tags: [] },
  { id: "chili-margarita", name: "Chili Mango Margarita", category: "Drinks", description: "Reposado tequila, mango, bird's-eye chili, tajín rim", price: 16, tags: ["Spicy"] },
  { id: "matcha-latte", name: "Iced Matcha Latte", category: "Drinks", description: "Ceremonial matcha, oat milk, wildflower honey", price: 8, tags: ["Vegetarian"] },
  { id: "pairing", name: "Sommelier Wine Pairing", category: "Drinks", description: "Four glasses chosen to match your courses", price: 65, tags: ["Signature"] },
];

export const MENU_CATEGORIES: MenuCategory[] = ["Starters", "Mains", "Desserts", "Drinks"];

export const SIGNATURE_CATEGORIES = [
  {
    title: "Starters",
    blurb: "Small plates built for sharing — seared, cured and raw.",
    image: unsplash("photo-1540189549336-e6e99c3679fe", 1000),
    href: "/menu?category=Starters",
  },
  {
    title: "Mains",
    blurb: "Live-fire cooking, dry-aged cuts and the day's catch.",
    image: unsplash("photo-1414235077428-338989a2e8c0", 1200),
    href: "/menu?category=Mains",
  },
  {
    title: "Drinks",
    blurb: "Seasonal cocktails and a cellar of 300 labels.",
    image: unsplash("photo-1514362545857-3bc16c4c7d1b", 1000),
    href: "/menu?category=Drinks",
  },
];

export const REVIEWS = [
  { id: 1, name: "Amelia R.", role: "Food writer", rating: 5, quote: "The ribeye alone is worth the trip. Smoky, rested to perfection, and the bone-marrow butter is dangerous." },
  { id: 2, name: "Daniel K.", role: "Anniversary dinner", rating: 5, quote: "Service felt personal without ever being stiff. They remembered our anniversary and surprised us with dessert." },
  { id: 3, name: "Sofia M.", role: "Regular guest", rating: 5, quote: "I have tried the risotto on four visits and it has been flawless every single time. Consistency is rare." },
  { id: 4, name: "James T.", role: "Business lunch", rating: 4, quote: "Beautiful room, quiet enough to talk, and the scallops were the best I've had outside the coast." },
  { id: 5, name: "Priya S.", role: "Birthday party of 8", rating: 5, quote: "They handled a big table and three dietary needs without a single hiccup. The matcha panna cotta stole the show." },
];

export const CHEFS = [
  {
    name: "Elena Marchetti",
    role: "Executive Chef",
    bio: "Trained in Emilia-Romagna and Lyon, Elena spent a decade in Michelin kitchens before opening Ai Restaurant around a single wood-fired hearth.",
    image: unsplash("photo-1577219491135-ce391730fb2c", 700),
  },
  {
    name: "Kenji Watanabe",
    role: "Pastry Chef",
    bio: "Kenji blends Japanese restraint with French technique — his desserts are built on seasonal fruit, tea and precise textures.",
    image: unsplash("photo-1583394293214-28ded15ee548", 700),
  },
  {
    name: "Marcus Hale",
    role: "Head Sommelier",
    bio: "Marcus curates our 300-label cellar with a focus on small growers and natural winemaking from Europe and the New World.",
    image: unsplash("photo-1600565193348-f74bd3c7ccdf", 700),
  },
];

export const PHILOSOPHY = [
  { title: "Live Fire", text: "Every main course touches our oak-fired hearth. Smoke is our seasoning, patience our technique." },
  { title: "Close to Source", text: "We work with twelve farms and two fishing boats within 150 km, and the menu follows what they bring." },
  { title: "Nothing Wasted", text: "Bones become stock, trimmings become staff meals and peels become syrups for the bar." },
];

export const GALLERY = [
  unsplash("photo-1517248135467-4c7edcad34c4", 1000),
  unsplash("photo-1555396273-367ea4eb4db5", 800),
  unsplash("photo-1414235077428-338989a2e8c0", 800),
  unsplash("photo-1559339352-11d035aa65de", 800),
  unsplash("photo-1504674900247-0877df9cc836", 1000),
];

export const INSTAGRAM = [
  unsplash("photo-1546069901-ba9599a7e63c", 400),
  unsplash("photo-1565299624946-b28f40a0ae38", 400),
  unsplash("photo-1512621776951-a57141f2eefd", 400),
  unsplash("photo-1504674900247-0877df9cc836", 400),
  unsplash("photo-1540189549336-e6e99c3679fe", 400),
  unsplash("photo-1476224203421-9ac39bcb3327", 400),
];

export const TIME_SLOTS = [
  "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
  "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM",
];

export const SEATING_OPTIONS = [
  { id: "dining-room", label: "Dining Room", detail: "Warm, candle-lit main room" },
  { id: "chefs-counter", label: "Chef's Counter", detail: "Front-row seats at the hearth" },
  { id: "terrace", label: "Terrace", detail: "Open-air, weather permitting" },
] as const;

export const OCCASIONS = ["None", "Birthday", "Anniversary", "Business", "Date Night", "Celebration"];
