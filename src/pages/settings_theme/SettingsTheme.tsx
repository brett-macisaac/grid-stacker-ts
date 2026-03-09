import { useMemo, useCallback, CSSProperties } from 'react';

import { spacingN, TextStd, PageContainerStd, NavButtonProps, useTheme, Theme } from "@/standard_ui/standard_ui";
import { Back, HeaderLogo } from "@/pages/nav_buttons";
import ButtonTheme from '@/components/button_theme/ButtonTheme';

import TextBlocks from '@/components/text_blocks/TextBlocks';
import { stylePageTitle, stylePageConGeneral } from '@/utils/styles';

const gHeaderButtonsLeft : NavButtonProps[] = [ Back ];

function SettingsThemes() 
{
    // Acquire global theme.
    const { theme, themes, switchTheme } = useTheme();

    const lStyleTitle = useMemo<CSSProperties>(
        () =>
        {
            return stylePageTitle(theme);
        },
        [ theme ]
    );

    const lOnPressTheme = useCallback(
        (pThemeName : string) =>
        {
            switchTheme(pThemeName);
        },
        []
    );

    return ( 
        <PageContainerStd
            prLogo = { HeaderLogo }
            prHeaderButtonsLeft = { gHeaderButtonsLeft }
            prStyles = { stylePageConGeneral }
        >

            {/* <TextStd 
                text = "Select a theme from below." 
                isBold
                style = {{ 
                    textAlign: "center"
                }}
            /> */}
            <TextBlocks 
                prText = "THEMES" prSizeText = { 40 } 
                prColourBackground = { theme.cst.gridCell.empty } 
                prStyle = { lStyleTitle } 
            />

            <div
                style = { styles.conButtons }
            >
                {
                    themes.map(
                        (pTheme : Theme, pIndex : number) =>
                        {

                            return (
                                <div key = { pIndex } style = { styles.conButton }>
                                    <ButtonTheme 
                                        prTheme = { pTheme }
                                        prHeight = { 140 } 
                                        prWidth = { 75 } 
                                        prIsSelected = { theme.name === pTheme.name }
                                        prOnPress = { lOnPressTheme }
                                    />
                                    <TextStd prText = { pTheme.name } prIsBold prStyle = { styles.lblThemeName } />
                                </div>
                            )
                        }
                    )
                }
            </div>

        </PageContainerStd>
    );
}

const styles : { [ key: string ]: CSSProperties } =
{
    container:
    {
        rowGap: spacingN(),
        //justifyContent: "center", // Issue when content overflows, scroll doesn't go to top.
        alignItems: "center",
        paddingLeft: spacingN(-2),
        paddingRight: spacingN(-2),
    },
    conButton:
    {
        alignItems: "center",
        borderRadius: spacingN(-1),
        rowGap: spacingN(-2.5)
        // justifyContent: "center"
    },
    conButtons:
    {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        columnGap: spacingN(1),
        rowGap: spacingN(),
    },
    lblThemeName:
    {
        marginTop: spacingN(-4)
    }
};

export default SettingsThemes;