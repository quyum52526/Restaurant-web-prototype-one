/**
 * Single source of truth for restaurant content.
 *
 * Official data: the contact details in RESTAURANT and the dish names,
 * prices (BDT), prep times and calories in DISHES. Still demo content:
 * ratings, reviews and chef bios. Dish photos live in public/dishes/; every
 * image renders through <SafeImage>, which falls back to an inline
 * illustration if a file is missing.
 */

export type MenuCategory = "Mains" | "Grills" | "Seafood" | "Desserts";

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
  /** Also the WhatsApp number. */
  phone: "+8801962434901",
  email: "quyum52526@gmail.com",
  address: {
    line1: "East Nasirabad",
    line2: "Chittagong, Bangladesh",
  },
  mapsQuery: "East Nasirabad, Chittagong, Bangladesh",
  instagram: "@ai.restaurant",
};

/** Ready-made contact links, so every page dials and messages the same number. */
export const CONTACT_LINKS = {
  tel: `tel:${RESTAURANT.phone}`,
  whatsapp: `https://wa.me/${RESTAURANT.phone.replace(/\D/g, "")}`,
  mailto: `mailto:${RESTAURANT.email}`,
  maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(RESTAURANT.mapsQuery)}`,
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

/** Prices are in Bangladeshi Taka, e.g. formatPrice(1250) -> "৳1,250". */
export const formatPrice = (amount: number) => `৳${amount.toLocaleString("en-US")}`;

const dishImage = (file: string) => `/dishes/${file}`;

export const DISHES: Dish[] = [
  {
    id: "biryani",
    name: "Slow-Cooked Beef Biryani",
    category: "Mains",
    subtitle: "Tender beef, aged basmati, saffron and fried onions",
    price: 550,
    rating: 4.9,
    calories: 850,
    prepTime: 25,
    description:
      "Bone-in beef slow-cooked with warm spices, layered with fragrant aged basmati and saffron milk, then sealed and steamed dum-style. Served with borhani and a boiled egg.",
    chefNote:
      "The pot stays sealed until it reaches your table, so the first thing you get is the steam and the saffron.",
    ingredients: ["Beef", "Aged basmati", "Saffron", "Ghee", "Fried onions", "Whole spices"],
    tags: ["Signature", "Spicy"],
    bgAccent: "#7a5220",
    image: dishImage("Beef_biryani_in_serving_bowl.png"),
  },
  {
    id: "tiger-prawns",
    name: "Butter Garlic Tiger Prawns",
    category: "Seafood",
    subtitle: "Jumbo prawns in sizzling garlic butter",
    price: 850,
    rating: 4.8,
    calories: 520,
    prepTime: 20,
    description:
      "Jumbo tiger prawns seared hot and tossed in garlic butter with chilli flakes, lemon and parsley. Served with toasted bread to mop up every drop.",
    chefNote:
      "We cook the prawns shell-on for the first minute. It keeps them juicy and gives the butter a deeper flavour.",
    ingredients: ["Tiger prawns", "Butter", "Garlic", "Chilli flakes", "Lemon", "Parsley"],
    tags: ["Seafood", "Gluten-Free"],
    bgAccent: "#8a5a1c",
    image: dishImage("Butter_garlic_tiger_prawns.png"),
  },
  {
    id: "alfredo",
    name: "Fettuccine Alfredo Pasta",
    category: "Mains",
    subtitle: "Silky parmesan cream sauce, cracked black pepper",
    price: 620,
    rating: 4.7,
    calories: 680,
    prepTime: 18,
    description:
      "Ribbons of fettuccine tossed in a rich cream sauce with butter and aged parmesan, finished with cracked black pepper and fresh parsley.",
    chefNote:
      "The sauce is finished in the pan with a splash of pasta water. That's what makes it cling instead of pool.",
    ingredients: ["Fettuccine", "Fresh cream", "Parmesan", "Butter", "Garlic", "Black pepper"],
    tags: ["Vegetarian"],
    bgAccent: "#6b5a34",
    image: dishImage("Fettuccine_Alfredo_pasta_in_bowl.png"),
  },
  {
    id: "lamb-chops",
    name: "Grilled Lamb Chops with Chimichurri",
    category: "Grills",
    subtitle: "Flame-grilled chops, bright herb chimichurri",
    price: 1250,
    rating: 4.9,
    calories: 780,
    prepTime: 30,
    description:
      "Tender lamb chops marinated overnight, grilled over high flame and topped with a fresh chimichurri of parsley, garlic, chilli and olive oil. Served with roasted vegetables.",
    chefNote:
      "Let them rest two minutes before you cut in. The juices settle and every bite stays pink and tender.",
    ingredients: ["Lamb chops", "Parsley", "Garlic", "Red chilli", "Olive oil", "Roasted vegetables"],
    tags: ["Signature", "Gluten-Free"],
    bgAccent: "#5f4a26",
    image: dishImage("Grilled_lamb_chops_with_chimichurri.png"),
  },
  {
    id: "ribeye",
    name: "Grilled Ribeye Steak with Potatoes",
    category: "Grills",
    subtitle: "Char-grilled ribeye, herb-roasted potatoes",
    price: 1650,
    rating: 4.9,
    calories: 920,
    prepTime: 28,
    description:
      "A thick-cut ribeye seasoned simply with salt and pepper, char-grilled to your liking and basted with garlic-thyme butter. Served with crisp herb-roasted potatoes and peppercorn sauce.",
    chefNote:
      "Medium-rare is where the marbling melts best. Tell us how you like it and we'll cook it exactly that way.",
    ingredients: ["Ribeye steak", "Garlic-thyme butter", "Baby potatoes", "Rosemary", "Peppercorn sauce", "Sea salt"],
    tags: ["Signature", "Gluten-Free"],
    bgAccent: "#6b4423",
    image: dishImage("Grilled_ribeye_steak_with_potatoes.png"),
  },
  {
    id: "lava-cake",
    name: "Molten Chocolate Lava Cake",
    category: "Desserts",
    subtitle: "Warm dark chocolate, molten centre, vanilla ice cream",
    price: 380,
    rating: 4.8,
    calories: 450,
    prepTime: 15,
    description:
      "A warm dark-chocolate cake baked to order so the centre stays molten, dusted with cocoa and served with a scoop of vanilla ice cream.",
    chefNote:
      "It's baked the moment you order. Break the top with your spoon and the centre should flow.",
    ingredients: ["Dark chocolate", "Butter", "Eggs", "Cocoa", "Vanilla ice cream", "Berries"],
    tags: ["Vegetarian"],
    bgAccent: "#4a3322",
    image: dishImage("Molten_chocolate_lava_cake_served.png"),
  },
  {
    id: "salmon",
    name: "Pan-Seared Atlantic Salmon",
    category: "Seafood",
    subtitle: "Crisp skin, lemon butter sauce, seasonal greens",
    price: 1450,
    rating: 4.8,
    calories: 610,
    prepTime: 22,
    description:
      "Atlantic salmon pan-seared skin-side down until crisp, finished with a lemon butter sauce and served over sautéed seasonal greens.",
    chefNote:
      "We press the fillet flat for the first minute so the whole skin crisps evenly.",
    ingredients: ["Atlantic salmon", "Butter", "Lemon", "Dill", "Seasonal greens", "Capers"],
    tags: ["Seafood", "Gluten-Free"],
    bgAccent: "#2f4b5a",
    image: dishImage("Pan-Seared_Atlantic_Salmon.png"),
  },
  {
    id: "tandoori",
    name: "Tandoori Chicken Sizzler",
    category: "Grills",
    subtitle: "Yogurt-spiced chicken, served sizzling",
    price: 490,
    rating: 4.8,
    calories: 590,
    prepTime: 20,
    description:
      "Chicken marinated in yogurt, ginger, garlic and tandoori spices, charred at high heat and brought to the table sizzling on a hot pan with onions and lemon.",
    chefNote:
      "The overnight yogurt marinade is what keeps it juicy under all that heat.",
    ingredients: ["Chicken", "Yogurt", "Tandoori masala", "Ginger & garlic", "Onions", "Lemon"],
    tags: ["Spicy", "Gluten-Free"],
    bgAccent: "#8a4f1c",
    image: dishImage("Tandoori_chicken_pieces_in_pan.png"),
  },
  {
    id: "risotto",
    name: "Truffle Mushroom Risotto",
    category: "Mains",
    subtitle: "Creamy arborio, wild mushrooms, truffle oil",
    price: 750,
    rating: 4.7,
    calories: 640,
    prepTime: 22,
    description:
      "Arborio rice stirred slowly with mushroom stock until creamy, folded with sautéed mushrooms and parmesan, and finished with a drizzle of truffle oil.",
    chefNote:
      "We never rush risotto. Twenty minutes of stirring is what gives it that creamy, flowing texture.",
    ingredients: ["Arborio rice", "Mixed mushrooms", "Truffle oil", "Parmesan", "Butter", "Fresh herbs"],
    tags: ["Vegetarian", "Gluten-Free"],
    bgAccent: "#5a4a2e",
    image: dishImage("Truffle_mushroom_risotto.png"),
  },
  {
    id: "margherita",
    name: "Wood-Fired Margherita Pizza",
    category: "Mains",
    subtitle: "Blistered crust, tomato, mozzarella, fresh basil",
    price: 680,
    rating: 4.8,
    calories: 720,
    prepTime: 15,
    description:
      "Slow-fermented dough baked in a wood-fired oven until blistered, topped with tomato sauce, fresh mozzarella, basil and a drizzle of olive oil.",
    chefNote:
      "Look for the dark spots on the crust. That's the sign the oven was hot enough.",
    ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Fresh basil", "Olive oil", "Sea salt"],
    tags: ["Vegetarian"],
    bgAccent: "#7a5a24",
    image: dishImage("Wood-fired_Margherita_pizza.png"),
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

export const MENU: MenuItem[] = DISHES.map(dishToMenuItem);

export const MENU_CATEGORIES: MenuCategory[] = ["Mains", "Grills", "Seafood", "Desserts"];

const dishById = (id: string) => DISHES.find((d) => d.id === id)!.image;

export const SIGNATURE_CATEGORIES = [
  {
    title: "Mains",
    blurb: "Slow-cooked biryani, creamy risotto, pasta and wood-fired pizza.",
    image: dishById("biryani"),
    href: "/menu?category=Mains",
  },
  {
    title: "Grills",
    blurb: "Ribeye, lamb chops and tandoori, straight off the flame.",
    image: dishById("ribeye"),
    href: "/menu?category=Grills",
  },
  {
    title: "Seafood",
    blurb: "Butter garlic tiger prawns and pan-seared Atlantic salmon.",
    image: dishById("tiger-prawns"),
    href: "/menu?category=Seafood",
  },
];

export const REVIEWS = [
  { id: 1, name: "Amelia R.", role: "Food writer", rating: 5, quote: "The ribeye alone is worth the trip. Smoky, rested to perfection, and those herb-roasted potatoes are dangerous." },
  { id: 2, name: "Daniel K.", role: "Anniversary dinner", rating: 5, quote: "Service felt personal without ever being stiff. They remembered our anniversary and surprised us with dessert." },
  { id: 3, name: "Sofia M.", role: "Regular guest", rating: 5, quote: "I have tried the risotto on four visits and it has been flawless every single time. Consistency is rare." },
  { id: 4, name: "James T.", role: "Business lunch", rating: 4, quote: "Beautiful room, quiet enough to talk, and the butter garlic prawns were the best I've had in Chittagong." },
  { id: 5, name: "Priya S.", role: "Birthday party of 8", rating: 5, quote: "They handled a big table and three dietary needs without a single hiccup. The lava cake stole the show." },
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
