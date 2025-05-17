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

// Create DOM elements safely 
export const createTag = (tagName) => {
  if (isClient) {
    return document.createElement(tagName);
  }
  return null;
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