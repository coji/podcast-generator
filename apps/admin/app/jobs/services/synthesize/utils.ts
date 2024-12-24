// Utility function to split text into lines
export const splitTextIntoLines = (text: string): string[] => {
  return text.split(/[\r\n]+|。/)
}
