"use client";

/**
 * SHOES — Premium e-commerce landing page (single file)
 *
 * Drop-in usage (Next.js App Router):
 *   src/components/LandingPage.tsx   <- this file
 *   src/app/page.tsx                 ->  import LandingPage from "@/components/LandingPage";
 *                                        export default function Page() { return <LandingPage />; }
 *
 * Dependencies:  npm i framer-motion lucide-react
 * Tailwind:      v3.4+ (arbitrary values only, no config changes required)
 * Images:        none required — shoes are drawn with the inline <ShoeArt /> SVG.
 *                Swap in real photos later by passing `image` to products/slides.
 *
 * Structure: every section is its own function at the top (1–16), shared UI
 * helpers come first, and the default-exported <LandingPage /> composes them.
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Footprints,
  Gift,
  Heart,
  Menu,
  MessageCircle,
  Mountain,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Truck,
  User,
  X,
} from "lucide-react";
import { Cinzel, Inter, Playfair_Display } from "next/font/google";

/* ────────────────────────────────────────────────────────────────────────────
   Fonts, tokens, data
──────────────────────────────────────────────────────────────────────────── */

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  variable: "--font-serif",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Colour tokens (kept as constants so SVG art and Tailwind share one source). */
const C = {
  maroon: "#4A0F14",
  maroon700: "#5C1219",
  tan: "#A9794A",
  tan400: "#C29868",
  cream: "#F7F2EA",
  grey: "#EDEDED",
  ink: "#1C1917",
  muted: "#6B645F",
  star: "#E0A526",
} as const;

const display = "font-[family-name:var(--font-display)]";
const serif = "font-[family-name:var(--font-serif)]";

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  color: string;
  sole?: string;
  tag?: "New" | "Sale" | "Best seller";
  image?: string;
}

const SHOE_IMAGES = {
  redSneaker:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85",

  whiteSneaker:
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1400&q=85",

  lifestyle:
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1400&q=85",

  leather:
    "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1400&q=85",

  formal:
    "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1400&q=85",

  brown:
    "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=1400&q=85",

  boots:
    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1400&q=85",

  walking:
    "https://images.unsplash.com/photo-1554130844-5f8f1c1b1d6a?auto=format&fit=crop&w=1400&q=85",
} as const;

const NEW_ARRIVALS: Product[] = [
  { id: "n1", name: "Harlow Brogue", price: 129, rating: 4.8, reviews: 212, color: "#7A3B1D", tag: "New", image: SHOE_IMAGES.brown },
  { id: "n2", name: "Calder Chelsea Boot", price: 149, rating: 4.7, reviews: 96, color: "#2B1B16", tag: "New", image: SHOE_IMAGES.boots },
  { id: "n3", name: "Mayfair Loafer", price: 119, rating: 4.6, reviews: 143, color: "#A9794A", tag: "New", image: SHOE_IMAGES.leather },
  { id: "n4", name: "Stratford Oxford", price: 139, rating: 4.9, reviews: 305, color: "#1C1917", tag: "New", image: SHOE_IMAGES.formal },
  { id: "n5", name: "Wren Leather Trainer", price: 99, rating: 4.5, reviews: 88, color: "#E8E2D6", sole: "#C9C2B4", tag: "New", image: SHOE_IMAGES.whiteSneaker },
  { id: "n6", name: "Fenwick Derby", price: 125, rating: 4.7, reviews: 120, color: "#5C1219", tag: "New", image: SHOE_IMAGES.brown },
  { id: "n7", name: "Arden Suede Loafer", price: 115, rating: 4.4, reviews: 61, color: "#8A6A4A", tag: "New", image: SHOE_IMAGES.leather },
  { id: "n8", name: "Kestrel Walking Boot", price: 159, rating: 4.8, reviews: 174, color: "#4B3426", tag: "New", image: SHOE_IMAGES.walking },
];

const BEST_SELLERS: Product[] = [
  { id: "b1", name: "Stratford Oxford", price: 139, oldPrice: 165, rating: 4.9, reviews: 305, color: "#1C1917", tag: "Best seller", image: SHOE_IMAGES.formal },
  { id: "b2", name: "Harlow Brogue", price: 129, oldPrice: 149, rating: 4.8, reviews: 212, color: "#7A3B1D", tag: "Best seller", image: SHOE_IMAGES.brown },
  { id: "b3", name: "Mayfair Loafer", price: 99, oldPrice: 119, rating: 4.6, reviews: 143, color: "#A9794A", tag: "Sale", image: SHOE_IMAGES.leather },
  { id: "b4", name: "Calder Chelsea Boot", price: 149, rating: 4.7, reviews: 96, color: "#2B1B16", tag: "Best seller", image: SHOE_IMAGES.boots },
  { id: "b5", name: "Fenwick Derby", price: 105, oldPrice: 125, rating: 4.7, reviews: 120, color: "#5C1219", tag: "Sale", image: SHOE_IMAGES.brown },
  { id: "b6", name: "Wren Leather Trainer", price: 99, rating: 4.5, reviews: 88, color: "#E8E2D6", sole: "#C9C2B4", tag: "Best seller", image: SHOE_IMAGES.whiteSneaker },
];

const CATEGORIES: Category[] = [
  {
    name: "Men",
    count: 84,
    eyebrow: "Classic collection",
    bg: "#EDEDED",
    accent: "#7A3B1D",
    image: SHOE_IMAGES.brown,
    featured: true,
  },

  {
    name: "Women",
    count: 76,
    eyebrow: "New season",
    bg: "#F7F2EA",
    accent: "#A9794A",
    image: SHOE_IMAGES.leather,
  },

  {
    name: "Trainers",
    count: 41,
    eyebrow: "Everyday comfort",
    bg: "#EDEDED",
    accent: "#4A0F14",
    image: SHOE_IMAGES.whiteSneaker,
  },

  {
    name: "Boots",
    count: 38,
    eyebrow: "Built for weather",
    bg: "#F7F2EA",
    accent: "#2B1B16",
    image: SHOE_IMAGES.boots,
    featured: true,
  },

  {
    name: "Casual",
    count: 52,
    eyebrow: "Relaxed style",
    bg: "#EDEDED",
    accent: "#8A6A4A",
    image: SHOE_IMAGES.lifestyle,
  },

  {
    name: "Formal",
    count: 47,
    eyebrow: "Sharp occasions",
    bg: "#F7F2EA",
    accent: "#1C1917",
    image: SHOE_IMAGES.formal,
  },
];

