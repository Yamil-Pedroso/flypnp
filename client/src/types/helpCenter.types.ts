import { CalendarDays, Gift, LucideIcon } from "lucide-react";
import { Heart } from "lucide-react";
import { Bell } from "lucide-react";
import { Home } from "lucide-react";

interface Category {
  id: string;
  icon: LucideIcon;
  faqCount: number;
}

export const categories: Category[] = [
  {
    id: "bookings",
    icon: CalendarDays,
    faqCount: 3,
  },
  {
    id: "gift-cards",
    icon: Gift,
    faqCount: 5,
  },
  {
    id: "trips",
    icon: Heart,
    faqCount: 2,
  },
  {
    id: "account",
    icon: Bell,
    faqCount: 2,
  },
  {
    id: "hosting",
    icon: Home,
    faqCount: 2,
  },
];
