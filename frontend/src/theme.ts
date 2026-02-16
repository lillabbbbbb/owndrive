// theme.ts
import { MODES } from "./types/other";

type Mode = typeof MODES.light | typeof MODES.dark;

export const THEME = {
  mode: (isLight: boolean): Mode => (isLight ? MODES.light : MODES.dark),


  responsive: {
    container: "flex flex-col gap-4 p-4 md:flex-row md:gap-6",
    sidebar: "w-full md:w-64 flex-shrink-0", // 16rem on md
    main: "flex-1 overflow-x-auto",
    dialogContent: "flex flex-col gap-4 max-w-xs mx-auto p-4 sm:max-w-sm sm:p-6 md:max-w-md md:p-8",
    dialogFilter: "flex flex-col gap-2 w-full",
    dialogButtons: "flex flex-col gap-2 mt-4 sm:flex-row sm:gap-4",
    selectWidth: "w-full sm:w-48 md:w-64",
  },
  // --------------------
  // Backgrounds
  // --------------------
  background: {
    page: (isLight: boolean) =>
      isLight
        ? "bg-white w-screen h-screen  inset-0 z-0"
        : "bg-black w-screen h-screen  inset-0 z-0",
    dashboard: (isLight: boolean) =>
      isLight ? "bg-white text-gray-800 shadow-inner" : "bg-black text-white shadow-lg",
    card: (isLight: boolean) =>
      isLight
        ? "bg-white backdrop-blur-md text-gray-800 shadow-lg rounded-2xl"
        : "bg-black backdrop-blur-md text-white shadow-xl rounded-2xl",
    modal: (isLight: boolean) =>
      isLight
        ? "bg-white/70 backdrop-blur-md text-gray-800 shadow-2xl rounded-2xl"
        : "bg-black/70 backdrop-blur-md text-white shadow-2xl rounded-2xl",
    tooltip: (isLight: boolean) =>
      isLight
        ? "bg-gray-100 text-gray-800 shadow-md rounded px-3 py-1 text-sm"
        : "bg-gray-900 text-white shadow-lg rounded px-3 py-1 text-sm",
    popup: (isLight: boolean) =>
      isLight
        ? "bg-white/50 backdrop-blur-md text-gray-800 shadow-lg rounded-xl"
        : "bg-black/50 backdrop-blur-md text-white shadow-xl rounded-xl",
  },

  // --------------------
  // Text / Colors
  // --------------------
  text: {
    logo: (isLight: boolean) => (isLight ? "text-orange-500" : "text-white"),
    primary: (isLight: boolean) => (isLight ? "text-gray-800" : "text-white"),
    secondary: (isLight: boolean) => (isLight ? "text-gray-600" : "text-gray-300"),
    muted: (isLight: boolean) => (isLight ? "text-gray-400" : "text-gray-500"),
    success: (isLight: boolean) => (isLight ? "text-green-700" : "text-green-400"),
    warning: (isLight: boolean) => (isLight ? "text-yellow-700" : "text-yellow-400"),
    error: (isLight: boolean) => (isLight ? "text-red-700" : "text-red-400"),
  },

  // --------------------
  // Buttons (orange accent only)
  // --------------------
  button: {
    // --------------------
    // Primary Button: Light orange base → Solid fill on hover
    // --------------------
    primary: (isLight: boolean) =>
      isLight
        ? "bg-orange-200/30 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/90 hover:text-white hover:shadow-[0_0_15px_rgba(255,165,0,0.5)] shadow-md rounded-2xl px-5 py-2 transition-all duration-300 backdrop-blur-md"
        : "bg-orange-200/30 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/90 hover:text-white hover:shadow-[0_0_15px_rgba(255,165,0,0.5)] shadow-lg rounded-2xl px-5 py-2 transition-all duration-300 backdrop-blur-md",

    // --------------------
    // Secondary Button: Hollow gray base → Solid gray fill on hover
    // --------------------
    secondary: (isLight: boolean) =>
      isLight
        ? "bg-gray-100/20 border-2 border-gray-400 text-gray-800 hover:bg-gray-400/90 hover:text-white shadow-md rounded-2xl px-4 py-2 transition-all duration-300 backdrop-blur-md"
        : "bg-gray-800/20 border-2 border-gray-600 text-white hover:bg-gray-600/90 hover:text-white shadow-lg rounded-2xl px-4 py-2 transition-all duration-300 backdrop-blur-md",

    // --------------------
    // Highlighted Primary: Stronger orange base → Solid fill
    // --------------------
    highlightedPrimary: (isLight: boolean) =>
      isLight
        ? "bg-orange-300/40 border-2 border-orange-600 text-orange-600 hover:bg-orange-600/90 hover:text-white hover:shadow-[0_0_20px_rgba(255,165,0,0.5)] shadow-lg rounded-2xl px-5 py-2 transition-all duration-300"
        : "bg-orange-300/40 border-2 border-orange-600 text-orange-600 hover:bg-orange-600/90 hover:text-white hover:shadow-[0_0_20px_rgba(255,165,0,0.5)] shadow-xl rounded-2xl px-5 py-2 transition-all duration-300",

    // --------------------
    // Highlighted Secondary: Hollow gray → Solid gray
    // --------------------
    highlightedSecondary: (isLight: boolean) =>
      isLight
        ? "bg-gray-200/30 border-2 border-gray-400 text-gray-800 hover:bg-gray-400/90 hover:text-white shadow-md rounded-2xl px-4 py-2 transition-all duration-300"
        : "bg-gray-700/30 border-2 border-gray-600 text-white hover:bg-gray-600/90 hover:text-white shadow-lg rounded-2xl px-4 py-2 transition-all duration-300",

    // --------------------
    // Back Button: Hollow gray → Solid gray on hover
    // --------------------
    back: (isLight: boolean) =>
      isLight
        ? "bg-gray-100/20 border-2 border-gray-400 text-gray-800 hover:bg-gray-400/90 hover:text-white shadow-md rounded-2xl px-4 py-2 transition-all duration-300"
        : "bg-gray-700/30 border-2 border-gray-600 text-white hover:bg-gray-600/90 hover:text-white shadow-md rounded-2xl px-4 py-2 transition-all duration-300",

    dangerous: (isLight: boolean) =>
      isLight
        ? "bg-gray-100/20 border-2 border-gray-400 text-gray-800 hover:bg-red-500/40 hover:border-red-400 hover:text-red-900 shadow-md rounded-2xl px-4 py-2 transition-all duration-300 backdrop-blur-md"
        : "bg-orange-300/40 border-2 border-orange-600 text-orange-600 hover:bg-red-600/80 hover:text-red hover:shadow-[0_0_20px_rgba(255,165,0,0.5)] shadow-xl rounded-2xl px-5 py-2 transition-all duration-300",


  },




  // --------------------
  // Inputs
  // --------------------
  input: {
    field: (isLight: boolean) =>
      isLight
        ? "bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl px-3 py-2 shadow-sm transition-all duration-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 hover:border-orange-400"
        : "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-50 placeholder-gray-500 border border-gray-600 rounded-xl px-3 py-2 shadow-2xl shadow-black/40 transition-all duration-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:shadow-orange-500/20 focus:from-gray-800 focus:to-gray-700 hover:border-orange-400 hover:shadow-orange-500/10",
    hover: (isLight: boolean) =>
      isLight
        ? "hover:bg-gray-100 hover:border-orange-400 hover:shadow-md transition-all duration-300"
        : "hover:bg-gray-800/60 hover:border-orange-400/70 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300",
    disabled: (isLight: boolean) =>
      isLight
        ? "bg-gray-100 text-gray-400 cursor-not-allowed rounded-xl px-3 py-2 opacity-60"
        : "bg-gray-900/30 text-gray-600 cursor-not-allowed rounded-xl px-3 py-2 opacity-50 border border-gray-700/30",
    autoComplete: (isLight: boolean) =>
      isLight
        ? "bg-gray-100 text-gray-800 shadow-inner rounded-xl px-3 py-2 border border-gray-200"
        : "bg-gray-800/70 text-gray-100 shadow-inner shadow-black/40 rounded-xl px-3 py-2 border border-gray-600/50 backdrop-blur-sm",
  },

  avatar: {
    base: (isLight: boolean) =>
      "rounded-full transition-all duration-300 border-2 border-transparent shadow-md",

    hover: (isLight: boolean) =>
      isLight
        ? "hover:border-orange-500 hover:shadow-lg"
        : "hover:border-orange-500 hover:shadow-xl",
    hoverGlow: (isLight: boolean) =>
      "hover:shadow-[0_0_20px_rgba(255,165,0,0.5)]"
  },

  // --------------------
  // Dropdowns
  // --------------------
  dropdown: {
    menu: (isLight: boolean) =>
      isLight
        ? "bg-white text-gray-800 shadow-lg rounded-xl transition-all duration-300"
        : "bg-gray-800 text-gray-100 shadow-xl rounded-xl transition-all duration-300",

    item: (isLight: boolean) =>
      isLight
        ? "text-gray-800 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-orange-100 hover:shadow-lg focus:bg-orange-100 focus:ring-2 focus:ring-orange-400"
        : "text-gray-100 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-orange-700 hover:shadow-md focus:bg-orange-700 focus:ring-2 focus:ring-orange-500",

    trigger: (isLight: boolean) =>
      isLight
        ? "bg-transparent border-none text-orange-500 hover:text-orange-600 transition-colors duration-300 cursor-pointer"
        : "bg-transparent border-none text-orange-500 hover:text-orange-600 transition-colors duration-300 cursor-pointer",
    tick: (isLight: boolean) =>
      isLight ? "text-orange-500" : "text-orange-500",

    text: (isLight: boolean) =>
      isLight ? "text-gray-800" : "text-gray-100",
  },

  // --------------------
  // Tooltips
  // --------------------
  tooltip: {
    base: (isLight: boolean) =>
      isLight ? "bg-gray-100 text-gray-800 shadow-md rounded px-2 py-1 text-sm" : "bg-gray-700 text-gray-100 shadow-lg rounded px-2 py-1 text-sm",
  },

  // --------------------
  // Tables
  // --------------------
  table: {
    header: (isLight: boolean) =>
      isLight
        ? "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 font-semibold border-b-2 border-orange-200 backdrop-blur-sm"
        : "bg-gradient-to-r from-gray-900 to-gray-800 text-gray-50 font-semibold border-b-2 border-orange-500/30 backdrop-blur-sm",
    row: (isLight: boolean) =>
      isLight
        ? "bg-white/80 backdrop-blur-sm text-gray-800 border-b border-gray-100/50 transition-all duration-200"
        : "bg-gray-800/50 backdrop-blur-sm text-gray-100 border-b border-gray-700/50 transition-all duration-200",
    hover: (isLight: boolean) =>
      isLight
        ? "hover:bg-orange-50/50 hover:shadow-sm  hover:border-orange-200/50 cursor-pointer"
        : "hover:bg-gray-700/50 hover:shadow-lg hover:shadow-orange-500/5  hover:border-orange-500/20 cursor-pointer",
    tick: (isLight: boolean) =>
      isLight
        ? "text-orange-500 drop-shadow-sm"
        : "text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]",
  },

  // --------------------
  // Editor Field
  // --------------------
  editorField: {
    base: (isLight: boolean) =>
      isLight
        ? `bg-white text-black shadow-md rounded-2xl p-4 min-h-[300px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400`
        : `bg-gray-900 text-white shadow-inner rounded-2xl p-4 min-h-[300px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500`,
    hover: (isLight: boolean) =>
      isLight
        ? `hover:shadow-lg`
        : `hover:shadow-md`,
  },

  // --------------------
  // Toggle
  // --------------------
  toggle: {
    track: (isLight: boolean) =>
      isLight ? "bg-gray-300 peer-checked:bg-orange-500 rounded-full" : "bg-gray-700 peer-checked:bg-orange-500 rounded-full",
    thumb: (isLight: boolean) =>
      isLight ? "bg-white peer-checked:bg-orange-400 rounded-full" : "bg-gray-300 peer-checked:bg-orange-400 rounded-full",
    focus: "focus:ring-2 focus:ring-orange-500",
  },

  // --------------------
  // Cursor
  // --------------------
  cursor: {
    default: (isLight: boolean) => ({
      base: "fixed pointer-events-none rounded-full z-[9999]",
      size: "w-6 h-6",
      color: isLight ? "bg-gray-800" : "bg-gray-200",
      shadow: isLight ? "shadow-md" : "shadow-lg",
      hover: isLight ? "hover:bg-gray-700" : "hover:bg-gray-300",
    }),
    pointer: (isLight: boolean) => ({
      base: "fixed pointer-events-none rounded-full z-[9999]",
      size: "w-8 h-8",
      color: isLight ? "bg-gray-700" : "bg-gray-300",
      shadow: isLight ? "shadow-md" : "shadow-lg",
      hover: isLight ? "hover:bg-gray-600" : "hover:bg-gray-200",
    }),
    grabbing: (isLight: boolean) => ({
      base: "fixed pointer-events-none rounded-full z-[9999]",
      size: "w-10 h-10",
      color: isLight ? "bg-gray-600" : "bg-gray-200",
      shadow: isLight ? "shadow-lg" : "shadow-xl",
      hover: isLight ? "hover:bg-gray-500" : "hover:bg-gray-100",
    }),
  },
};
