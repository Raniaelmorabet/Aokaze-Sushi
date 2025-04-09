"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Clock, Copy } from "lucide-react"
import { useEffect, useState } from "react"

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
  totalMilliseconds: number;
}

interface CountdownProps {
  expirationDate: string | Date;
  className?: string;
  expiredText?: string;
  detailed?: boolean;
}

function getRemainingTime(
  expirationDate: string | Date,
  options?: {
    returnObject?: boolean;
    detailed?: boolean;
    expiredText?: string;
  }
): TimeRemaining | string {
  const now = new Date();
  const end = new Date(expirationDate);
  
  if (isNaN(end.getTime())) {
    return options?.returnObject ? {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      formatted: options?.expiredText || 'Invalid date',
      totalMilliseconds: 0
    } : 'Invalid date';
  }

  const diff = end.getTime() - now.getTime();
  const isExpired = diff <= 0;

  const seconds = Math.floor(Math.abs(diff) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const timeRemaining: TimeRemaining = {
    days: Math.max(0, days),
    hours: Math.max(0, hours % 24),
    minutes: Math.max(0, minutes % 60),
    seconds: Math.max(0, seconds % 60),
    isExpired,
    formatted: '',
    totalMilliseconds: Math.max(0, diff)
  };

  if (isExpired) {
    timeRemaining.formatted = options?.expiredText || 'Expired';
  } else if (options?.detailed) {
    timeRemaining.formatted = `${timeRemaining.days}d ${timeRemaining.hours}h ${timeRemaining.minutes}m left`;
  } else if (timeRemaining.days > 7) {
    timeRemaining.formatted = `${timeRemaining.days} days left`;
  } else if (timeRemaining.days > 0) {
    timeRemaining.formatted = `${timeRemaining.days}d ${timeRemaining.hours}h left`;
  } else if (timeRemaining.hours > 0) {
    timeRemaining.formatted = `${timeRemaining.hours}h ${timeRemaining.minutes}m left`;
  } else if (timeRemaining.minutes > 0) {
    timeRemaining.formatted = `${timeRemaining.minutes}m ${timeRemaining.seconds}s left`;
  } else {
    timeRemaining.formatted = `${timeRemaining.seconds}s left`;
  }

  return options?.returnObject ? timeRemaining : timeRemaining.formatted;
}

function CountdownTimer({ 
  expirationDate, 
  className = 'text-gray-300',
  expiredText = 'Expired',
  detailed = false
}: CountdownProps) {
  const [remaining, setRemaining] = useState(() => 
    getRemainingTime(expirationDate, { returnObject: true }) as TimeRemaining
  );

  useEffect(() => {
    if (remaining.isExpired) return;

    const timer = setInterval(() => {
      const updated = getRemainingTime(expirationDate, { returnObject: true }) as TimeRemaining;
      setRemaining(updated);
      if (updated.isExpired) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [expirationDate]);

  return (
    <span className={`${className} ${remaining.isExpired ? 'text-red-500' : ''}`}>
      {remaining.isExpired 
        ? expiredText 
        : detailed 
          ? `${remaining.days}d ${remaining.hours}h ${remaining.minutes}m left` 
          : remaining.formatted}
    </span>
  );
}

export function PromotionCard({ promotion }: { promotion: any }) {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(promotion.couponCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 bg-[#1E1E1E] rounded-xl overflow-hidden p-6">
      <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
        <Image src={promotion.image || "/placeholder.svg"} alt={promotion.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full font-bold">
          {promotion.discountPercentage}% OFF
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <h3 className="text-2xl font-bold mb-2">{promotion.title}</h3>
        <p className="text-gray-300 mb-4">{promotion.description}</p>

        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-gray-400" />
          <CountdownTimer expirationDate={promotion.validUntil} />
        </div>

        <div className="relative">
          <div className="bg-[#2a2a2a] p-3 rounded-lg flex justify-between items-center">
            <span className="font-mono font-bold">{promotion.couponCode}</span>
            <button className="text-orange-500 hover:text-orange-400 transition-colors" onClick={copyCode}>
              <Copy size={18} />
            </button>
          </div>

          {copied && (
            <motion.div
              className="absolute -top-8 left-0 right-0 bg-green-500 text-white text-center py-1 rounded-md text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Code copied!
            </motion.div>
          )}
        </div>

        <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition-colors">
          Redeem Now
        </button>
      </div>
    </div>
  )
}