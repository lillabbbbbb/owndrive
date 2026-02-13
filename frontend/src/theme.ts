// theme.ts
import { MODES } from "./types/other"

type Mode = typeof MODES.light | typeof MODES.dark

export const THEME = {
  mode: (isLight: boolean): Mode => (isLight ? MODES.light : MODES.dark),

  // --------------------
  // Backgrounds
  // --------------------
  background: {
    page: (isLight: boolean) =>
      isLight ? "bg-beige-100 text-orange-800" : "bg-black text-orange-400",
    dashboard: (isLight: boolean) =>
      isLight ? "bg-beige-50 text-orange-800" : "bg-black text-orange-400",
    card: (isLight: boolean) =>
      isLight ? "bg-beige-100 text-orange-800 shadow-md" : "bg-gray-900 text-orange-400 shadow-lg",
    modal: (isLight: boolean) =>
      isLight ? "bg-white text-orange-800 shadow-lg" : "bg-black text-orange-400 shadow-xl",
    tooltip: (isLight: boolean) =>
      isLight ? "bg-beige-200 text-orange-800 shadow-sm" : "bg-gray-800 text-orange-400 shadow-md",
    popup: (isLight: boolean) =>
      isLight ? "bg-white text-orange-800 shadow-lg" : "bg-black text-orange-400 shadow-xl",
  },

  // --------------------
  // Text / Colors
  // --------------------
  text: {
    primary: (isLight: boolean) => (isLight ? "text-orange-800" : "text-orange-400"),
    secondary: (isLight: boolean) => (isLight ? "text-gray-700" : "text-gray-300"),
    muted: (isLight: boolean) => "text-gray-500",
    success: (isLight: boolean) => (isLight ? "text-green-700" : "text-green-400"),
    warning: (isLight: boolean) => (isLight ? "text-yellow-700" : "text-yellow-400"),
    error: (isLight: boolean) => (isLight ? "text-red-700" : "text-red-400"),
  },

  // Add this under THEME

  // --------------------
  // Shadcn Select
  // --------------------
  select : {
    base: (isLight: boolean) =>
      isLight
        ? "bg-beige-100 text-orange-800 border border-beige-300 shadow-sm"
        : "bg-black text-orange-400 border border-gray-700 shadow-md",
    hover: (isLight: boolean) =>
      isLight ? "hover:bg-beige-200" : "hover:bg-gray-800",
    focus: (isLight: boolean) =>
      isLight ? "focus:ring-2 focus:ring-orange-500" : "focus:ring-2 focus:ring-orange-400",
    option: (isLight: boolean) =>
      isLight
        ? "text-orange-800 hover:bg-orange-100 hover:text-orange-900"
        : "text-orange-400 hover:bg-orange-800 hover:text-orange-200",
  },

  // --------------------
  // Shadcn Toggle
  // --------------------
  toggle: {
    track: (isLight: boolean) =>
      isLight ? "bg-beige-300 peer-checked:bg-orange-500" : "bg-gray-700 peer-checked:bg-orange-400",
    thumb: (isLight: boolean) =>
      isLight ? "bg-white peer-checked:bg-orange-100" : "bg-gray-300 peer-checked:bg-orange-200",
    focus: "focus:ring-2 focus:ring-orange-400",
  },


  // --------------------
  // Cursors
  // --------------------
 cursor : {
    default: (isLight: boolean) => ({
      base: "fixed pointer-events-none rounded-full z-[9999]",
      size: "w-6 h-6",
      color: isLight ? "bg-orange-800" : "bg-orange-400",
      shadow: isLight ? "shadow-md" : "shadow-lg",
      hover: isLight ? "hover:bg-orange-600" : "hover:bg-orange-500",
    }),
    pointer: (isLight: boolean) => ({
      base: "fixed pointer-events-none rounded-full z-[9999]",
      size: "w-8 h-8",
      color: isLight ? "bg-orange-700" : "bg-orange-300",
      shadow: isLight ? "shadow-md" : "shadow-lg",
      hover: isLight ? "hover:bg-orange-500" : "hover:bg-orange-200",
    }),
    grabbing: (isLight: boolean) => ({
      base: "fixed pointer-events-none rounded-full z-[9999]",
      size: "w-10 h-10",
      color: isLight ? "bg-orange-600" : "bg-orange-200",
      shadow: isLight ? "shadow-lg" : "shadow-xl",
      hover: isLight ? "hover:bg-orange-400" : "hover:bg-orange-100",
    }),
  },

  // --------------------
  // Buttons
  // --------------------
  button: {
    back: (isLight: boolean) =>
      isLight
        ? "bg-beige-200 text-orange-800 hover:bg-beige-300 shadow-sm"
        : "bg-gray-800 text-orange-400 hover:bg-gray-700 shadow-sm",
    primary: (isLight: boolean) =>
      isLight
        ? "bg-orange-500 text-beige-100 hover:bg-orange-600 shadow-md"
        : "bg-orange-600 text-black hover:bg-orange-500 shadow-lg",
    secondary: (isLight: boolean) =>
      isLight
        ? "bg-beige-200 text-orange-700 hover:bg-beige-300 shadow-sm"
        : "bg-black text-orange-400 hover:bg-gray-900 shadow-md",
    highlightedPrimary: (isLight: boolean) =>
      isLight
        ? "bg-orange-600 text-white hover:bg-orange-700 shadow-md"
        : "bg-orange-500 text-black hover:bg-orange-400 shadow-lg",
    highlightedSecondary: (isLight: boolean) =>
      isLight
        ? "bg-beige-300 text-orange-800 hover:bg-beige-400 shadow-sm"
        : "bg-gray-800 text-orange-400 hover:bg-gray-700 shadow-md",
  },

  // --------------------
  // Tables
  // --------------------
  table: {
    header: (isLight: boolean) =>
      isLight ? "bg-beige-200 text-orange-800 border-b border-beige-300" : "bg-gray-900 text-orange-400 border-b border-gray-700",
    row: (isLight: boolean) =>
      isLight ? "bg-white text-orange-800 border-b border-beige-200" : "bg-black text-orange-400 border-b border-gray-800",
    hover: (isLight: boolean) => (isLight ? "hover:bg-beige-100" : "hover:bg-gray-800"),
    tick: (isLight: boolean) => (isLight ? "text-green-700" : "text-green-400"),
  },

  // --------------------
  // Inputs
  // --------------------
  input: {
    field: (isLight: boolean) =>
      isLight
        ? "bg-beige-200 text-orange-800 placeholder-orange-400 border border-beige-300 focus:ring-orange-500 focus:border-orange-500"
        : "bg-black text-orange-400 placeholder-orange-600 border border-orange-700 focus:ring-orange-400 focus:border-orange-400",
    hover: (isLight: boolean) => (isLight ? "hover:bg-beige-300" : "hover:bg-gray-800"),
    disabled: (isLight: boolean) => (isLight ? "bg-beige-100 text-gray-400 cursor-not-allowed" : "bg-gray-800 text-gray-500 cursor-not-allowed"),
  },

  // --------------------
  // Dropdown menus
  // --------------------
  dropdown: {
    menu: (isLight: boolean) => (isLight ? "bg-white text-orange-800 shadow-md" : "bg-black text-orange-400 shadow-lg"),
    item: (isLight: boolean) =>
      isLight
        ? "text-orange-700 hover:bg-orange-100 hover:text-orange-800"
        : "text-orange-400 hover:bg-orange-800 hover:text-orange-200",
    tick: (isLight: boolean) => (isLight ? "text-green-700" : "text-green-400"),
    text: (isLight: boolean) => (isLight ? "text-orange-800" : "text-orange-400"),
  },
}
// --------------------
// Too
