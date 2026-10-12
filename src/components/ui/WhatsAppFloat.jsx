/**
 * components/ui/WhatsAppFloat.jsx
 * Fixed WhatsApp chat button
 */
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/971565096880?text=Hi%20Kahf%20Greens!%20I%27m%20interested%20in%20your%20plant%20pots."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white pl-4 pr-5 py-3 rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-semibold hidden group-hover:inline transition-all">Chat with us</span>
    </a>
  );
}
