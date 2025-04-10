"use client";
import Cookies from "js-cookie";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  User,
  GlassWater,
  Utensils,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ShoppingCart,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Award,
  Flame,
  ThumbsUp,
  DollarSign,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValueEvent,
} from "framer-motion";
import { ReservationForm } from "@/components/reservation-form";
import { MenuCard } from "@/components/menu-card";
import { SpecialtyDish } from "@/components/specialty-dish";
import { ChefCard } from "@/components/chef-card";
import { InstagramFeed } from "@/components/instagram-feed";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { PromotionCard } from "@/components/promotion-card";
import { FoodCustomizer } from "@/components/food-customizer";
import { LanguageSwitcher } from "@/components/language-switcher";
import { OrderCart } from "@/components/order-cart";
import { useLanguage } from "@/context/language-context";
import {
  categoryAPI,
  chefSpecialtiesAPI,
  galleryAPI,
  menuAPI,
  offersAPI,
  testimonialAPI,
} from "@/utils/api";
import { set } from "date-fns";

export default function Home() {
  const { t, dir } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("sushi");
  const [loadingMenuItems, setLoadingMenuItems] = useState(false);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeGalleryImage, setActiveGalleryImage] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [customizeItem, setCustomizeItem] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePromotion, setActivePromotion] = useState(0);
  const [offers, setOffers] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [serverTestimonials, setServerTestimonials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState([]);
  // In the component, add a state to track how many images are visible
  const [visibleImages, setVisibleImages] = useState(6);

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Parallax effect for about section
  const { scrollYProgress: aboutScrollProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });

  const aboutImageY = useTransform(aboutScrollProgress, [0, 1], [-50, 50]);
  const aboutTextY = useTransform(aboutScrollProgress, [0, 1], [50, -50]);

  const { scrollYProgress: pageScrollProgress } = useScroll();

  useMotionValueEvent(pageScrollProgress, "change", (latest) => {
    setScrollProgress(latest);
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsHeaderFixed(true);
      } else {
        setIsHeaderFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsMenuOpen(false);
    }
  };

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
    setCartOpen(true);
  };

  const openCustomize = (item) => {
    setCustomizeItem(item);
    setCustomizeOpen(true);
  };

  // Add a function to show more images
  const showMoreImages = () => {
    setVisibleImages((prev) => Math.min(prev + 6, galleryImages.length));
  };

  const getOffers = async () => {
    try {
      const activeOffers = await offersAPI.getOffers({
        active: true,
        page: 1,
        limit: 10,
      });
      setOffers(activeOffers.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getChefSpecialties = async () => {
    try {
      const data = await chefSpecialtiesAPI.getChefSpecialties({
        page: 1,
        limit: 10,
      });
      setSpecialties(data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getGalleryImages = async () => {
    try {
      const images = await galleryAPI.getGalleryImages({
        page: 1,
        limit: 10,
      });
      setGallery(images.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getTestimonials = async () => {
    try {
      const data = await testimonialAPI.getTestimonials({
        page: 1,
        limit: 10,
      });
      setServerTestimonials(data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCategories = async () => {
    try {
      const data = await categoryAPI.getPaginatedCategories({
        page: 1,
        limit: 10,
        active: true,
      });
      console.log(data.data);
      setCategories(data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getMenuItems = async () => {
    setLoadingMenuItems(true);
    try {
      const data = await menuAPI.getItems({
        page: 1,
        limit: 10,
      });
      console.log(data.data);
      setMenu(data.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingMenuItems(false);
    }
  };

  const getMenuItemsByCategory = async (id) => {
    setLoadingMenuItems(true);
    try {
      const data = await menuAPI.getItemsByCategory(id, {
        page: 1,
        limit: 10,
      });
      console.log(data);
      setMenu(data.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingMenuItems(false);
    }
  };

  useEffect(() => {
    getOffers();
    getChefSpecialties();
    getGalleryImages();
    getTestimonials();
    getCategories();
    getMenuItems();
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Karina Feliciana",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
      rating: 5,
      title: "Pecinta Sushi wajib banget cobain Sushibre",
      comment:
        "Rasanya enak semuanya bikin kenyang cobain semua bikin kenyang terjangkau untuk kaum milenial. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque turpis odio sed odio venenatis semper.",
    },
    {
      id: 2,
      name: "Anisa Zahra",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
      rating: 5,
      title: "Sushi terbaik yang pernah saya coba",
      comment:
        "Rasanya autentik dan bahan-bahannya sangat segar. Pelayanannya juga ramah dan cepat. Pasti akan kembali lagi untuk mencoba menu lainnya. Harganya juga sangat terjangkau untuk kualitas yang ditawarkan.",
    },
    {
      id: 3,
      name: "David Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
      rating: 5,
      title: "A culinary journey to Japan without leaving town",
      comment:
        "The attention to detail in each dish is remarkable. From the presentation to the flavors, everything is perfectly balanced. The chef clearly understands the art of sushi making. I've been to Japan multiple times and this is as authentic as it gets.",
    },
  ];

  const menuItems = {
    appetizer: [
      {
        id: 1,
        name: "Edamame",
        description: "Steamed young soybeans lightly seasoned with sea salt",
        price: 4.5,
        image:
          "https://images.unsplash.com/photo-1615361200141-f45625a9296d?q=80&w=600&auto=format&fit=crop",
        rating: 4.8,
        spicy: false,
        vegetarian: true,
        popular: false,
      },
      {
        id: 2,
        name: "Gyoza",
        description:
          "Pan-fried dumplings filled with seasoned ground pork and vegetables",
        price: 6.75,
        image:
          "https://images.unsplash.com/photo-1625938145744-e380515399b7?q=80&w=600&auto=format&fit=crop",
        rating: 4.9,
        spicy: false,
        vegetarian: false,
        popular: true,
      },
      {
        id: 3,
        name: "Miso Soup",
        description:
          "Traditional Japanese soup with tofu, seaweed, and green onions",
        price: 3.25,
        image:
          "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?q=80&w=600&auto=format&fit=crop",
        rating: 4.7,
        spicy: false,
        vegetarian: true,
        popular: false,
      },
      {
        id: 4,
        name: "Agedashi Tofu",
        description: "Lightly fried tofu served in a flavorful dashi broth",
        price: 5.5,
        image:
          "https://images.unsplash.com/photo-1546069901-5ec6a79120b0?q=80&w=600&auto=format&fit=crop",
        rating: 4.6,
        spicy: false,
        vegetarian: true,
        popular: false,
      },
      {
        id: 5,
        name: "Takoyaki",
        description:
          "Octopus-filled savory balls topped with takoyaki sauce and bonito flakes",
        price: 7.25,
        image:
          "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=600&auto=format&fit=crop",
        rating: 4.8,
        spicy: false,
        vegetarian: false,
        popular: true,
      },
      {
        id: 6,
        name: "Spicy Tuna Tartare",
        description:
          "Fresh tuna mixed with spicy mayo, served with wonton chips",
        price: 9.95,
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=600&auto=format&fit=crop",
        rating: 4.9,
        spicy: true,
        vegetarian: false,
        popular: true,
      },
    ],
    sushi: [
      {
        id: 1,
        name: "Salmon Nigiri",
        description: "Fresh salmon over seasoned rice",
        price: 8.5,
        image:
          "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop",
        rating: 5.0,
        spicy: false,
        vegetarian: false,
        popular: true,
      },
      {
        id: 2,
        name: "Dragon Roll",
        description: "Eel and cucumber inside, avocado and tobiko on top",
        price: 12.95,
        image:
          "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=600&auto=format&fit=crop",
        rating: 4.9,
        spicy: false,
        vegetarian: false,
        popular: true,
      },
      {
        id: 3,
        name: "Tuna Sashimi",
        description:
          "Thinly sliced fresh tuna served with wasabi and soy sauce",
        price: 10.75,
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=600&auto=format&fit=crop",
        rating: 4.8,
        spicy: false,
        vegetarian: false,
        popular: false,
      },
      {
        id: 4,
        name: "California Roll",
        description: "Crab, avocado, and cucumber wrapped in seaweed and rice",
        price: 8.25,
        image:
          "https://images.unsplash.com/photo-1559410545-0bdcd187e323?q=80&w=600&auto=format&fit=crop",
        rating: 4.7,
        spicy: false,
        vegetarian: false,
        popular: true,
      },
      {
        id: 5,
        name: "Spicy Tuna Roll",
        description: "Spicy tuna and cucumber wrapped in seaweed and rice",
        price: 9.5,
        image:
          "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=600&auto=format&fit=crop",
        rating: 4.8,
        spicy: true,
        vegetarian: false,
        popular: true,
      },
      {
        id: 6,
        name: "Rainbow Roll",
        description: "California roll topped with assorted sashimi",
        price: 13.95,
        image:
          "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?q=80&w=600&auto=format&fit=crop",
        rating: 4.9,
        spicy: false,
        vegetarian: false,
        popular: true,
      },
      {
        id: 7,
        name: "Vegetable Roll",
        description: "Assorted fresh vegetables wrapped in seaweed and rice",
        price: 7.5,
        image:
          "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop",
        rating: 4.6,
        spicy: false,
        vegetarian: true,
        popular: false,
      },
      {
        id: 8,
        name: "Unagi Nigiri",
        description: "Grilled freshwater eel over seasoned rice",
        price: 9.25,
        image:
          "https://images.unsplash.com/photo-1562158074-d49fbeffcc91?q=80&w=600&auto=format&fit=crop",
        rating: 4.8,
        spicy: false,
        vegetarian: false,
        popular: false,
      },
    ],
    drink: [
      {
        id: 1,
        name: "Sake",
        description: "Traditional Japanese rice wine served warm or cold",
        price: 7.5,
        image:
          "https://images.unsplash.com/photo-1627517511589-b920f2c1a30b?q=80&w=600&auto=format&fit=crop",
        rating: 4.8,
        alcoholic: true,
        popular: true,
      },
      {
        id: 2,
        name: "Matcha Tea",
        description: "Premium Japanese green tea with a rich, earthy flavor",
        price: 4.25,
        image:
          "https://images.unsplash.com/photo-1563929084-73cd4bbe2ddc?q=80&w=600&auto=format&fit=crop",
        rating: 4.9,
        alcoholic: false,
        popular: true,
      },
      {
        id: 3,
        name: "Ramune",
        description: "Japanese marble soda available in various flavors",
        price: 3.75,
        image:
          "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=600&auto=format&fit=crop",
        rating: 4.7,
        alcoholic: false,
        popular: true,
      },
      {
        id: 4,
        name: "Asahi Beer",
        description: "Popular Japanese lager with a crisp, dry taste",
        price: 5.5,
        image:
          "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?q=80&w=600&auto=format&fit=crop",
        rating: 4.8,
        alcoholic: true,
        popular: true,
      },
      {
        id: 5,
        name: "Yuzu Lemonade",
        description: "Refreshing lemonade infused with Japanese yuzu citrus",
        price: 4.5,
        image:
          "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop",
        rating: 4.7,
        alcoholic: false,
        popular: false,
      },
      {
        id: 6,
        name: "Plum Wine",
        description: "Sweet Japanese wine made from ume plums",
        price: 6.75,
        image:
          "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=600&auto=format&fit=crop",
        rating: 4.6,
        alcoholic: true,
        popular: false,
      },
    ],
    bento: [
      {
        id: 1,
        name: "Salmon Bento",
        description: "Grilled salmon with rice, miso soup, salad, and gyoza",
        price: 15.95,
        image:
          "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?q=80&w=600&auto=format&fit=crop",
        rating: 4.9,
        spicy: false,
        vegetarian: false,
        popular: true,
      },
      {
        id: 2,
        name: "Teriyaki Chicken Bento",
        description:
          "Teriyaki chicken with rice, miso soup, salad, and tempura",
        price: 14.5,
        image:
          "https://images.unsplash.com/photo-1596797038530-2c107aa4e0dc?q=80&w=600&auto=format&fit=crop",
        rating: 4.8,
        spicy: false,
        vegetarian: false,
        popular: true,
      },
      {
        id: 3,
        name: "Vegetable Bento",
        description:
          "Assorted vegetable tempura with rice, miso soup, and salad",
        price: 13.75,
        image:
          "https://images.unsplash.com/photo-1546069901-5ec6a79120b0?q=80&w=600&auto=format&fit=crop",
        rating: 4.7,
        spicy: false,
        vegetarian: true,
        popular: false,
      },
      {
        id: 4,
        name: "Sushi Bento",
        description: "Assorted sushi with miso soup, salad, and tempura",
        price: 17.95,
        image:
          "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop",
        rating: 4.9,
        spicy: false,
        vegetarian: false,
        popular: true,
      },
    ],
  };

  const specialtyDishes = [
    {
      id: 1,
      name: "Omakase Sushi Platter",
      description: "Chef's selection of premium sushi and sashimi",
      price: 45.0,
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop",
      ingredients: [
        "Premium Tuna",
        "Salmon",
        "Yellowtail",
        "Eel",
        "Shrimp",
        "Scallop",
        "Uni",
        "Ikura",
      ],
      preparationTime: "25 minutes",
      calories: 850,
      rating: 4.9,
    },
    {
      id: 2,
      name: "Wagyu Beef Tataki",
      description: "Lightly seared A5 Wagyu beef with ponzu sauce",
      price: 38.0,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
      ingredients: [
        "A5 Wagyu Beef",
        "Ponzu Sauce",
        "Green Onion",
        "Garlic Chips",
        "Micro Greens",
      ],
      preparationTime: "20 minutes",
      calories: 520,
      rating: 5.0,
    },
    {
      id: 3,
      name: "Lobster Tempura Roll",
      description: "Tempura lobster roll with avocado and special sauce",
      price: 32.0,
      image:
        "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=800&auto=format&fit=crop",
      ingredients: [
        "Maine Lobster",
        "Avocado",
        "Cucumber",
        "Tempura Batter",
        "Spicy Mayo",
        "Eel Sauce",
      ],
      preparationTime: "30 minutes",
      calories: 680,
      rating: 4.8,
    },
  ];

  const chefs = [
    {
      id: 1,
      name: "Takashi Yamamoto",
      title: "Executive Chef",
      bio: "With over 20 years of experience in traditional Japanese cuisine, Chef Takashi trained in Tokyo before bringing his expertise to Sushibre.",
      image:
        "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=400&auto=format&fit=crop",
      specialties: ["Omakase", "Nigiri", "Traditional Sushi"],
      awards: ["Best Sushi Chef 2022", "Culinary Excellence Award"],
    },
    {
      id: 2,
      name: "Mei Lin",
      title: "Head Sushi Chef",
      bio: "Chef Mei combines traditional techniques with innovative flavors, creating unique sushi experiences that surprise and delight.",
      image:
        "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=400&auto=format&fit=crop",
      specialties: ["Fusion Rolls", "Sashimi Art", "Vegetarian Sushi"],
      awards: ["Rising Star Chef 2023", "Innovation in Cuisine Award"],
    },
    {
      id: 3,
      name: "Hiroshi Tanaka",
      title: "Master Sake Sommelier",
      bio: "Hiroshi is an expert in sake pairing, helping guests discover the perfect complement to their meal.",
      image:
        "https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=400&auto=format&fit=crop",
      specialties: ["Sake Pairing", "Beverage Curation", "Japanese Spirits"],
      awards: ["Certified Sake Expert", "International Sommelier Award"],
    },
  ];

  const promotions = [
    {
      id: 1,
      title: "Happy Hour Special",
      description: "Enjoy 30% off all appetizers and drinks from 4-6pm daily",
      image:
        "https://images.unsplash.com/photo-1625938145744-e380515399b7?q=80&w=800&auto=format&fit=crop",
      discount: "30% OFF",
      validUntil: "Daily, 4-6pm",
      code: "HAPPY30",
    },
    {
      id: 2,
      title: "Weekend Brunch",
      description: "All-you-can-eat sushi brunch every Saturday and Sunday",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop",
      discount: "$29.99",
      validUntil: "Weekends, 11am-3pm",
      code: "BRUNCH",
    },
    {
      id: 3,
      title: "First Order Discount",
      description: "20% off your first online order when you sign up",
      image:
        "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=800&auto=format&fit=crop",
      discount: "20% OFF",
      validUntil: "New customers only",
      code: "WELCOME20",
    },
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?q=80&w=1200&auto=format&fit=crop",
  ];

  const instagramPosts = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400&auto=format&fit=crop",
      likes: 245,
      comments: 18,
      caption: "Fresh sushi for lunch! #sushibre #foodie",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=400&auto=format&fit=crop",
      likes: 312,
      comments: 24,
      caption: "Dragon roll perfection 🔥 #sushilover",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=400&auto=format&fit=crop",
      likes: 189,
      comments: 12,
      caption: "Sushi date night with bae ❤️ #datenight",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1584583570840-0a3d88497593?q=80&w=400&auto=format&fit=crop",
      likes: 276,
      comments: 21,
      caption: "Behind the scenes with our chef! #chefsofinstagram",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1625938145744-e380515399b7?q=80&w=400&auto=format&fit=crop",
      likes: 203,
      comments: 15,
      caption: "Gyoza appetizers to start the meal right #japanesefood",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?q=80&w=400&auto=format&fit=crop",
      likes: 298,
      comments: 27,
      caption: "Bento box lunch special today! #lunchtime",
    },
  ];

  return (
    <div
      className="bg-[#121212] text-white min-h-screen overflow-x-hidden"
      dir={dir}
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-800">
        <motion.div
          className="h-full bg-orange-500"
          style={{ scaleX: scrollProgress, transformOrigin: "0%" }}
        />
      </div>

      {/* Navigation */}
      <header
        className={`w-full py-4 z-50 transition-all duration-300 ${
          isHeaderFixed
            ? "fixed top-0 bg-[#121212]/90 backdrop-blur-md shadow-lg"
            : ""
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8.21 13.89 7 23l-5-1L8.21 5.11a8 8 0 0 1 15.58 0L20 22l-5 1-1.21-9.11" />
              </svg>
            </div>
            <span className="font-bold text-xl">Sushibre</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-orange-400 transition-colors relative group"
            >
              {t("nav.about")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => scrollToSection("menu")}
              className="hover:text-orange-400 transition-colors relative group"
            >
              {t("nav.menu")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="hover:text-orange-400 transition-colors relative group"
            >
              {t("nav.testimonials")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="hover:text-orange-400 transition-colors relative group"
            >
              {t("nav.contact")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <Link
              href="/admin"
              className="hover:text-orange-400 transition-colors relative group"
            >
              {t("nav.admin")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              className="relative bg-transparent border border-gray-600 rounded-full p-2 hover:bg-gray-800 transition-colors"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart size={16} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <Link
              href="/auth/login"
              className="bg-transparent border border-gray-600 rounded-full px-4 py-1 flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <User size={16} />
              <span>{t("nav.login")}</span>
            </Link>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-full font-medium transition-colors hidden md:block"
              onClick={() => setReservationOpen(true)}
            >
              {t("nav.reserve")}
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex flex-col p-6"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center h-full gap-8 text-2xl">
              <button
                onClick={() => scrollToSection("about")}
                className="hover:text-orange-400 transition-colors"
              >
                {t("nav.about")}
              </button>
              <button
                onClick={() => scrollToSection("menu")}
                className="hover:text-orange-400 transition-colors"
              >
                {t("nav.menu")}
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="hover:text-orange-400 transition-colors"
              >
                {t("nav.testimonials")}
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="hover:text-orange-400 transition-colors"
              >
                {t("nav.contact")}
              </button>
              <Link
                href="/admin"
                className="hover:text-orange-400 transition-colors"
              >
                {t("nav.admin")}
              </Link>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium transition-colors mt-4"
                onClick={() => {
                  setReservationOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                {t("nav.reserve")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1920&auto=format&fit=crop"
            alt="Sushi background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-[#121212]/60 to-[#121212]"></div>
        </div>

        <motion.div
          style={{ opacity, y }}
          className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center relative z-10"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="perspective"
            >
              <motion.p
                className="text-orange-500 font-medium mb-2"
                initial={{ rotateX: 90 }}
                animate={{ rotateX: 0 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
              >
                {t("hero.tagline")}
              </motion.p>
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {t("hero.title")}
              </motion.h1>
              <motion.p
                className="text-gray-400 mb-8 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                {t("hero.description")}
              </motion.p>
              <motion.button
                onClick={() => scrollToSection("menu")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {t("hero.cta")}
              </motion.button>
            </motion.div>

            <motion.div
              className="mt-12 flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-full border-2 border-[#121212] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
                    alt="Customer"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-[#121212] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                    alt="Customer"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-[#121212] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
                    alt="Customer"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="font-medium">{t("hero.customers")}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.9 (150 {t("hero.reviews")})</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative hidden md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div
              className="relative w-full h-[500px]"
              animate={{
                y: [0, -10, 0],
                rotateZ: [0, 2, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 6,
                ease: "easeInOut",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop"
                alt="Sushi platter"
                fill
                className="object-cover rounded-2xl"
              />
              <motion.div
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500 rounded-full flex items-center justify-center transform rotate-12 shadow-xl"
                animate={{
                  rotate: [12, 20, 12],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 5,
                  ease: "easeInOut",
                }}
              >
                <div className="transform -rotate-12 text-center">
                  <p className="font-bold text-xl">20%</p>
                  <p className="text-sm">DISCOUNT</p>
                  <p className="text-xs">FOR FIRST ORDER</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute bottom-4 right-4 bg-[#1E1E1E]/80 backdrop-blur-sm p-4 rounded-lg shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=100&auto=format&fit=crop"
                    alt="Salmon"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">Fresh Salmon</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm">$8</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight size={24} className="rotate-90" />
        </div>
      </section>

      {/* Promotions Slider */}
      <section className="py-12 bg-gradient-to-r from-[#1a1a1a] to-[#121212]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {t("offers.title")}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t("offers.description")}
            </p>
          </motion.div>

          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: `-${activePromotion * 100}%` }}
                transition={{ duration: 0.5 }}
              >
                {offers.map((promo, index) => (
                  <div key={promo._id} className="min-w-full">
                    <PromotionCard promotion={promo} />
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="flex justify-center mt-8 gap-2">
              {offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActivePromotion(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activePromotion
                      ? "bg-orange-500 w-8"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section id="menu" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("menu.title")}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t("menu.description")}
          </p>
        </motion.div>

        {categories.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {categories.map((category) => {
              // Create a slug from the category name for comparison
              const categorySlug = category.name
                .toLowerCase()
                .replace(/\s+/g, "-");

              return (
                <button
                  key={category._id}
                  onClick={() => {
                    getMenuItemsByCategory(category._id);
                    setActiveCategory(categorySlug);
                  }}
                  className={`flex items-center gap-2 p-4 rounded-lg transition-all duration-300 ${
                    activeCategory === categorySlug
                      ? "bg-orange-500 shadow-lg shadow-orange-500/20"
                      : "bg-[#1E1E1E] hover:bg-[#2a2a2a]"
                  }`}
                >
                  {/* You can add icons based on category name or type */}
                  {categorySlug.includes("appetizer") ? (
                    <Utensils
                      className={
                        activeCategory === categorySlug
                          ? "text-white"
                          : "text-gray-400"
                      }
                    />
                  ) : categorySlug.includes("sushi") ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={
                        activeCategory === categorySlug
                          ? "text-white"
                          : "text-gray-400"
                      }
                    >
                      <path d="M8 3v18M16 3v18" />
                      <path d="M8 12h8" />
                      <path d="M2 7h4" />
                      <path d="M18 7h4" />
                      <path d="M2 17h4" />
                      <path d="M18 17h4" />
                    </svg>
                  ) : categorySlug.includes("drink") ? (
                    <GlassWater
                      className={
                        activeCategory === categorySlug
                          ? "text-white"
                          : "text-gray-400"
                      }
                    />
                  ) : categorySlug.includes("bento") ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={
                        activeCategory === categorySlug
                          ? "text-white"
                          : "text-gray-400"
                      }
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M3 15h18" />
                      <path d="M9 3v18" />
                      <path d="M15 3v18" />
                    </svg>
                  ) : (
                    <Utensils
                      className={
                        activeCategory === categorySlug
                          ? "text-white"
                          : "text-gray-400"
                      }
                    />
                  )}
                  <span>{category.name}</span>
                </button>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading categories...</p>
          </div>
        )}

        {/* Menu Items */}
        <div className="mt-12">
          {loadingMenuItems ? (
            <div className="w-full flex justify-center items-center h-20 text-gray-600 animate-bounce">
              Loading...
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {menu.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {menu.map((item, index) => (
                      <MenuCard
                        key={item._id}
                        item={item}
                        index={index}
                        onAddToCart={() => addToCart(item)}
                        onCustomize={() => openCustomize(item)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">
                      No items available in this category.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Chef's Specialties */}
      <section className="py-20 bg-[#0E0E0E]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("specialties.title")}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t("specialties.description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specialties.map((dish, index) => (
              <SpecialtyDish
                key={dish._id}
                dish={dish}
                index={index}
                onAddToCart={() => addToCart(dish)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Our Chefs */}
      <section id="chefs" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("chefs.title")}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t("chefs.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {chefs.map((chef, index) => (
            <ChefCard key={chef.id} chef={chef} index={index} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold mb-2 uppercase text-orange-500">
            {t("testimonials.title")}
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-4">
            {t("testimonials.subtitle")}
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t("testimonials.description")}
          </p>
        </motion.div>
        {serverTestimonials.length > 0 && (
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-[#1E1E1E] rounded-xl p-8 shadow-xl"
              >
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={
                        star <=
                        Math.floor(serverTestimonials[activeTestimonial].rate)
                          ? "#facc15"
                          : "none"
                      }
                      stroke="#facc15"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <h4 className="font-medium text-xl mb-4">
                  {serverTestimonials[activeTestimonial].title}
                </h4>
                <p className="text-gray-400 text-lg mb-8">
                  "{serverTestimonials[activeTestimonial].comment}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={
                        serverTestimonials[activeTestimonial].user?.image ||
                        "/placeholder.svg"
                      }
                      alt={serverTestimonials[activeTestimonial].user?.name}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-lg">
                      {serverTestimonials[activeTestimonial].user?.name}
                    </p>
                    <p className="text-gray-400">Loyal Customer</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() =>
                setActiveTestimonial((prev) =>
                  prev === 0 ? serverTestimonials.length - 1 : prev - 1
                )
              }
              className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-6 md:-left-8 bg-[#F05B29] rounded-full p-3 hover:bg-orange-500 transition-colors duration-300 z-10"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={() =>
                setActiveTestimonial((prev) =>
                  prev === serverTestimonials.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-6 md:-right-8 bg-[#F05B29] rounded-full p-3 hover:bg-orange-500 transition-colors duration-300 z-10"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        <div className="flex justify-center mt-8 gap-2">
          {serverTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeTestimonial
                  ? "bg-orange-500 w-8"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            ></button>
          ))}
        </div>
      </section>

      {/* About Us */}
      <section
        id="about"
        ref={aboutRef}
        className="container mx-auto px-4 py-20 overflow-hidden"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="grid grid-cols-12 grid-rows-6 gap-4 h-[600px]"
            style={{ y: aboutImageY }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="col-span-8 row-span-3 rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop"
                alt="Sushi dish"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-4 row-span-6 rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1584583570840-0a3d88497593?q=80&w=400&auto=format&fit=crop"
                alt="Chef preparing sushi"
                width={400}
                height={800}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-8 row-span-3 rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop"
                alt="Sushi rolls"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            style={{ y: aboutTextY }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-orange-500 font-medium mb-2 uppercase">
              {t("about.title")}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t("about.subtitle")}
            </h2>
            <p className="text-gray-400 mb-6 text-lg leading-relaxed">
              {t("about.description1")}
            </p>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
              {t("about.description2")}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                  <Award size={24} />
                </div>
                <div>
                  <p className="font-bold">{t("about.features.quality")}</p>
                  <p className="text-sm text-gray-400">
                    {t("about.features.qualityDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                  <Flame size={24} />
                </div>
                <div>
                  <p className="font-bold">{t("about.features.chefs")}</p>
                  <p className="text-sm text-gray-400">
                    {t("about.features.chefsDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                  <ThumbsUp size={24} />
                </div>
                <div>
                  <p className="font-bold">{t("about.features.service")}</p>
                  <p className="text-sm text-gray-400">
                    {t("about.features.serviceDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="font-bold">{t("about.features.prices")}</p>
                  <p className="text-sm text-gray-400">
                    {t("about.features.pricesDesc")}
                  </p>
                </div>
              </div>
            </div>
            <motion.button
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("about.cta")}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20">
        <div className="container mx-auto px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("gallery.title")}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t("gallery.description")}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {gallery.slice(0, visibleImages).map((image, index) => (
            <motion.div
              key={index}
              className="relative overflow-hidden aspect-square cursor-pointer group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 0.95 }}
              onClick={() => {
                setIsGalleryOpen(true);
                setActiveGalleryImage(index);
              }}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show More Button */}
        {visibleImages < galleryImages.length && (
          <div className="mt-8 text-center">
            <motion.button
              onClick={showMoreImages}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Show More
            </motion.button>
          </div>
        )}
      </section>

      {/* Instagram Feed */}
      <section className="py-20 bg-[#0E0E0E]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("instagram.title")}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t("instagram.description")}
            </p>
          </motion.div>

          <InstagramFeed posts={instagramPosts} />
        </div>
      </section>

      {/* Gallery Lightbox */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute top-4 right-4 text-white"
              onClick={() => setIsGalleryOpen(false)}
            >
              <X size={32} />
            </button>

            <div className="relative w-full max-w-5xl aspect-video">
              <Image
                src={galleryImages[activeGalleryImage] || "/placeholder.svg"}
                alt={`Gallery image ${activeGalleryImage + 1}`}
                fill
                className="object-contain"
              />
            </div>

            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 rounded-full p-3 hover:bg-white/20 transition-colors"
              onClick={() =>
                setActiveGalleryImage((prev) =>
                  prev === 0 ? galleryImages.length - 1 : prev - 1
                )
              }
            >
              <ChevronLeft size={32} />
            </button>

            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 rounded-full p-3 hover:bg-white/20 transition-colors"
              onClick={() =>
                setActiveGalleryImage((prev) =>
                  prev === galleryImages.length - 1 ? 0 : prev + 1
                )
              }
            >
              <ChevronRight size={32} />
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === activeGalleryImage ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setActiveGalleryImage(index)}
                ></button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reservation Modal */}
      <AnimatePresence>
        {reservationOpen && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{t("nav.reserve")}</h3>
                <button onClick={() => setReservationOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <ReservationForm onClose={() => setReservationOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Food Customizer Modal */}
      <AnimatePresence>
        {customizeOpen && customizeItem && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Customize Your Order</h3>
                <button onClick={() => setCustomizeOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <FoodCustomizer
                item={customizeItem}
                onAddToCart={(item) => {
                  addToCart(item);
                  setCustomizeOpen(false);
                }}
                onCancel={() => setCustomizeOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            className="fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-[#1E1E1E] shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30 }}
          >
            <OrderCart
              items={cartItems}
              onClose={() => setCartOpen(false)}
              onRemoveItem={(id) =>
                setCartItems(cartItems.filter((item) => item._id !== id))
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-b from-[#121212] to-[#0E0E0E]">
        <div className="container mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0E0E0E] pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8.21 13.89 7 23l-5-1L8.21 5.11a8 8 0 0 1 15.58 0L20 22l-5 1-1.21-9.11" />
                  </svg>
                </div>
                <span className="font-bold text-2xl">Sushibre</span>
              </div>
              <p className="text-gray-400 mb-6">{t("footer.description")}</p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center hover:bg-orange-500 transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center hover:bg-orange-500 transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center hover:bg-orange-500 transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center hover:bg-orange-500 transition-colors"
                >
                  <Youtube size={20} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6">{t("footer.supports")}</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={16} className="text-orange-500" />
                    {t("footer.supportLinks.about")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={16} className="text-orange-500" />
                    {t("footer.supportLinks.howItWorks")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={16} className="text-orange-500" />
                    {t("footer.supportLinks.supportPolicy")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={16} className="text-orange-500" />
                    {t("footer.supportLinks.faq")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6">
                {t("footer.getInTouch")}
              </h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-orange-500">
                    <MapPin size={20} />
                  </div>
                  <span>{t("footer.address")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-orange-500">
                    <Phone size={20} />
                  </div>
                  <span>{t("footer.phone")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E1E1E] flex items-center justify-center text-orange-500">
                    <Mail size={20} />
                  </div>
                  <span>{t("footer.email")}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6">
                {t("footer.openingHours")}
              </h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <p className="font-medium">{t("footer.weekdays")}</p>
                  <p>11:00 AM - 10:00 PM</p>
                </li>
                <li>
                  <p className="font-medium">{t("footer.weekends")}</p>
                  <p>10:00 AM - 11:00 PM</p>
                </li>
                <li>
                  <p className="font-medium">{t("footer.holidays")}</p>
                  <p>12:00 PM - 9:00 PM</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © {new Date().getFullYear()} Sushibre. {t("footer.rights")}
              </p>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  {t("footer.terms")}
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  {t("footer.privacy")}
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  {t("footer.cookies")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
