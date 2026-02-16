/**
 * Product data for the e-commerce store
 * Contains ~12 sample products across different categories
 */

const PRODUCTS = [
  {
    id: 1,
    name: "Minimalist Leather Tote",
    category: "Accessories",
    price: 189.00,
    rating: 4.8,
    reviewCount: 124,
    badges: ["Bestseller"],
    colors: ["Black", "Cognac", "Slate"],
    sizes: ["One Size"],
    description: "Premium full-grain leather tote with minimalist design. Spacious interior with magnetic closure and interior pockets. Perfect for daily use or travel.",
    features: ["Full-grain leather", "Magnetic closure", "Interior pockets", "15\" laptop compatible"]
  },
  {
    id: 2,
    name: "Cashmere Blend Sweater",
    category: "Clothing",
    price: 145.00,
    rating: 4.9,
    reviewCount: 89,
    badges: ["New"],
    colors: ["Cream", "Navy", "Charcoal"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Luxuriously soft cashmere blend sweater with a timeless crew neck design. Perfect weight for layering or wearing solo.",
    features: ["70% cashmere, 30% wool", "Dry clean only", "Ribbed cuffs", "Classic fit"]
  },
  {
    id: 3,
    name: "Wireless Minimalist Earbuds",
    category: "Tech",
    price: 129.00,
    rating: 4.6,
    reviewCount: 267,
    badges: ["Bestseller"],
    colors: ["White", "Black"],
    sizes: ["One Size"],
    description: "Premium wireless earbuds with active noise cancellation and 24-hour battery life. Sleek minimalist design meets superior sound quality.",
    features: ["Active noise cancellation", "24hr battery", "IPX4 water resistant", "USB-C charging"]
  },
  {
    id: 4,
    name: "Organic Cotton Duvet Cover",
    category: "Home",
    price: 168.00,
    rating: 4.7,
    reviewCount: 156,
    badges: ["New"],
    colors: ["White", "Sage", "Slate"],
    sizes: ["Queen", "King"],
    description: "Ultra-soft organic cotton duvet cover with clean, minimal design. Breathable and gets softer with every wash.",
    features: ["100% organic cotton", "OEKO-TEX certified", "Hidden button closure", "Machine washable"]
  },
  {
    id: 5,
    name: "Ceramic Coffee Mug Set",
    category: "Home",
    price: 58.00,
    rating: 4.9,
    reviewCount: 201,
    badges: ["Bestseller"],
    colors: ["Natural", "Midnight Blue"],
    sizes: ["Set of 4"],
    description: "Handcrafted ceramic mugs with smooth matte finish. Perfect weight and balance for your morning ritual.",
    features: ["Handcrafted ceramic", "Microwave safe", "Dishwasher safe", "12oz capacity"]
  },
  {
    id: 6,
    name: "Merino Wool Beanie",
    category: "Accessories",
    price: 45.00,
    rating: 4.8,
    reviewCount: 143,
    badges: [],
    colors: ["Charcoal", "Oatmeal", "Forest"],
    sizes: ["One Size"],
    description: "Soft merino wool beanie with classic ribbed knit. Temperature-regulating and naturally odor-resistant.",
    features: ["100% merino wool", "Ribbed knit", "Temperature regulating", "One size fits most"]
  },
  {
    id: 7,
    name: "Slim-Fit Oxford Shirt",
    category: "Clothing",
    price: 98.00,
    rating: 4.7,
    reviewCount: 178,
    badges: [],
    colors: ["White", "Light Blue", "Pink"],
    sizes: ["S", "M", "L", "XL"],
    description: "Premium cotton oxford with a modern slim fit. Versatile enough for office or weekend wear.",
    features: ["100% cotton oxford", "Mother of pearl buttons", "Machine washable", "Wrinkle resistant"]
  },
  {
    id: 8,
    name: "Smart Desk Lamp",
    category: "Tech",
    price: 179.00,
    rating: 4.8,
    reviewCount: 94,
    badges: ["New"],
    colors: ["Silver", "Black"],
    sizes: ["One Size"],
    description: "Sleek LED desk lamp with adjustable brightness and color temperature. USB-C charging port and minimalist touch controls.",
    features: ["Adjustable brightness", "Color temperature control", "USB-C charging port", "Touch controls"]
  },
  {
    id: 9,
    name: "Linen Throw Pillow",
    category: "Home",
    price: 52.00,
    rating: 4.6,
    reviewCount: 112,
    badges: [],
    colors: ["Natural", "Charcoal", "Rust"],
    sizes: ["18x18", "20x20"],
    description: "Pure linen throw pillow with hidden zipper. Soft, breathable, and naturally textured for effortless style.",
    features: ["100% linen", "Hidden zipper", "Removable cover", "Feather insert included"]
  },
  {
    id: 10,
    name: "Leather Card Wallet",
    category: "Accessories",
    price: 68.00,
    rating: 4.9,
    reviewCount: 289,
    badges: ["Bestseller"],
    colors: ["Black", "Tan", "Navy"],
    sizes: ["One Size"],
    description: "Slim leather card wallet with RFID protection. Holds 4-6 cards plus cash. Ages beautifully with use.",
    features: ["Full-grain leather", "RFID protection", "Holds 4-6 cards", "Slim profile"]
  },
  {
    id: 11,
    name: "Wide-Leg Trousers",
    category: "Clothing",
    price: 135.00,
    rating: 4.7,
    reviewCount: 167,
    badges: ["New"],
    colors: ["Black", "Navy", "Cream"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "High-waisted wide-leg trousers in premium twill. Effortlessly elegant with a relaxed, flowing silhouette.",
    features: ["Premium twill fabric", "High waisted", "Side zip closure", "Dry clean recommended"]
  },
  {
    id: 12,
    name: "Portable Bluetooth Speaker",
    category: "Tech",
    price: 149.00,
    rating: 4.8,
    reviewCount: 203,
    badges: [],
    colors: ["Charcoal", "Sand"],
    sizes: ["One Size"],
    description: "Premium portable speaker with 360° sound and 12-hour battery. Waterproof design perfect for any adventure.",
    features: ["360° sound", "12hr battery", "IPX7 waterproof", "Bluetooth 5.0"]
  }
];

// Category configuration
const CATEGORIES = [
  { id: "all", name: "All Products", icon: "grid" },
  { id: "Accessories", name: "Accessories", icon: "bag" },
  { id: "Clothing", name: "Clothing", icon: "shirt" },
  { id: "Tech", name: "Tech", icon: "device" },
  { id: "Home", name: "Home", icon: "home" }
];

// Price ranges for filtering
const PRICE_RANGES = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-50", label: "Under $50", min: 0, max: 50 },
  { id: "50-100", label: "$50 - $100", min: 50, max: 100 },
  { id: "100-150", label: "$100 - $150", min: 100, max: 150 },
  { id: "over-150", label: "Over $150", min: 150, max: Infinity }
];

// Featured products for homepage (IDs)
const FEATURED_PRODUCT_IDS = [1, 3, 5, 10];

// Testimonials for homepage
const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    text: "Absolutely love the quality and attention to detail. Every piece feels premium.",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    text: "Fast shipping, beautiful packaging, and products that exceed expectations.",
    rating: 5
  },
  {
    name: "Emma Wilson",
    text: "The minimalist design is exactly what I was looking for. Highly recommend!",
    rating: 5
  }
];

// Store features for homepage
const STORE_FEATURES = [
  {
    icon: "truck",
    title: "Free Shipping",
    description: "On orders over $100"
  },
  {
    icon: "return",
    title: "Easy Returns",
    description: "30-day return policy"
  },
  {
    icon: "secure",
    title: "Secure Payment",
    description: "Encrypted checkout"
  },
  {
    icon: "support",
    title: "24/7 Support",
    description: "Always here to help"
  }
];

// FAQ data for about page
const FAQ_ITEMS = [
  {
    question: "What is your shipping policy?",
    answer: "We offer free shipping on all orders over $100. Standard shipping takes 5-7 business days, and express shipping is available for an additional fee."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of purchase. Items must be unused and in original condition. Refunds are processed within 5-10 business days."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes! We ship to most countries worldwide. International shipping times vary by location but typically take 10-14 business days."
  },
  {
    question: "How do I care for my products?",
    answer: "Care instructions vary by product. Please check the product details page for specific care recommendations. Most items can be hand-washed or dry cleaned."
  },
  {
    question: "Do you offer gift wrapping?",
    answer: "Yes! Gift wrapping is available at checkout for a small fee. Each gift includes a handwritten note card."
  }
];
