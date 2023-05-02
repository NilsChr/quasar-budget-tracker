type RGBColor = {
    r: number;
    g: number;
    b: number;
  };
  
  type HSLColor = {
    h: number;
    s: number;
    l: number;
  };
  
  function hexToRGB(hex: string): RGBColor | null {
    const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!match) {
      return null;
    }
    return {
      r: parseInt(match[1], 16),
      g: parseInt(match[2], 16),
      b: parseInt(match[3], 16),
    };
  }
  
  function rgbToHSL(rgb: RGBColor): HSLColor {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
  
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
  
    let h = 0;
    if (delta === 0) {
      h = 0;
    } else if (cmax === r) {
      h = ((g - b) / delta) % 6;
    } else if (cmax === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
  
    h = Math.round(h * 60);
    if (h < 0) {
      h += 360;
    }
  
    const l = (cmax + cmin) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  
    return { h, s: s * 100, l: l * 100 };
  }
  
  export default function getContrastColor(hexColor: string): "white" | "black" {
    const rgb = hexToRGB(hexColor);
    if (!rgb) {
      throw new Error(`Invalid hex color: ${hexColor}`);
    }
  
    const { l } = rgbToHSL(rgb);
  
    return l > 50 ? "black" : "white";
  }