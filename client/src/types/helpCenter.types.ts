import { CalendarDays, Gift, LucideIcon } from "lucide-react";
import { Heart } from "lucide-react";
import { Bell } from "lucide-react";
import { Home } from "lucide-react";

interface Faq {
  question: string;
  answer: string;
}

interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  faqs: Faq[];
}

export const categories: Category[] = [
  {
    id: "bookings",
    label: "Bookings & payments",
    icon: CalendarDays,
    faqs: [
      {
        question: "How do I pay for a booking?",
        answer:
          "Bookings are confirmed with Stripe in a secure checkout. After you confirm the payment, your booking appears in Trips with its current status.",
      },
      {
        question: "Can I cancel a booking?",
        answer:
          "Cancellation depends on the provider's policy. Open the booking in Trips and contact the provider through Messages if you need assistance.",
      },
      {
        question: "Where can I see my bookings and trips?",
        answer:
          "Open Trips from the user menu. It groups your upcoming and past stays, experiences and service bookings in one place.",
      },
    ],
  },
  {
    id: "gift-cards",
    label: "Gift cards & balance",
    icon: Gift,
    faqs: [
      {
        question: "How do I buy a gift card?",
        answer:
          "Go to the Gift cards page, choose an amount between 25 and 2,000 CHF, enter the recipient's name and email, and confirm the payment with Stripe.",
      },
      {
        question: "How does the recipient receive the code?",
        answer:
          "If the recipient has an account with that email, they get an in-app notification with the code. An email is also sent when email delivery is enabled.",
      },
      {
        question: "How do I redeem a gift card code?",
        answer:
          "Open the Gift cards page, paste the code in the Redeem a code box and confirm. The amount is added to your balance and appears in your recent activity.",
      },
      {
        question: "Where is my balance shown?",
        answer:
          "Your balance is shown on the Gift cards page under Available balance and is applied automatically at checkout.",
      },
      {
        question: "Can anyone redeem my gift card?",
        answer:
          "The code is the only thing needed to redeem a card, so only share it with people you trust.",
      },
    ],
  },
  {
    id: "trips",
    label: "Trips & wishlists",
    icon: Heart,
    faqs: [
      {
        question: "How do I save a place I like?",
        answer:
          "Press Save on any place or experience to add it to your wishlists. Open Wishlists from the user menu to review everything you saved.",
      },
      {
        question: "What is the difference between Trips and Wishlists?",
        answer:
          "Trips groups your confirmed bookings, while Wishlists are places and experiences you saved for later.",
      },
    ],
  },
  {
    id: "account",
    label: "Account & notifications",
    icon: Bell,
    faqs: [
      {
        question: "How do notifications work?",
        answer:
          "Booking confirmations, messages and gift card updates appear in your notifications inbox, where you can mark them as read or delete them.",
      },
      {
        question: "How do I update my profile?",
        answer:
          "Open Profile from the user menu to edit your personal details and photo.",
      },
    ],
  },
  {
    id: "hosting",
    label: "Hosting",
    icon: Home,
    faqs: [
      {
        question: "How do I list my home?",
        answer:
          "Press List your home in the user menu and follow the listing wizard to add photos, location, amenities and price.",
      },
      {
        question: "How do I manage my listings?",
        answer:
          "Use the Host page to edit your active listings and track their status.",
      },
    ],
  },
];
