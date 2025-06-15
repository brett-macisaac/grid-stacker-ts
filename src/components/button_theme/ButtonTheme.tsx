import { CSSProperties, memo, useCallback, useMemo } from 'react';

import { Theme } from '../../standard_ui/themes/theme_types';

interface PropsButtonTheme
{
    prTheme: Theme;
    prOnPress: (pThemeName : string) => any;
    prHeight?: number;
    prWidth?: number;
    prIsSelected: boolean;
}

/*
* A customisable button component which by default implements the app's global theme.

* Props:
    > themeName: the name of the theme. This should correspond to a theme from globalThemes (defined in styles_global).
    > onPress: the function that is called when the button is pressed.
    > height: the component's height
    > width: the component's width.
    > isSelected: whether the component is selected (this should be done using the onPress prop).
*/
const ButtonTheme = memo(

    function ButtonTheme({ prTheme, prOnPress, prHeight = 100, prWidth = 45, prIsSelected }: PropsButtonTheme)
    {

        const lStyleCon = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    flexDirection: "column",
                    borderRadius: 10, //globalProps.borderRadiusStandard,
                    borderStyle: "solid",
                    overflow: "hidden",
                    backgroundColor: prTheme.std.buttonTheme.content,
                    borderColor: prTheme.std.buttonTheme.border,
                    height: prHeight,
                    width: prWidth,
                    borderWidth: prIsSelected ? 3 : 0,
                };
            },
            [ prTheme, prHeight, prWidth, prIsSelected ]
        );

        const lStyleHeader = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    ...styles.headerOrNavBar, ...styles.header, 
                    backgroundColor: prTheme.std.buttonTheme.header, borderColor: prTheme.std.buttonTheme.border  
                }
            },
            [ prTheme, ]
        );

        const lStyleContent = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    ...styles.content, backgroundColor: prTheme.std.buttonTheme.content
                }
            },
            [ prTheme ]
        );

        const lStyleNavBar = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    ...styles.headerOrNavBar, ...styles.navBar, 
                    backgroundColor: prTheme.std.buttonTheme.navBar, borderColor: prTheme.std.buttonTheme.border
                }
            },
            [ prTheme ]
        );

        const lOnPress = useCallback(
            () =>
            {
                prOnPress(prTheme.name);
            },
            [ prOnPress, prTheme ]
        );

        return (
            <div
                onClick = { lOnPress }
                style = { lStyleCon }
                // activeOpacity = { 0.8 } // Changes the component's opacity when pressed.
            >

                <div 
                    style = { lStyleHeader }
                >
                </div>

                <div style = { lStyleContent }>
                </div>

                <div 
                    style = { lStyleNavBar }
                >
                </div>

            </div>
        );
    }

);

const styles : { [key: string] : CSSProperties } = 
{
    content: 
    {
        flexGrow: 70
    },
    headerOrNavBar:
    {
        flexGrow: 15
    },
    header:
    {
        borderBottom: "1px solid"
    },
    navBar:
    {
        borderTop: "1px solid"
    }   
};

export default ButtonTheme;