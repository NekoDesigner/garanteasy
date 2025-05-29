import { useState, useEffect } from "react";
import { calculateRelativeSize } from "../components/ui/Icons/utils";

// TODO: create tests for this hook
export const useDynamicSize = (
    originalWidth: number,
    originalHeight: number,
    size?: number
): {
  width: number;
  height: number;
  } => {
    const [sizeState, setSizeState] = useState<{ width: number; height: number }>({
      width: originalWidth,
      height: originalHeight,
    });

    useEffect(() => {
      const newWidth = size || originalWidth;
      const { width, height } = calculateRelativeSize(originalWidth, originalHeight, newWidth);
      setSizeState({ width, height });
    }, [size, originalWidth, originalHeight]);

    return sizeState;
  };