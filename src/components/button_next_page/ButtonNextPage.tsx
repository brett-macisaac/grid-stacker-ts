import React, { useMemo, memo, CSSProperties } from "react";
import ChevronRight from '@mui/icons-material/ChevronRight';

import { ButtonStd, TextStd, useTheme, IconFunc, StylesButtonStd } from '../../standard_ui/standard_ui';

type StylesButtonNextPage =
{
    con?: React.CSSProperties;
    text?: React.CSSProperties;
}

interface PropsButtonNextPage
{
    prIcon: IconFunc;
    prText: string;
    prStyles?: StylesButtonNextPage;
    prIconSize?: number;
    prIconColour?: string;
    prIsBold?: boolean;
    prOnPress: () => any;
}

/*
* A customisable button component which by default implements the app's global theme.

* Props:
    > icon: a component such as a vector image from a library like MaterialCommunityIcons. For more icons, see the
            following link: https://oblador.github.io/react-native-vector-icons/.
    > text: the text that is displayed on the button.
    > sizeText: the size of the text. IMPORTANT: this is not fontSize, but rather the 'rank' of the fontSize (see 
                styles_global.js for more info).
    > isBold: whether the text is bold.
    > backgroundColorIcon: the backgroundColor of the icon.
    > onPress: the function that is called when the button is pressed.
    > style: the style of the component's container.
    > styleText: the style of the text within the container. The TextStandard component is used here, so refer to that
                 component's code for information regarding how styling is applied.
*/
const ButtonNextPage = memo(

    function ButtonNextPage({ prIcon, prText, prStyles, prIconSize = 35, prIconColour, prIsBold = true, prOnPress } : PropsButtonNextPage)
    {
        // Acquire global theme.
        const { theme } = useTheme();

        const lStyleConOuter = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    backgroundColor: theme.std.buttonNextPage.background,
                    borderColor: theme.std.buttonNextPage.border,
                    ...styles.container, 
                    ...prStyles?.con,
                    padding: 10//utilsGlobalStyles.fontSizeN(sizeText) / 2
                }
            },
            [ theme, prStyles ]
        );

        const lStyleIcon = useMemo<StylesButtonStd>(
            () =>
            {
                return { 
                    con: {
                        background: theme.std.buttonNextPage.iconBackgroundColor,
                        padding: 0
                    }
                }
            },
            [ theme, prStyles ]
        );

        const lStyleText = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    color: theme.std.buttonNextPage.font, textAlign: "center", 
                    marginLeft: 10, //utilsGlobalStyles.fontSizeN(sizeText),
                    ...prStyles?.text,
                }
            },
            [ theme, prStyles ]
        );

        return (
            <div
                onClick = { prOnPress }
                style = { lStyleConOuter }
                //activeOpacity = { 0.8 } // Changes the component's opacity when pressed.
            >
                <div style = { styles.conTextAndIcon }>

                    <ButtonStd 
                        prIcon = { prIcon }
                        prIconSize = { prIconSize }
                        prIconColour = { prIconColour ? prIconColour : theme.std.buttonNextPage.icon }
                        prStyles = { lStyleIcon }
                    />

                    {/* The button's text. */}
                    {
                        prText && (
                            <TextStd 
                                prText = { prText } 
                                prIsBold = { prIsBold } 
                                prStyle = { lStyleText }
                            />
                        )
                    }
                </div>

                <ButtonStd 
                    prIcon = { iconArrow }
                    prIconSize = { prIconSize }
                    prIconColour = { prIconColour ? prIconColour : theme.std.buttonNextPage.icon }
                    prStyles = { lStyleIcon }
                />
            </div>
        );
    }

);

const iconArrow : IconFunc = (pSize : number, pColour : string) =>
{
    return <ChevronRight sx = {{ color: pColour, fontSize: pSize }} />
};

const styles : { [key: string]: CSSProperties } = 
{
    container:
    {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderStyle: "solid",
        // borderRadius: 10,
        width: "100%",
        maxWidth: 700,
        padding: 10//utilsGlobalStyles.fontSizeN(sizeText) / 2
    },
    conTextAndIcon: 
    {
        alignItems: "center",
        flexDirection: "row"
    }
};

export default ButtonNextPage;

export type { StylesButtonNextPage };