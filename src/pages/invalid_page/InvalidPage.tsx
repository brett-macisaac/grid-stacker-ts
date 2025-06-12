import React, { useState, useEffect, useContext, useMemo, useCallback, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Brightness4 from '@mui/icons-material/Brightness4';
import SportsEsports from '@mui/icons-material/SportsEsports';
import Info from '@mui/icons-material/Info'; 
import Home from '@mui/icons-material/Home';

import { ButtonStd, StylesButtonStd, SliderStd, TextStd, PageContainerStd, StylesPageContainerStd, utils, PopUpProps, NavButtonProps, useTheme, useWindowSize, StylesSliderStd, IconFunc } from "../../standard_ui/standard_ui";
import Container, { StylesContainer } from '../../components/container/Container';
import ButtonNextPage from '../../components/button_next_page/ButtonNextPage';
import { usePrefs } from '../../contexts/PreferenceContext';
import { Account, Back, HeaderLogo } from "../nav_buttons";

import TextBlocks from '../../components/text_blocks/TextBlocks';
import CheckBoxStd, { StylesCheckBoxStd } from '../../components/check_box/CheckBoxStd';
import { spacingN } from '../../utils/utils_ui';
import { stylePageTitle, styleBtnNextPage, stylePageConGeneral } from '../../utils/styles';

const gHeaderButtonsLeft : NavButtonProps[] = [ Back ];
const gHeaderButtonsRight : NavButtonProps[] = [ Account ];

function InvalidPage() 
{
    // Acquire global theme.
    const { theme } = useTheme();

    // Acquire preferences.
    const cxPrefs = usePrefs();

    const navigate = useNavigate();

    const lStyleChkSoundEffects = useMemo<StylesCheckBoxStd>(
        () =>
        {
            return {
                con: { padding: spacingN(-1), width: "100%", maxWidth: 500 }
            }
        },
        []
    );

    const lStyleTitle = useMemo<CSSProperties>(
        () =>
        {
            return stylePageTitle(theme);
        },
        [ theme ]
    );

    const lOnPressMenu = useCallback(
        () => { navigate("/"); }, []
    );

    return ( 
        <PageContainerStd
            prLogo = { HeaderLogo }
            prHeaderButtonsLeft = { gHeaderButtonsLeft }
            // prHeaderButtonsRight = { gHeaderButtonsRight }
            prStyles = { stylePageConGeneral }
        >

            <TextBlocks 
                prText = "INVALID PAGE" prSizeText = { 40 } 
                prColourBackground = { theme.cst.gridCell.empty } 
                prStyle = { lStyleTitle } 
            />

            <TextStd prText = "This page doesn't exist. Click the button below to go to the menu." />

            <ButtonNextPage 
                prText = "Menu" 
                // sizeText = { 1 }
                prIsBold prStyles = { styleBtnNextPage }
                prIcon = { iconMenu }
                prOnPress = { lOnPressMenu }
            />

        </PageContainerStd>
    );
}

const styles : { [ key: string ]: CSSProperties } =
{
    conButtonTheme:
    {
        alignItems: "center",
        // justifyContent: "center"
    },
    conSFX:
    {
        width: "100%",
        maxWidth: 500,
        rowGap: spacingN(-1),
        padding: spacingN()
    },
    text:
    {
        textAlign: "center",
    },
};

const iconMenu : IconFunc = (pSize : number, pColour : string) =>
{
    return <Home sx = {{ fill: pColour, fontSize: pSize }} /> 
};

export default InvalidPage;