"use client";

import { useEffect } from "react";
import { patchGlobalCreateTag } from './utils/client-utils';

/**
 * This component patches global DOM access functions
 * that cause the build error by providing safe implementations
 * that work in both client and server environments.
 */
export default function ClientSafety() {
  useEffect(() => {
    // Patch the global createTag function that's causing the build error
    patchGlobalCreateTag();
    
    return () => {
      // Clean up the global patch if component unmounts
      if (typeof window !== "undefined") {
        try {
          // @ts-ignore
          if (window.originalCreateTag !== undefined) {
            // @ts-ignore
            window.createTag = window.originalCreateTag;
            // @ts-ignore
            delete window.originalCreateTag;
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