import { Theme } from "./theme_types.ts";

import dark from "./theme_dark";
import light from "./theme_light.ts";
import darkPurple from "./theme_dark_purple.ts";
import darkBlue from "./theme_dark_blue.ts";
import darkRed from "./theme_dark_red.ts";

/*
*  Default themes for the app's components.
*/
const themesDefault : Theme[] = []
themesDefault.push(dark);
themesDefault.push(darkPurple);
themesDefault.push(darkBlue);
themesDefault.push(darkRed);
// themesDefault.push(light);

const themeDefault : Theme = dark;

export {
    themesDefault as default, themeDefault
};