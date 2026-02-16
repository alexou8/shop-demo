# Luxe Shop - Minimalist E-commerce Demo

[![Deploy to GitHub Pages](https://github.com/alexou8/shop-demo/actions/workflows/deploy.yml/badge.svg)](https://github.com/alexou8/shop-demo/actions/workflows/deploy.yml)

A complete, offline-first, modern sample e-commerce website built with pure HTML, CSS, and JavaScript. Features a "Minimalist luxury × bold playful" aesthetic with premium design and delightful interactions.

## 🌟 Features

### Design & UX
- **Minimalist luxury aesthetic** with bold playful accents
- Fully responsive (mobile-first design)
- Dark/light mode with localStorage persistence
- Smooth animations and transitions
- Accessible (semantic HTML, ARIA labels)
- Prefers-reduced-motion support

### Functionality
- **Home Page**: Hero section, featured products, categories, testimonials
- **Shop Page**: Product grid with filtering, sorting, and search
- **Product Detail**: Dynamic product pages with color/size selection
- **Shopping Cart**: Full cart management with localStorage persistence
- **Checkout**: Multi-step checkout with form validation
- **About Page**: Brand story, values, FAQ accordion, contact form

### Technical Highlights
- No frameworks or external dependencies
- No CDN dependencies - fully offline capable
- CSS-generated placeholders and inline SVG icons
- IntersectionObserver for scroll animations
- Debounced search functionality
- LocalStorage for cart and preferences
- Clean, modular, well-commented code

## 📁 Project Structure

```
shop-demo/
├── index.html          # Home page
├── shop.html           # Product listing page
├── product.html        # Product detail page (query param driven)
├── cart.html           # Shopping cart
├── checkout.html       # Checkout form
├── about.html          # About/FAQ page
├── assets/
│   ├── styles.css      # Complete design system & components
│   ├── app.js          # Main application logic
│   ├── data.js         # Product data & content
│   └── utils.js        # Helper functions
└── README.md
```

## 🚀 How to Run Locally

1. **Clone or download** this repository
2. **Open `index.html`** in your web browser
3. That's it! No build process or server needed.

### Alternative: Use a local server
For the best experience (especially for testing), you can use a local server:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with npx)
npx serve

# PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## 🌐 Deploy to GitHub Pages

### Method 1: Via GitHub Settings (Recommended)
1. Push this repository to GitHub
2. Go to your repository settings
3. Navigate to **Pages** section
4. Under "Source", select the branch (usually `main` or `master`)
5. Select root directory (`/`)
6. Click **Save**
7. Your site will be available at `https://yourusername.github.io/shop-demo/`

### Method 2: Via GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## 🎨 Design System

### Colors
- **Base**: Minimalist neutrals (white, grays, charcoal)
- **Accent**: Vibrant orange (#f97316) for CTAs and highlights
- **Secondary**: Purple (#8b5cf6) for subtle details
- **Dark Mode**: Deep charcoal backgrounds with muted shadows

### Typography
- System font stack (no external fonts)
- Responsive type scale using clamp()
- Tight letter spacing for headlines
- Generous line height for body text

### Components
- Sticky navbar with scroll effects
- Product cards with hover animations
- Skeleton loading states
- Modal and drawer overlays
- Form validation with inline errors
- Accordion for FAQ
- Stepper for checkout flow

### Animations
- Page fade-in on load
- Section reveal on scroll (IntersectionObserver)
- Card hover effects (lift + rotate + glow)
- Badge wiggle animation
- Button shine effect
- Cart badge bounce
- All animations respect `prefers-reduced-motion`

## 📱 Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Customization

### Update Products
Edit `assets/data.js` to modify products, categories, testimonials, and FAQ items.

### Change Colors
Edit CSS variables in `assets/styles.css`:
```css
:root {
  --color-accent-primary: #f97316;  /* Change to your brand color */
  --color-accent-secondary: #8b5cf6;
  /* ... more variables */
}
```

### Modify Content
- Hero text: `index.html`
- About page: `about.html`
- Footer links: Update in all HTML files

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Credits

Built with ❤️ as a demo project showcasing modern HTML/CSS/JS e-commerce capabilities without frameworks.

---

**Ready to deploy?** Simply push to GitHub and enable GitHub Pages in your repository settings!
