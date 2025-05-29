/**
 * Calculates the relative size maintaining the aspect ratio.
 * @param originalWidth - The original width.
 * @param originalHeight - The original height.
 * @param newWidth - The new width (optional).
 * @param newHeight - The new height (optional).
 * @returns An object with the calculated width and height.
 */
export function calculateRelativeSize(
  originalWidth: number,
  originalHeight: number,
  newWidth?: number,
  newHeight?: number
): { width: number; height: number } {
  if (newWidth !== undefined && newHeight === undefined) {
    return {
      width: newWidth,
      height: Math.round((newWidth * originalHeight) / originalWidth),
    };
  }
  if (newHeight !== undefined && newWidth === undefined) {
    return {
      width: Math.round((newHeight * originalWidth) / originalHeight),
      height: newHeight,
    };
  }
  if (newWidth !== undefined && newHeight !== undefined) {
    return { width: newWidth, height: newHeight };
  }


  return { width: originalWidth, height: originalHeight };
}