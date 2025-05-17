"use client";

import { useEffect } from "react";

/**
 * This component monkey-patches the global createTag function 
 * that's causing the build error to provide a safe implementation
 * that works in both client and server environments.
 */
export default function ClientSafety() {
  useEffect(() => {
    // Provide a global safe version of createTag
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.safeCreateTag = (tagName: string) => {
        return document.createElement(tagName);
      };
      
      // Attempt to monkey-patch the problematic function
      try {
        // @ts-ignore
        if (window._createTagOriginal === undefined) {
          // @ts-ignore
          window._createTagOriginal = window.createTag;
          // @ts-ignore
          window.createTag = (tagName: string) => {
            return document.createElement(tagName);
          };
        }
      } catch (error) {
        console.error("Error patching createTag:", error);
      }
    }
    
    return () => {
      // Clean up the global patch if component unmounts
      if (typeof window !== "undefined") {
        try {
          // @ts-ignore
          if (window._createTagOriginal !== undefined) {
            // @ts-ignore
            window.createTag = window._createTagOriginal;
            // @ts-ignore
            delete window._createTagOriginal;
          }
          // @ts-ignore
          delete window.safeCreateTag;
        } catch (error) {
          console.error("Error cleaning up patch:", error);
        }
      }
    };
  }, []);
  
  // This component doesn't render anything
  return null;
} 