const BENEFITS = [
  { icon: Truck, title: "Free UK delivery", text: "On every order over £75, dispatched within 24 hours." },
  { icon: RotateCcw, title: "Easy 30-day returns", text: "Wear them indoors. Not right? Send them back free." },
  { icon: ShieldCheck, title: "Built to resolve", text: "Full-grain leather and Goodyear-welted soles you can re-sole." },
  { icon: MessageCircle, title: "Fit advice from people", text: "Chat with a fitter, Monday to Saturday, 9am to 7pm." },
];

const OCCASIONS = [
  { icon: Briefcase, name: "Work" },
  { icon: Footprints, name: "Everyday" },
  { icon: Mountain, name: "Outdoor" },
  { icon: Coffee, name: "Weekend" },
  { icon: Sparkles, name: "Evening" },
  { icon: Sun, name: "Summer" },
];

const REVIEWS = [
  { name: "Daniel R.", place: "Manchester", rating: 5, text: "Wore the Stratfords to a wedding straight out of the box. No blisters, and they still look sharp a year on." },
  { name: "Priya S.", place: "London", rating: 5, text: "The Mayfair loafers are the most comfortable work shoes I own. Sizing was spot-on and returns were never needed." },
  { name: "Tom H.", place: "Edinburgh", rating: 4, text: "Solid boots for Scottish weather. Took a week to break in, now I reach for them every day." },
];

const ARTICLES = [
  { title: "How to polish leather shoes in five minutes", tag: "Shoe care", read: "4 min read", color: "#7A3B1D" },
  { title: "Brogue, derby or oxford: which should you wear?", tag: "Style guide", read: "6 min read", color: "#1C1917" },
  { title: "Autumn edit: boots that handle a wet commute", tag: "Seasonal", read: "5 min read", color: "#4B3426" },
];

const FOOTER_COLUMNS = [
  { title: "Shop", links: ["Men", "Women", "New arrivals", "Collections", "Sale", "Gift cards"] },
  { title: "Customer service", links: ["Contact us", "Size guide", "Delivery information", "Returns & exchanges", "FAQs"] },
  { title: "Company", links: ["Our story", "Craftsmanship", "Journal", "Careers", "Stockists"] },
];

const PAYMENTS = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Klarna"];

/* ────────────────────────────────────────────────────────────────────────────
   Shared UI helpers
──────────────────────────────────────────────────────────────────────────── */

const cn = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

const money = (n: number) => `£${n.toFixed(2)}`;

function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-310 px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ title, subtitle, light, id }: { title: string; subtitle?: string; light?: boolean; id?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-xl text-center">
      <h2 id={id} className={cn(serif, "text-3xl italic md:text-4xl", light ? "text-white" : "text-[#4A0F14]")}>{title}</h2>
      {subtitle && <p className={cn("mt-3 text-sm leading-relaxed", light ? "text-white/70" : "text-[#6B645F]")}>{subtitle}</p>}
    </div>
  );
}

function Button({
  children,
  variant = "maroon",
  className,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  variant?: "maroon" | "tan" | "outline" | "light";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const styles = {
    maroon: "bg-[#4A0F14] text-white hover:bg-[#5C1219]",
    tan: "bg-[#A9794A] text-white hover:bg-[#8A5F36]",
    outline: "border border-[#4A0F14] text-[#4A0F14] hover:bg-[#4A0F14] hover:text-white",
    light: "bg-white text-[#4A0F14] hover:bg-[#F7F2EA]",
  }[variant];
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-7 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9794A] focus-visible:ring-offset-2",
        styles,
        className
      )}
    >
      {children}
    </motion.button>
  );
}

// function SocialIcon({
//   platform,
//   className,
//   width = 18,
//   height = 18,
// }: {
//   platform: "instagram" | "facebook" | "youtube";
//   className?: string;
//   width?: number;
//   height?: number;
// }) {
//   const sharedProps = {
//     className,
//     width,
//     height,
//     viewBox: "0 0 24 24",
//     fill: "none",
//     stroke: "currentColor",
//     strokeWidth: 2,
//     strokeLinecap: "round" as const,
//     strokeLinejoin: "round" as const,
//     "aria-hidden": true as const,
//   };

//   if (platform === "instagram") {
//     return (
//       <svg {...sharedProps}>
//         <rect x="3" y="3" width="18" height="18" rx="5" />
//         <circle cx="12" cy="12" r="4" />
//         <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" stroke="none" />
//       </svg>
//     );
//   }

//   if (platform === "facebook") {
//     return (
//       <svg {...sharedProps} fill="currentColor" stroke="none">
//         <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.6v8h3.4Z" />
//       </svg>
//     );
//   }

//   return (
//     <svg {...sharedProps}>
//       <path d="M22 8.1a2.8 2.8 0 0 0-2-2C18.2 5.6 12 5.6 12 5.6s-6.2 0-8 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.5 12a29 29 0 0 0 .5 3.9 2.8 2.8 0 0 0 2 2c1.8.5 8 .5 8 .5s6.2 0 8-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-3.9 29 29 0 0 0-.5-3.9Z" />
//       <path d="m10 15 5-3-5-3v6Z" fill="currentColor" stroke="none" />
//     </svg>
//   );
// }

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          fill={i <= Math.round(value) ? C.star : "none"}
          stroke={i <= Math.round(value) ? C.star : "#CFC8BF"}
        />
      ))}
    </span>
  );
}

