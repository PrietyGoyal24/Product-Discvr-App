# 🛍️ Product Discovery — AI-Powered Product Search

A full-stack web application that lets users discover products using natural language queries, powered by **Google Gemini AI**. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes (serverless) |
| AI / LLM | Google Gemini API (`gemini-2.0-flash`) |
| Data | In-memory mock JSON (no database) |

---

## ⚡ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <https://github.com/PrietyGoyal24/Product-Discvr-App>
   cd product-discovery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   # Then edit .env.local and add your key:
   GEMINI_API_KEY=AIzaSyCRYTsM3Ard-i6URgW8sz9vePQgp1Fk6vw
   ```
   Get a free Gemini API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 How AI Integration Works

1. The user types a natural-language query in the **AskBar** (e.g., *"best headphones for working from home"*).
2. The frontend sends a `POST /api/ask` request with the query string.
3. The backend constructs a structured prompt that includes:
   - The user's query
   - The full product catalog serialized as JSON
   - Instructions to return a JSON object with matching `productIds` and a `summary`
4. The **Gemini `gemini-2.0-flash`** model returns a structured JSON response.
5. The backend safely extracts the JSON (handles markdown code blocks), maps IDs to real product objects, and returns `{ products, summary }`.
6. The frontend displays the matched products and the AI-generated summary.

---

## 📁 Project Structure

```
product-discovery/
├── app/
│   ├── layout.tsx              # Root layout with SEO metadata
│   ├── page.tsx                # Main page — product grid + AI ask bar
│   ├── products/[id]/page.tsx  # Product detail page
│   └── api/
│       ├── products/route.ts   # GET /api/products
│       └── ask/route.ts        # POST /api/ask (Gemini integration)
├── components/
│   ├── ProductCard.tsx         # Product card with hover effects
│   ├── AskBar.tsx              # AI search input component
│   └── ProductSkeleton.tsx     # Loading skeleton
├── lib/
│   └── products.ts             # Mock product data + TypeScript types
└── .env.local                  # API key (gitignored)
```

---

## 🚀 Deployment (Vercel)

This project is fully ready to be deployed on Vercel:
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. In the Environment Variables section, add your `GEMINI_API_KEY`.
4. Click **Deploy**.

---

## ⚠️ Known Limitations & Future Improvements

| Limitation | Potential Improvement |
|---|---|
| In-memory mock data | Replace with a real database (e.g., PostgreSQL, Supabase) |
| No user authentication | Add NextAuth.js for user sessions |
| Static product list | Implement a CMS or admin panel to manage products |
| Gemini response latency | Add streaming responses with `streamGenerateContent` |
| No cart / checkout | Integrate Stripe for e-commerce functionality |
| No product images | Add real product images (CDN / S3) |
