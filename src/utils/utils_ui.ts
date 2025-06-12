const spacingBase : number = 20;

const fontBase : number = 15;

/**
* This function is intended to provide a consistent set of spacing values for use in styling, such as for padding, 
  margin, row/column gap, etc.

* Parameters:
    @param n The 'index' of the spacing. '0' corresponds to 'standard' spacing. Higher indexes give higher spacing, while 
    lower indexes (incl. negative numbers) give smaller spacing.

* @returns The spacing value that corresponds to the given index.
*/
function spacingN(n : number = 0) : number
{
    return spacingBase * Math.pow(1.5, n);
}

/**
* This function is intended to provide a consistent set of font size values for use in styling.

* Parameters:
    @param n The 'index' of the font size. '0' corresponds to the 'standard' font size. Higher indexes give higher font 
    sizes, while lower indexes (incl. negative numbers) give smaller sizes.

* @returns The font size that corresponds to the given index.
*/
function fontSizeN(n : number = 0) : number
{
    return fontBase * Math.pow(1.25, n);
}

export { spacingN, fontSizeN };