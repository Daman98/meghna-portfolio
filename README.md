# Meghna Portfolio Website

A static portfolio website built with HTML, CSS, and JavaScript, designed for GitHub Pages deployment.

## 🏗 Technical Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS with Google Fonts (Inter)
- **Icons:** Font Awesome 6.4.0
- **Deployment:** GitHub Pages ready (static files)
- **No Build Process:** Direct HTML/CSS/JS files

## � Project Structure

```
├── index.html              # Main portfolio homepage
├── AmazonPayUXResearch.html # Case study page
├── DataCenterWorkforcePlatform.html # Project page
├── FixedAssetTransfer.html  # Project page
├── header.html             # Reusable header component
├── footer.html             # Reusable footer component
├── style.css               # Main stylesheet
├── script.js               # Interactive functionality
├── include.js              # Header/footer dynamic includes
└── images/                 # Static assets
    ├── amazon-pay-ux-research/     # Project images (50+ files)
    ├── data-center-workforce-platform/
    ├── fixed-asset-transfer/
    └── general/
```

## 🎨 Design System

- **Typography:** Inter font family (400, 700, 900 weights)
- **Color Palette:**
  - Primary: #6c7062 (purple-gray)
  - Text: #343333 (dark gray)
  - Background: #ffffff (white)
- **Layout:** CSS Grid and Flexbox
- **Display Mode:** Desktop-only layout (forces desktop view on all devices)

## ⚙️ Key Features

- **Modular Components:** Reusable header/footer via include.js
- **Desktop-Only Layout:** Forces desktop view on all devices including mobile
- **Image Optimization:** Local asset storage for fast loading
- **Smooth Navigation:** CSS scroll behavior and anchor links
- **SEO Ready:** Semantic HTML structure

## 🚀 Deployment

### GitHub Pages

1. Push to `main` branch
2. Enable GitHub Pages in repository settings
3. Select "Deploy from branch" → `main` → `/ (root)`
4. Site will be available at `https://username.github.io/repository-name`

### Local Development

```bash
# Clone repository
git clone https://github.com/username/meghna-portfolio.git

# Navigate to directory
cd meghna-portfolio

# Open in browser (no build process needed)
open index.html
# or use a local server
python -m http.server 8000
```

## 📱 Browser Support

- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **CSS Features:** Grid, Flexbox, Custom Properties
- **JavaScript:** ES6+ features (const/let, arrow functions)

## � Development Notes

- **No Frameworks:** Pure HTML/CSS/JS for simplicity and performance
- **Asset Management:** All images stored locally in organized folders
- **Code Style:** Consistent indentation, semantic HTML, organized CSS
- **Performance:** Optimized images, minimal external dependencies

## 📊 Performance Optimizations

- **Images:** Properly sized and optimized for web
- **CSS:** Single stylesheet, minimal external fonts
- **JavaScript:** Lightweight, no heavy libraries
- **HTML:** Semantic structure, proper meta tags

## 🛠 Maintenance

- **Adding Projects:** Create new HTML file, update navigation in include.js
- **Image Updates:** Add to appropriate folder in `/images/`
- **Styling Changes:** Update `style.css` (affects all pages)
- **Content Updates:** Edit individual HTML files

---

_Built as a static website optimized for GitHub Pages deployment with focus on performance and maintainability._
