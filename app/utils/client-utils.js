"use client";

/**
 * Utility for safely accessing client-side APIs
 * Use this to prevent "document is not defined" errors during SSR
 */

// Check if code is running on client or server
export const isClient = typeof window !== 'undefined';

// Safely get the document object
export const getDocument = () => {
  if (isClient) {
    return document;
  }
  return null;
};

// Safely get the window object
export const getWindow = () => {
  if (isClient) {
    return window;
  }
  return null;
};

/**
 * The specific function mentioned in the build error
 * This is a critical fix to prevent "document is not defined" errors
 * during server-side rendering and static page generation
 */
export const createTag = (tagName) => {
  if (!isClient) {
    // Return a mock element during server-side rendering
    return {
      textContent: '',
      setAttribute: () => {},
      appendChild: () => {},
      // Add other element methods as needed
    };
  }
  // Only create real DOM elements on the client
  return document.createElement(tagName);
};

// Safely query DOM elements
export const querySelector = (selector) => {
  if (isClient) {
    return document.querySelector(selector);
  }
  return null;
};

// Safe version of document.getElementById
export const getElementById = (id) => {
  if (isClient) {
    return document.getElementById(id);
  }
  return null;
};

// Safe version of window.addEventListener
export const addWindowEvent = (event, handler) => {
  if (isClient) {
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  }
  return () => {};
};

// Check if we're in a browser environment
export const isBrowser = () => {
  return isClient;
}; 