/** Side-profile leather shoe drawn in SVG, so the page needs no image files. */
function ShoeArt({
  color = "#7A3B1D",
  sole = "#2A1A12",
  flip = false,
  className,
}: {
  color?: string;
  sole?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 120"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      role="img"
      aria-label="Leather shoe illustration"
    >
      <ellipse cx="122" cy="108" rx="104" ry="5" fill="#000" opacity=".12" />
      <path d="M12 92 Q12 85 24 85 L218 85 Q233 85 230 96 Q227 104 213 104 L28 104 Q12 104 12 92Z" fill={sole} />
      <path
        d="M20 86 C18 60 26 40 40 31 C54 22 72 25 86 38 C98 48 112 60 142 62 C176 64 214 67 227 82 L229 87 L20 88Z"
        fill={color}
      />
      <path d="M176 64 C200 66 221 73 227 84 L188 86 C192 77 187 69 176 64Z" fill="#000" opacity=".16" />
      <path d="M40 31 C54 22 72 25 86 38 C70 36 52 38 40 31Z" fill="#fff" opacity=".14" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M${96 + i * 14} ${46 + i * 3.4} l12 -6`}
          stroke="#fff"
          strokeOpacity=".75"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      ))}
      <path d="M20 86 L226 86" stroke="#000" strokeOpacity=".25" strokeWidth="1.5" />
    </svg>
  );
}

function RealImage({
  src,
  alt,
  className,
  position = "center",
}: {
  src: string;
  alt: string;
  className?: string;
  position?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn("h-full w-full object-cover", className)}
      style={{ objectPosition: position }}
    />
  );
}

function ProductCard({
  product,
  wished,
  onAdd,
  onWish,
}: {
  product: Product;
  wished: boolean;
  onAdd: () => void;
  onWish: () => void;
}) {
  return (
    <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: EASE }} className="group relative">
      <div className="relative overflow-hidden rounded-xl bg-[#F4F2EF]">
        {product.tag && (
          <span
            className={cn(
              "absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white",
              product.tag === "Sale" ? "bg-[#4A0F14]" : "bg-[#A9794A]"
            )}
          >
            {product.tag}
          </span>
        )}
        <button
          type="button"
          onClick={onWish}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9794A]"
        >
          <Heart width={16} height={16} fill={wished ? C.maroon : "none"} stroke={C.maroon} />
        </button>
        <div className="relative aspect-[4/3.4] overflow-hidden bg-[#F4F2EF] transition-transform duration-500 group-hover:scale-[1.015]">
          {product.image ? (
            <RealImage src={product.image} alt={product.name} className="transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center p-6"><ShoeArt color={product.color} sole={product.sole} className="w-full" /></div>
          )}
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="absolute inset-x-3 bottom-3 translate-y-[140%] rounded-full bg-[#4A0F14] py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-transform duration-300 focus-visible:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9794A] group-hover:translate-y-0 max-md:translate-y-0"
        >
          Add to bag
        </button>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-sm font-medium text-[#1C1917]">{product.name}</h3>
        <div className="mt-1.5 flex items-center justify-center gap-2 text-xs text-[#6B645F]">
          <Stars value={product.rating} size={12} />
          <span>({product.reviews})</span>
        </div>
        <p className="mt-1.5 text-sm">
          {product.oldPrice && <span className="mr-2 text-[#8C857F] line-through">{money(product.oldPrice)}</span>}
          <span className="font-semibold text-[#4A0F14]">{money(product.price)}</span>
        </p>
      </div>
    </motion.article>
  );
}

function Countdown({ days = 3 }: { days?: number }) {
  const [target, setTarget] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const start = Date.now();
    const end = start + days * 86_400_000;

    setTarget(end);
    setNow(start);

    const id = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(id);
  }, [days]);

  // Important:
  // During server prerender we use a static value.
  // Date.now() only runs after the component mounts in the browser.
  const diff =
    target !== null && now !== null
      ? Math.max(0, target - now)
      : days * 86_400_000;

  const parts = [
    {
      label: "Days",
      v: Math.floor(diff / 86_400_000),
    },
    {
      label: "Hrs",
      v: Math.floor((diff / 3_600_000) % 24),
    },
    {
      label: "Min",
      v: Math.floor((diff / 60_000) % 60),
    },
    {
      label: "Sec",
      v: Math.floor((diff / 1000) % 60),
    },
  ];

  return (
    <div
      className="inline-flex items-center gap-3 rounded-full bg-[#4A0F14] px-5 py-2.5 text-white"
      role="timer"
      aria-label="Offer ends in"
    >
      {parts.map((p, i) => (
        <div key={p.label} className="flex items-baseline gap-1.5">
          <span className="relative inline-block h-6 w-7 overflow-hidden text-center text-lg font-semibold tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={p.v}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                {String(p.v).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </span>

          <span className="text-[10px] uppercase tracking-wider text-white/60">
            {p.label}
          </span>

          {i < parts.length - 1 && (
            <span className="ml-1 text-white/30">|</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   1. Announcement / Promo Bar
──────────────────────────────────────────────────────────────────────────── */

function AnnouncementBar() {
  return (
    <div className="bg-white text-[11px] text-[#1C1917]">
      <Container className="flex items-center justify-between gap-4 py-2">
        <p className="truncate">
          <span className="font-semibold text-[#4A0F14]">Free UK delivery</span> on orders over £75. Autumn sale: up to 50% off every weekend.
        </p>
        <nav aria-label="Utility" className="hidden items-center gap-5 sm:flex">
          {["Track order", "Checkout", "Wishlist", "Account"].map((l) => (
            <a key={l} href="#" className="transition-colors hover:text-[#A9794A]">
              {l}
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   2. Header / Navigation
──────────────────────────────────────────────────────────────────────────── */

function Logo({ compact }: { compact?: boolean }) {
  return (
    <a href="#" aria-label="Shoes — home" className="flex flex-col items-center">
      <span className={cn(display, "font-semibold leading-none text-[#4A0F14]", compact ? "text-lg" : "text-2xl")}>Shoes</span>
      {!compact && <span className="mt-1 text-[8px] uppercase tracking-[0.3em] text-[#6B645F]">Partner shoes</span>}
    </a>
  );
}

function Header({
  cartCount,
  wishCount,
  onCartClick,
}: {
  cartCount: number;
  wishCount: number;
  onCartClick: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const left = ["Men", "Women", "New arrivals"];
  const right = ["Collections", "Sale", "Journal"];
  const linkCls =
    "text-[11px] font-medium uppercase tracking-[0.16em] text-white/90 transition-colors hover:text-[#C29868] focus-visible:outline-none focus-visible:text-[#C29868]";

  const IconBtn = ({ label, children, onClick, badge }: { label: string; children: ReactNode; onClick?: () => void; badge?: number }) => (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative grid h-11 w-11 place-items-center rounded-full text-[#1C1917] transition hover:bg-[#F7F2EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9794A]"
    >
      {children}
      {!!badge && (
        <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#4A0F14] px-1 text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled ? "bg-white/85 shadow-[0_10px_30px_-12px_rgb(0_0_0/.15)] backdrop-blur-md" : "bg-white"
      )}
    >
      <Container>
        {/* Row 1 */}
        <div className={cn("flex items-center justify-between gap-4 transition-all", scrolled ? "py-1.5" : "py-3")}>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu width={22} height={22} />
          </button>

          <form role="search" className="hidden w-64 items-center rounded-full border border-[#E7E5E4] bg-[#FAFAF9] pl-4 lg:flex" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="site-search" className="sr-only">
              Search the catalogue
            </label>
            <input
              id="site-search"
              type="search"
              placeholder="Search shoes, boots, brands"
              className="h-10 flex-1 bg-transparent text-xs outline-none placeholder:text-[#8C857F]"
            />
            <button type="submit" aria-label="Search" className="grid h-10 w-10 place-items-center">
              <Search width={16} height={16} />
            </button>
          </form>

          <div className="lg:hidden">
            <Logo compact />
          </div>

          <div className="hidden items-center gap-6 text-xs lg:flex">
            <div className="flex items-center gap-2">
              <Phone width={18} height={18} color={C.tan} />
              <div>
                <p className="font-semibold">Contact us</p>
                <p className="text-[#6B645F]">0800 123 4567</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock width={18} height={18} color={C.tan} />
              <div>
                <p className="font-semibold">Opening time</p>
                <p className="text-[#6B645F]">9:00 am to 7:00 pm</p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <IconBtn label="Account">
              <User width={20} height={20} />
            </IconBtn>
            <IconBtn label={`Wishlist, ${wishCount} items`} badge={wishCount}>
              <Heart width={20} height={20} />
            </IconBtn>
            <IconBtn label={`Open bag, ${cartCount} items`} onClick={onCartClick} badge={cartCount}>
              <ShoppingBag width={20} height={20} />
            </IconBtn>
          </div>
        </div>

        {/* Row 2 — maroon pill with centred logo box (desktop) */}
        <div className="relative hidden pb-8 lg:block">
          <nav aria-label="Primary" className="flex h-11 items-center justify-between rounded-full bg-[#4A0F14] px-10">
            <ul className="flex gap-10">
              {left.map((l) => (
                <li key={l}>
                  <a href="#" className={linkCls}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="flex gap-10">
              {right.map((l) => (
                <li key={l}>
                  <a href="#" className={linkCls}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div
            className={cn(
              "absolute left-1/2 top-0 -translate-x-1/2 bg-white px-8 shadow-[0_10px_30px_-12px_rgb(0_0_0/.2)] transition-all",
              scrolled ? "-translate-y-12 scale-75 opacity-0 pointer-events-none" : "py-3"
            )}
          >
            <Logo />
          </div>
        </div>
      </Container>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 left-0 z-50 w-[82%] max-w-sm bg-[#4A0F14] p-6 text-white"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              <button type="button" aria-label="Close menu" className="mb-6 grid h-11 w-11 place-items-center" onClick={() => setOpen(false)}>
                <X width={22} height={22} />
              </button>
              <ul className="space-y-1">
                {[...left, ...right].map((l) => (
                  <li key={l}>
                    <a href="#" onClick={() => setOpen(false)} className={cn(display, "block border-b border-white/10 py-4 text-lg")}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   3. Hero Section
──────────────────────────────────────────────────────────────────────────── */

const HERO_SLIDES = [
  { kicker: "New or never", title: "Formal shoes", sub: "Time to change. Up to 50% off", left: "#3A1F14", right: ["#B5683A", "#A9794A"] },
  { kicker: "Back by demand", title: "Autumn boots", sub: "Resoleable leather. Free UK delivery", left: "#2B1B16", right: ["#6B4A32", "#4B3426"] },
];

function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((p) => (p + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(id);
  }, [paused]);

  const s = HERO_SLIDES[i];
  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative overflow-hidden bg-[#EDEDED]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto flex min-h-115 max-w-[1600px] items-center justify-center md:min-h-135">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
            <div className="absolute inset-0">
              <RealImage
                src={i === 0 ? SHOE_IMAGES.formal : SHOE_IMAGES.boots}
                alt={i === 0 ? "Premium formal leather shoes" : "Premium leather boots"}
                className="object-cover"
                position="center"
              />
              <div className="absolute inset-0 bg-linear-to-r from-[#F7F2EA]/95 via-[#F7F2EA]/65 to-[#F7F2EA]/20" />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 px-6 py-16 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-col items-center"
            >
              <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#A9794A] text-[10px] italic text-white">Sale</span>
              <p className={cn(serif, "text-xl italic text-[#8A5F36] md:text-2xl")}>{s.kicker}</p>
              <h1 className={cn(display, "mt-1 text-4xl font-semibold uppercase tracking-[0.08em] text-[#4A0F14] sm:text-5xl md:text-7xl")}>
                {s.title}
              </h1>
              <div className="my-4 flex w-full max-w-md items-center gap-3 text-xs text-[#6B645F]">
                <span className="h-px flex-1 bg-[#C29868]" />
                <span>{s.sub}</span>
                <span className="h-px flex-1 bg-[#C29868]" />
              </div>
              <Button>Buy now</Button>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2" role="tablist" aria-label="Choose slide">
          {HERO_SLIDES.map((_, n) => (
            <button
              key={n}
              role="tab"
              aria-selected={n === i}
              aria-label={`Slide ${n + 1}`}
              onClick={() => setI(n)}
              className={cn("h-2 rounded-full transition-all", n === i ? "w-6 bg-[#4A0F14]" : "w-2 bg-[#A9794A]/50")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   4. Shop by Category
──────────────────────────────────────────────────────────────────────────── */
interface Category {
  name: string;
  count: number;
  bg: string;
  accent: string;
  eyebrow: string;
  image: string;
  featured?: boolean;
}
function CategoryCard({ category: c }: { category: Category }) {
  const { featured } = c;
 
  return (
    <a
      href="#"
      aria-label={`Shop ${c.name} — ${c.count} styles`}
      style={{ backgroundColor: c.bg, ["--accent" as string]: c.accent }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl p-4 ring-1 ring-black/5",
        "transition-all duration-500 ease-out will-change-transform",
        "hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.25)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        featured
          ? "min-h-52.5 sm:min-h-60 md:p-7 lg:min-h-72.5"
          : "min-h-62.5 sm:min-h-67.5 md:p-6 lg:min-h-72.5"
      )}
    >
      {/* ---------- Text block ---------- */}
      <div className={cn("relative z-10", featured ? "max-w-[55%]" : "max-w-full")}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-(--accent) md:text-xs">
          {c.eyebrow}
        </p>
 
        <h3
          className={cn(
            display,
            "mt-1.5 font-bold uppercase leading-[1.05] tracking-tight text-[#2B2623]",
            featured
              ? "text-[1.7rem] sm:text-4xl lg:text-[2.6rem]"
              : "text-xl sm:text-2xl lg:text-[1.7rem]"
          )}
        >
          {c.name}
        </h3>
 
        <p className="mt-2 text-xs text-[#6B645F] md:text-sm">{c.count} styles</p>
 
        {/* Featured → full CTA button */}
        {featured && (
          <span
            className={cn(
              "mt-4 inline-flex items-center gap-2 rounded-md bg-(--accent) px-4 py-2.5",
              "text-[11px] font-semibold uppercase tracking-wider text-white md:text-xs",
              "transition-all duration-300 group-hover:gap-3 group-hover:shadow-lg"
            )}
          >
            Shop now
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
 
      {/* Small cards → round arrow chip */}
      {!featured && (
        <span
          aria-hidden
          className={cn(
            "absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-[#2B2623]",
            "backdrop-blur transition-all duration-300 md:right-5 md:top-5 md:h-9 md:w-9",
            "group-hover:bg-(--accent) group-hover:text-white"
          )}
        >
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        </span>
      )}
 
      {/* ---------- Product visual ---------- */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute",
          featured
            ? "bottom-2 right-2 h-[88%] w-[50%] md:right-5 md:bottom-4"
            : "bottom-3 left-1/2 h-[52%] w-[88%] -translate-x-1/2"
        )}
      >
        {/* soft ground shadow */}
        <span
          className="absolute bottom-[6%] left-1/2 h-5 w-[70%] -translate-x-1/2 rounded-[50%] opacity-40 blur-xl transition-all duration-500 group-hover:w-[80%] group-hover:opacity-60"
          style={{ backgroundColor: c.accent }}
        />
 
        <div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:-rotate-3 group-hover:scale-[1.08] motion-reduce:transform-none">
          <RealImage
            src={c.image}
            alt=""
            /* multiply blends white photo backgrounds into the pastel tint */
            className="h-full w-full object-contain mix-blend-multiply drop-shadow-[0_14px_14px_rgba(0,0,0,0.18)]"
          />
        </div>
      </div>
    </a>
  );
}
function ShopByCategory() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="cat-title">
      <Container>
        <SectionTitle
          id="cat-title"
          title="Shop by category"
          subtitle="Six places to start, from sharp formal pairs to weekend trainers."
        />
 
        {/*
          Bento layout
          mobile / tablet : 2 cols  → featured = full width, others = half
          desktop (lg)    : 4 cols  → featured = 2 cols, others = 1 col
          Row 1: [Featured ×2][ ][ ]   Row 2: [ ][ ][Featured ×2]
        */}
        <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((c, n) => (
            <li
              key={c.name}
              className={cn(c.featured ? "col-span-2" : "col-span-1")}
            >
              <Reveal delay={n * 0.05} className="h-full">
                <CategoryCard category={c} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   5. New Arrivals
──────────────────────────────────────────────────────────────────────────── */

type ShelfProps = { wishlist: Set<string>; onAdd: (p: Product) => void; onWish: (id: string) => void };

function NewArrivals({ wishlist, onAdd, onWish }: ShelfProps) {
  return (
    <section className="bg-white pb-16 md:pb-24" aria-labelledby="new-title">
      <Container>
        <SectionTitle id="new-title" title="New arrivals" subtitle="Eight fresh pairs, just in from the workshop." />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {NEW_ARRIVALS.map((p, n) => (
            <Reveal key={p.id} delay={(n % 4) * 0.06}>
              <ProductCard product={p} wished={wishlist.has(p.id)} onAdd={() => onAdd(p)} onWish={() => onWish(p.id)} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button variant="outline">View all new arrivals</Button>
        </div>
      </Container>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   6. Featured Collection / Campaign
──────────────────────────────────────────────────────────────────────────── */

function FeaturedCollection() {
  return (
    <section className="py-4 md:py-8" aria-label="Featured collection">
      <Container>
        <div className="grid gap-3 md:grid-cols-3 md:grid-rows-2 md:gap-4">
          {/* Editorial lead tile */}
          <Reveal className="relative overflow-hidden rounded-lg bg-[#EDEDED] md:col-span-2 md:row-span-1">
            <div className="grid items-center md:grid-cols-2">
              <div className="p-6 md:p-10">
                <div className="inline-block bg-white px-6 py-5 text-center shadow-[0_10px_30px_-12px_rgb(0_0_0/.15)]">
                  <p className={cn(display, "text-lg tracking-[0.12em] text-[#4A0F14]")}>JUST ARRIVED</p>
                  <p className="mt-1 text-xs text-[#6B645F]">The Heritage Formal Collection</p>
                </div>
                <p className="mt-5 text-sm">
                  Special offer <span className="font-semibold">10% off</span>, starting at £99
                </p>
                <Button variant="maroon" className="mt-5">Shop the collection</Button>
              </div>
              <div className="h-full min-h-65 overflow-hidden p-3 md:p-6">
                <RealImage src={SHOE_IMAGES.formal} alt="Heritage formal leather collection" className="rounded-lg" />
              </div>
            </div>
          </Reveal>

          {/* Deal tile */}
          <Reveal delay={0.08} className="overflow-hidden rounded-lg md:row-span-2">
            <div className="flex h-full flex-col">
              <div className="flex flex-1 items-center justify-center border border-[#E7E5E4] bg-white p-8">
                <RealImage src={SHOE_IMAGES.whiteSneaker} alt="Weekend leather sneaker" className="rounded-lg" />
              </div>
              <div className="bg-[#A9794A] p-6 text-center text-white">
                <h3 className={cn(serif, "text-xl italic")}>Weekend deal: Basic Contrast Sneaker</h3>
                <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-white/85">
                  Soft leather, cushioned insole and a clean white sole. Ends when the clock does.
                </p>
                <div className="mt-4">
                  <Countdown />
                </div>
                <p className="mt-4 text-sm">
                  <span className="mr-2 text-white/60 line-through">£52.00</span>
                  <span className="text-lg font-semibold">£49.00</span>
                </p>
                <div className="mt-2 flex justify-center"><Stars value={5} /></div>
              </div>
            </div>
          </Reveal>

          {/* End-of-season tile */}
          <Reveal delay={0.12} className="grid place-items-center rounded-lg bg-[#4A0F14] p-8 text-center text-white">
            <div>
              <p className={cn(display, "text-4xl font-semibold tracking-widest")}>SHOES</p>
              <p className="mt-1 text-xs text-white/60">End of season</p>
              <p className={cn(serif, "my-3 text-5xl italic text-[#C29868]")}>-70%</p>
              <Button variant="tan">Shop offers</Button>
            </div>
          </Reveal>

          {/* Black shoes tile */}
          <Reveal delay={0.16} className="relative grid items-center overflow-hidden rounded-lg bg-[#EDEDED] p-6 sm:grid-cols-2">
            <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-[#4A0F14] text-[10px] text-white">New</span>
            <div>
              <p className="text-xl text-[#8C857F]">Ready for</p>
              <p className={cn(display, "text-2xl font-semibold text-[#4A0F14]")}>THE BIG MOMENT</p>
              <Button variant="tan" className="mt-4">All black</Button>
            </div>
            <RealImage src={SHOE_IMAGES.formal} alt="Black formal shoe" className="rounded-lg" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   7. Best Sellers
──────────────────────────────────────────────────────────────────────────── */

function BestSellers({ wishlist, onAdd, onWish }: ShelfProps) {
  const track = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"all" | "sale" | "best">("all");

  const items = BEST_SELLERS.filter((p) => (tab === "all" ? true : tab === "sale" ? p.tag === "Sale" : p.tag === "Best seller"));
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  const tabs = [
    { id: "all", label: "All" },
    { id: "best", label: "Best sellers" },
    { id: "sale", label: "On sale" },
  ] as const;

  return (
    <section className="py-16 md:py-24" aria-labelledby="best-title">
      <Container>
        <SectionTitle id="best-title" title="Best sellers" subtitle="The pairs our customers buy again and again." />

        <div role="tablist" aria-label="Filter best sellers" className="mb-10 flex justify-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative min-h-10 rounded-sm px-5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9794A]",
                tab === t.id ? "text-white" : "border border-[#C29868] text-[#8A5F36]"
              )}
            >
              {tab === t.id && <motion.span layoutId="best-tab" className="absolute inset-0 rounded-sm bg-[#A9794A]" transition={{ duration: 0.3, ease: EASE }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        <div ref={track} className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 scrollbar-none sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <AnimatePresence mode="popLayout">
            {items.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-[62%] shrink-0 snap-start sm:w-[34%] md:w-[26%] lg:w-[21.5%]"
              >
                <ProductCard product={p} wished={wishlist.has(p.id)} onAdd={() => onAdd(p)} onWish={() => onWish(p.id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-label={d === -1 ? "Scroll left" : "Scroll right"}
              onClick={() => scroll(d)}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#C29868] text-[#8A5F36] transition hover:bg-[#A9794A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9794A]"
            >
              {d === -1 ? <ChevronLeft width={18} height={18} /> : <ChevronRight width={18} height={18} />}
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   8. Why Choose Us / Brand Benefits
──────────────────────────────────────────────────────────────────────────── */

function WhyChooseUs() {
  return (
    <section className="border-y border-[#E7E5E4] bg-white" aria-label="Why shop with us">
      <Container>
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, text }, n) => (
            <li
              key={title}
              className={cn("flex flex-col items-center px-4 py-8 text-center", n > 0 && "lg:border-l lg:border-[#E7E5E4]", n % 2 === 1 && "max-lg:border-l max-lg:border-[#E7E5E4]", n > 1 && "max-lg:border-t max-lg:border-[#E7E5E4]")}
            >
              <motion.span whileHover={{ y: -4 }} className="mb-3 text-[#A9794A]">
                <Icon width={26} height={26} strokeWidth={1.5} />
              </motion.span>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4A0F14]">{title}</h3>
              <p className="mt-2 max-w-55 text-xs leading-relaxed text-[#6B645F]">{text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   9. Product / Feature Spotlight
──────────────────────────────────────────────────────────────────────────── */

function ProductSpotlight({ onAdd }: { onAdd: (p: Product) => void }) {
  const hero: Product = { id: "spot", name: "Stratford Oxford", price: 139, rating: 4.9, reviews: 305, color: "#1C1917" };
  const specs = [
    { t: "Full-grain calf leather", d: "Tanned in Northampton and left unlined at the toe so it moulds to your foot." },
    { t: "Goodyear-welted sole", d: "Stitched, not glued. A cobbler can re-sole it again and again." },
    { t: "Cushioned insole", d: "Cork-and-latex footbed that stays comfortable past the first hour." },
  ];
  return (
    <section className="bg-[#F7F2EA] py-16 md:py-24" aria-labelledby="spot-title">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-xl bg-white p-8 shadow-[0_10px_30px_-12px_rgb(0_0_0/.15)]">
            <motion.div animate={{ scale: [1, 1.015, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="aspect-4/3 overflow-hidden rounded-lg">
              <RealImage src={SHOE_IMAGES.formal} alt="Stratford Oxford leather shoe" />
            </motion.div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 id="spot-title" className={cn(serif, "text-3xl italic text-[#4A0F14] md:text-4xl")}>The Stratford Oxford</h2>
          <div className="mt-3 flex items-center gap-2 text-sm text-[#6B645F]">
            <Stars value={hero.rating} /> {hero.rating} from {hero.reviews} reviews
          </div>
          <ul className="mt-8 space-y-5">
            {specs.map((s) => (
              <li key={s.t} className="border-l-2 border-[#A9794A] pl-4">
                <h3 className="text-sm font-semibold text-[#1C1917]">{s.t}</h3>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-[#6B645F]">{s.d}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-6">
            <p className="text-2xl font-semibold text-[#4A0F14]">{money(hero.price)}</p>
            <Button onClick={() => onAdd(hero)}>Add to bag</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   10. Shop by Style / Occasion
──────────────────────────────────────────────────────────────────────────── */

function ShopByOccasion() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="occ-title">
      <Container>
        <SectionTitle id="occ-title" title="Shop by occasion" subtitle="Tell us where you're headed and we'll point you to the right pair." />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {OCCASIONS.map(({ icon: Icon, name }) => (
            <li key={name}>
              <a
                href="#"
                className="group flex flex-col items-center gap-3 rounded-xl border border-[#E7E5E4] bg-white px-4 py-7 transition hover:border-[#A9794A] hover:bg-[#F7F2EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9794A]"
              >
                <Icon width={26} height={26} strokeWidth={1.5} color={C.tan} className="transition-transform group-hover:-translate-y-1" />
                <span className="text-sm font-medium text-[#4A0F14]">{name}</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   11. Customer Reviews / Social Proof
──────────────────────────────────────────────────────────────────────────── */

function CustomerReviews() {
  return (
    <section className="bg-[#4A0F14] py-16 text-white md:py-24" aria-labelledby="rev-title">
      <Container>
        <SectionTitle id="rev-title" light title="Loved by 12,000+ customers" subtitle="Rated 4.8 out of 5 across 3,400 verified reviews." />
        <div className="grid gap-4 md:grid-cols-3">
          {REVIEWS.map((r, n) => (
            <Reveal key={r.name} delay={n * 0.08}>
              <figure className="h-full rounded-xl bg-white p-6 text-[#1C1917]">
                <Stars value={r.rating} />
                <blockquote className="mt-4 text-sm leading-relaxed">{r.text}</blockquote>
                <figcaption className="mt-5 text-xs text-[#6B645F]">
                  <span className="font-semibold text-[#4A0F14]">{r.name}</span>, {r.place}. Verified buyer
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   12. Brand Story
──────────────────────────────────────────────────────────────────────────── */

function BrandStory() {
  return (
    <section className="bg-[#F7F2EA]" aria-labelledby="story-title">
      <Container className="grid items-stretch gap-0 py-16 md:py-24 lg:grid-cols-[1.1fr_1fr]">
        <Reveal className="grid place-items-center bg-[#6B4A32] p-10">
          <div className="grid grid-cols-2 gap-3">
            {[SHOE_IMAGES.formal, SHOE_IMAGES.brown, SHOE_IMAGES.lifestyle, SHOE_IMAGES.boots].map((src, n) => (
              <div key={src} className="aspect-square overflow-hidden rounded-md">
                <RealImage src={src} alt={`Craftsmanship detail ${n + 1}`} className="transition-transform duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="bg-white p-8 md:p-12">
          <h2 id="story-title" className={cn(serif, "text-3xl italic text-[#4A0F14] md:text-4xl")}>Made slowly, worn for years</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#6B645F]">
            We started in a small Northampton workshop in 1987 with one belief: a good shoe should outlast the trend it was designed in.
            Every pair is cut from full-grain leather, stitched by hand and built on a last that has been refined for decades.
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#6B645F]">
            We sell direct, so you pay for the craft rather than the middleman, and we'll re-sole your shoes when the time comes.
          </p>
          <div className="mt-8 flex flex-wrap gap-8 text-[#4A0F14]">
            {[["35+", "years of craft"], ["100%", "full-grain leather"], ["12,000+", "pairs re-soled"]].map(([n, l]) => (
              <div key={l}>
                <p className={cn(display, "text-2xl font-semibold")}>{n}</p>
                <p className="text-xs text-[#6B645F]">{l}</p>
              </div>
            ))}
          </div>
          <Button variant="maroon" className="mt-8">Read our story</Button>
        </Reveal>
      </Container>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   13. Editorial / Style Guide
──────────────────────────────────────────────────────────────────────────── */

function EditorialGuide() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="ed-title">
      <Container>
        <SectionTitle id="ed-title" title="From the journal" subtitle="Care tips, style advice and seasonal edits." />
        <div className="grid gap-6 md:grid-cols-3">
          {ARTICLES.map((a, n) => (
            <Reveal key={a.title} delay={n * 0.08}>
              <a href="#" className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9794A]">
                <div className="aspect-4/3 overflow-hidden rounded-lg bg-[#EDEDED]">
                  <RealImage
                    src={[SHOE_IMAGES.brown, SHOE_IMAGES.formal, SHOE_IMAGES.boots][n]}
                    alt={a.title}
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-xs text-[#A9794A]">{a.tag}, {a.read}</p>
                <h3 className={cn(serif, "mt-1.5 text-xl leading-snug text-[#4A0F14] group-hover:underline")}>{a.title}</h3>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   14. Instagram / UGC / Community
──────────────────────────────────────────────────────────────────────────── */

function CommunityGallery() {
  const tiles = [
    { c: "#7A3B1D", bg: "#EDEDED" }, { c: "#1C1917", bg: "#F7F2EA" }, { c: "#A9794A", bg: "#EDEDED" },
    { c: "#5C1219", bg: "#F7F2EA" }, { c: "#E8E2D6", bg: "#D9D2C5" }, { c: "#2B1B16", bg: "#EDEDED" },
  ];
  return (
    <section className="bg-white pb-16 md:pb-24" aria-labelledby="ugc-title">
      <Container>
        <SectionTitle id="ugc-title" title="Worn by you" subtitle="Tag @shoes.partner for a chance to be featured." />
        <ul className="grid grid-cols-3 gap-2 md:gap-3 lg:grid-cols-6">
          {tiles.map((t, n) => (
            <li key={n}>
              <a
                href="#"
                aria-label={`Customer photo ${n + 1} on Instagram`}
                className="group relative grid aspect-square place-items-center overflow-hidden rounded-lg p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9794A]"
                style={{ background: t.bg }}
              >
                <RealImage
                  src={[SHOE_IMAGES.lifestyle, SHOE_IMAGES.whiteSneaker, SHOE_IMAGES.redSneaker, SHOE_IMAGES.brown, SHOE_IMAGES.formal, SHOE_IMAGES.boots][n]}
                  alt={`Customer shoe style ${n + 1}`}
                  className="transition-transform duration-700 group-hover:scale-110"
                />
                {/* <span className="absolute inset-0 grid place-items-center bg-[#4A0F14]/70 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <SocialIcon platform="instagram" className="text-white" width={24} height={24} />
                </span> */}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   15. Newsletter / Final CTA
──────────────────────────────────────────────────────────────────────────── */

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(/^\S+@\S+\.\S+$/.test(email) ? "done" : "error");
  };

  return (
    <section className="bg-[#A9794A] py-16 text-white md:py-20" aria-labelledby="news-title">
      <Container className="text-center">
        <Gift className="mx-auto mb-4" width={28} height={28} strokeWidth={1.5} />
        <h2 id="news-title" className={cn(serif, "text-3xl italic md:text-4xl")}>Get 10% off your first order</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/85">Join the list for early access to new collections and care tips. No spam, unsubscribe any time.</p>

        {status === "done" ? (
          <p role="status" className="mt-8 text-sm font-semibold">Thanks. Check your inbox for your 10% code.</p>
        ) : (
          <form onSubmit={submit} noValidate className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="nl-email" className="sr-only">Email address</label>
            <input
              id="nl-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder="Your email address"
              aria-invalid={status === "error"}
              aria-describedby={status === "error" ? "nl-error" : undefined}
              className="h-12 flex-1 rounded-full bg-white px-5 text-sm text-[#1C1917] outline-none placeholder:text-[#8C857F] focus-visible:ring-2 focus-visible:ring-[#4A0F14]"
            />
            <Button type="submit" variant="maroon">Get my 10% off</Button>
          </form>
        )}
        {status === "error" && (
          <p id="nl-error" role="alert" className="mt-3 text-sm text-white">Enter a valid email address, like name@example.com.</p>
        )}
      </Container>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   16. Footer
──────────────────────────────────────────────────────────────────────────── */

function Footer() {
  const socialLinks = [
    { label: "Instagram", platform: "instagram" },
    { label: "Facebook", platform: "facebook" },
    { label: "YouTube", platform: "youtube" },
  ] as const;

  return (
    <footer className="bg-[#2E080B] text-white/80">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className={cn(display, "text-2xl font-semibold text-white")}>
            Shoes
          </p>

          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            Hand-finished leather shoes and boots from Northampton, delivered
            free across the UK on orders over £75.
          </p>

          {/* Social icons can be enabled later */}
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
              {col.title}
            </h3>

            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="transition-colors hover:text-[#C29868]"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs md:flex-row">
          
          {/* Fixed year prevents prerender/hydration issues */}
          <p>© 2026 Shoes Ltd. All rights reserved.</p>

          <ul
            className="flex flex-wrap justify-center gap-2"
            aria-label="Accepted payment methods"
          >
            {PAYMENTS.map((p) => (
              <li
                key={p}
                className="rounded border border-white/20 px-2.5 py-1 text-[10px] uppercase tracking-wider"
              >
                {p}
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Bag toast (lightweight cart feedback; replace with a drawer when ready)
──────────────────────────────────────────────────────────────────────────── */

function BagToast({ message }: { message: string | null }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="rounded-full bg-[#4A0F14] px-6 py-3 text-sm text-white shadow-[0_10px_30px_-12px_rgb(0_0_0/.4)]"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Landing page — composes sections 1–16 in order
──────────────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const addToCart = useCallback((p: Product) => {
    setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }));
    setToast(`${p.name} added to your bag`);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const toggleWish = useCallback((id: string) => {
    setWishlist((w) => {
      const next = new Set(w);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }, []);

  const openCart = () => {
    setToast(cartCount ? `${cartCount} item${cartCount > 1 ? "s" : ""} in your bag` : "Your bag is empty");
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn(cinzel.variable, playfair.variable, inter.variable, "min-h-screen bg-white font-(family-name:--font-body) text-[#1C1917] antialiased")}>
        <AnnouncementBar />
        <Header cartCount={cartCount} wishCount={wishlist.size} onCartClick={openCart} />
        <main>
          <Hero />
          <ShopByCategory />
          <NewArrivals wishlist={wishlist} onAdd={addToCart} onWish={toggleWish} />
          <FeaturedCollection />
          <BestSellers wishlist={wishlist} onAdd={addToCart} onWish={toggleWish} />
          <WhyChooseUs />
          <ProductSpotlight onAdd={addToCart} />
          <ShopByOccasion />
          <CustomerReviews />
          <BrandStory />
          <EditorialGuide />
          <CommunityGallery />
          <Newsletter />
        </main>
        <Footer />
        <BagToast message={toast} />
      </div>
    </MotionConfig>
  );
}