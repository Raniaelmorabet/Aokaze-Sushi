'use client'
import { useState, useEffect } from "react";

export default function useLocalStorage(key: string) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setValue(localStorage.getItem(key));
    }
  }, [key]);

  return value;
}

