//Helper arrow function to determine whether a filename is valid to be saved
export const isValidFilename = (filename: string) => {
    if (!filename || filename.trim() === "") return false;

  // Only allow letters, numbers, spaces, dots, dashes, underscores
  const validPattern = /^[\w\s.-]+$/;
  if (!validPattern.test(filename)) return false;

  // Optional: max length
  if (filename.length > 100) return false;

  return true;
}