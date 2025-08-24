# Copilot Instructions for meghna-portfolio

This repository is for Meghna Sahni's UX Designer portfolio, intended to be hosted on GitHub Pages. The site is built using only HTML, CSS, and JavaScript, with a design inspired by https://blahatrohit.webflow.io/.

## Project Structure

- All source files should be placed at the root or in clearly named folders (e.g., `assets/`, `images/`, `css/`, `js/`).
- No build tools or frameworks are used; keep everything static and simple.

## Key Patterns & Conventions

- **All custom CSS styles must be placed in `style.css`. Do not use inline `style` attributes or `<style>` tags in HTML files. Always use classes or IDs and update `style.css` accordingly.**

- **Color Theme:** Use a clean, minimal palette similar to the reference site: white backgrounds, black/gray text, and blue/purple accent colors for links and highlights.
- **Typography:** Large, bold headings for the name and section titles. Use sans-serif fonts throughout.
- **Navigation:** Sticky/fixed top navigation bar with links to sections: Home, Work, About, Shots, Contact.
- **Sections:**
  - **Hero:** Name, role (UX Designer), short intro, and social links.
  - **Selected Work:** Grid/list of projects with title, company, year, and a short description. Each project links to a detail page or modal.
  - **About:** Short bio, experience summary, and notable companies/clients.
  - **Contact:** Email link and social media icons.
- **Responsiveness:** Mobile-friendly layout with stacked sections and hamburger menu for navigation.
- **No external dependencies** except for web fonts and icons (e.g., Google Fonts, Font Awesome).

## Developer Workflows

- **Preview:** Open `index.html` directly in the browser for local preview.
- **Deploy:** Push to the `main` branch; GitHub Pages will serve from the root.
- **Add new work:** Duplicate a project card in the "Selected Work" section and update content.
- **Update shots:** Add images to the `shots` or `assets` folder and update the gallery markup.

## Examples

- See `index.html` for section structure and markup patterns.
- See `style.css` for color and typography rules.
- See `README.md` for project overview.

## Tips for AI Agents

- Follow the reference site's layout and color scheme closely.
- Keep code modular and well-commented for each section.
- Use semantic HTML5 elements (header, nav, main, section, footer).
- Avoid adding build steps, frameworks, or unnecessary complexity.

---

For any questions, refer to the reference site or contact the repository owner.
