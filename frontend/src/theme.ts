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
      isLight ? "bg-beige-50 text-gray-800" : "bg-gray-900 text-gray-100",
    dashboard: (isLight: boolean) =>
      isLight ? "bg-white text-gray-800 shadow-inner" : "bg-gray-800 text-gray-100 shadow-lg",
    card: (isLight: boolean) =>
      isLight ? "bg-white text-gray-800 shadow-lg rounded-2xl" : "bg-gray-800 text-gray-100 shadow-xl rounded-2xl",
    modal: (isLight: boolean) =>
      isLight ? "bg-white text-gray-800 shadow-2xl rounded-2xl" : "bg-gray-900 text-gray-100 shadow-2xl rounded-2xl",
    tooltip: (isLight: boolean) =>
      isLight ? "bg-gray-100 text-gray-800 shadow-md rounded px-3 py-1 text-sm" : "bg-gray-700 text-gray-100 shadow-lg rounded px-3 py-1 text-sm",
    popup: (isLight: boolean) =>
      isLight ? "bg-white text-gray-800 shadow-lg rounded-xl" : "bg-gray-800 text-gray-100 shadow-xl rounded-xl",
  },

  // --------------------
  // Text / Colors
  // --------------------
  text: {
    primary: (isLight: boolean) => (isLight ? "text-gray-800" : "text-gray-100"),
    secondary: (isLight: boolean) => (isLight ? "text-gray-600" : "text-gray-300"),
    muted: (isLight: boolean) => (isLight ? "text-gray-400" : "text-gray-300"),
    success: (isLight: boolean) => (isLight ? "text-green-700" : "text-green-400"),
    warning: (isLight: boolean) => (isLight ? "text-yellow-700" : "text-yellow-400"),
    error: (isLight: boolean) => (isLight ? "text-red-700" : "text-red-400"),
  },

  // --------------------
  // Buttons (orange accent only)
  // --------------------
  button: {
    primary: (isLight: boolean) =>
      isLight
        ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg rounded-2xl px-5 py-2 transition-all duration-300"
        : "bg-orange-500 text-white hover:bg-orange-600 shadow-xl rounded-2xl px-5 py-2 transition-all duration-300",
    secondary: (isLight: boolean) =>
      isLight
        ? "bg-gray-100 text-gray-800 hover:bg-gray-200 shadow-md rounded-2xl px-4 py-2 transition-all duration-300"
        : "bg-gray-700 text-gray-100 hover:bg-gray-600 shadow-lg rounded-2xl px-4 py-2 transition-all duration-300",
    highlightedPrimary: (isLight: boolean) =>
      isLight
        ? "bg-orange-600 text-white hover:bg-orange-700 shadow-lg rounded-2xl px-5 py-2 transition-all duration-300"
        : "bg-orange-600 text-white hover:bg-orange-700 shadow-xl rounded-2xl px-5 py-2 transition-all duration-300",
    highlightedSecondary: (isLight: boolean) =>
      isLight
        ? "bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-md rounded-2xl px-4 py-2 transition-all duration-300"
        : "bg-gray-700 text-gray-100 hover:bg-gray-600 shadow-lg rounded-2xl px-4 py-2 transition-all duration-300",
    back: (isLight: boolean) =>
      isLight
        ? "bg-gray-100 text-gray-800 hover:bg-gray-200 shadow-md rounded-2xl px-4 py-2 transition-all duration-300"
        : "bg-gray-700 text-gray-100 hover:bg-gray-600 shadow-md rounded-2xl px-4 py-2 transition-all duration-300",
  },

  // --------------------
  // Inputs
  // --------------------
  input: {
    field: (isLight: boolean) =>
      isLight
        ? "bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 focus:ring-orange-500 focus:border-orange-500 rounded-xl px-3 py-2 shadow-sm transition-all duration-300"
        : "bg-gray-800 text-gray-100 placeholder-gray-500 border border-gray-700 focus:ring-orange-500 focus:border-orange-500 rounded-xl px-3 py-2 shadow-md transition-all duration-300",
    hover: (isLight: boolean) => (isLight ? "hover:bg-gray-100" : "hover:bg-gray-700"),
    disabled: (isLight: boolean) =>
      isLight ? "bg-gray-100 text-gray-400 cursor-not-allowed rounded-xl px-3 py-2" : "bg-gray-700 text-gray-500 cursor-not-allowed rounded-xl px-3 py-2",
    autoComplete: (isLight: boolean) =>
      isLight ? "bg-gray-100 text-gray-800 shadow-inner rounded-xl px-3 py-2" : "bg-gray-900 text-gray-100 shadow-inner rounded-xl px-3 py-2",
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
        ? "bg-gray-50 text-gray-800  rounded-xl px-3 py-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
        : "bg-gray-800 text-gray-100 border border-gray-700 rounded-xl px-3 py-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300",

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
      isLight ? "bg-gray-100 text-gray-800 " : "bg-gray-900 text-gray-100 border-b border-gray-700",
    row: (isLight: boolean) =>
      isLight ? "bg-white text-gray-800 border-b border-gray-100" : "bg-gray-800 text-gray-100 border-b border-gray-700",
    hover: (isLight: boolean) => (isLight ? "hover:bg-gray-50" : "hover:bg-gray-700"),
    tick: (isLight: boolean) => (isLight ? "text-orange-500" : "text-orange-500"),
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
