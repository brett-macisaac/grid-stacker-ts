import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import globalProps, { utilsGlobalStyles } from '../../styles';
import headerButtons from '../../components/header_buttons/HeaderButtons';
import ThemeContext from "../../contexts/ThemeContext.js";
import TextStandard from '../../components/text_standard/TextStandard';
import PageContainer from '../../components/page_container/PageContainer';
import ButtonTheme from '../../components/button_theme/ButtonTheme';

function SettingsThemes() 
{
    // The name of the current theme and the function that handles updating it.
    const { themeName, updateTheme } = useContext(ThemeContext);

    const navigate = useNavigate();

    return ( 
        <PageContainer
            navigate = { navigate }
            headerBtnsLeft = { [ headerButtons.back ] }
            style = { styles.container }
        >

            <TextStandard 
                text = "Select a theme from below." 
                isBold
                style = {{ 
                    textAlign: "center"
                }}
            />

            <div
                style = { styles.conButtons }
            >
                {
                    Object.keys(globalProps.themes).map(
                        (themeNameI, index) =>
                        {

                            return (
                                <div key = { index } style = {{ ...styles.conButton, borderRadius: 10 }}>
                                    <ButtonTheme 
                                        themeName = { themeNameI } 
                                        height = { 140 } 
                                        width = { 75 } 
                                        isSelected = { themeNameI === themeName }
                                        onPress = { () => updateTheme(themeNameI) }
                                    />
                                    <TextStandard text = { globalProps.themes[themeNameI].name } isBold style = { styles.lblThemeName } />
                                </div>
                            )
                        }
                    )
                }
            </div>

        </PageContainer>
    );
}

const styles =
{
    container:
    {
        rowGap: utilsGlobalStyles.spacingVertN(),
        //justifyContent: "center", // Issue when content overflows, scroll doesn't go to top.
        alignItems: "center",
        paddingLeft: utilsGlobalStyles.spacingVertN(-2),
        paddingRight: utilsGlobalStyles.spacingVertN(-2),
    },
    conButton:
    {
        alignItems: "center",
        // justifyContent: "center"
    },
    conButtons:
    {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        columnGap: utilsGlobalStyles.spacingVertN(1),
        rowGap: globalProps.spacingVertBase,
    },
    lblThemeName:
    {
        marginTop: utilsGlobalStyles.spacingVertN(-4)
    }
};

export default SettingsThemes;