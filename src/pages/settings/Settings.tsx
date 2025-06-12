import React, { useState, useEffect, useContext, useMemo, useCallback, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Brightness4 from '@mui/icons-material/Brightness4';
import SportsEsports from '@mui/icons-material/SportsEsports';
import Info from '@mui/icons-material/Info'; 
import VolumeUp from '@mui/icons-material/VolumeUp';

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

function Settings() 
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

    const lOnPressThemes = useCallback(
        () => { navigate("/settingsThemes"); }, []
    );

    const lOnPressAbout = useCallback(
        () => { navigate("/about"); }, []
    );

    const lOnPressControls = useCallback(
        () => { navigate("/controls"); }, []
    );

    const lOnPressSound = useCallback(
        () => { navigate("/soundEffects"); }, []
    );

    const lOnPressUpdateSFX = useCallback(
        () => { cxPrefs.update(undefined, undefined, undefined, undefined, !cxPrefs.prefs.soundOn) }, [ cxPrefs ]
    );

    return ( 
        <PageContainerStd
            prLogo = { HeaderLogo }
            prHeaderButtonsLeft = { gHeaderButtonsLeft }
            prHeaderButtonsRight = { gHeaderButtonsRight }
            prStyles = { stylePageConGeneral }
        >

            <TextBlocks 
                prText = "SETTINGS" prSizeText = { 40 } 
                prColourBackground = { theme.cst.gridCell.empty } 
                prStyle = { lStyleTitle } 
            />

            <ButtonNextPage 
                prText = "Themes" 
                // sizeText = { 1 }
                prIsBold prStyles = { styleBtnNextPage }
                prIcon = { iconTheme }
                prOnPress = { lOnPressThemes }
            />

            <ButtonNextPage 
                prText = "About" 
                // sizeText = { 1 }
                prIsBold prStyles = { styleBtnNextPage }
                prIcon = { iconAbout }
                prOnPress = { lOnPressAbout }
            />

            <ButtonNextPage 
                prText = "Controls" 
                // prSizeText = { 1 }
                prIsBold prStyles = { styleBtnNextPage }
                prIcon = { iconControls }
                prOnPress = { lOnPressControls }
            />

            <ButtonNextPage 
                prText = "Sound Effects" 
                // prSizeText = { 1 }
                prIsBold prStyles = { styleBtnNextPage }
                prIcon = { iconSoundEffects }
                prOnPress = { lOnPressSound }
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

const iconTheme : IconFunc = (pSize : number, pColour : string) =>
{
    return <Brightness4 sx = {{ fill: pColour, fontSize: pSize }} /> 
};

const iconAbout : IconFunc = (pSize : number, pColour : string) =>
{
    return <Info sx = {{ fill: pColour, fontSize: pSize }} /> 
};

const iconControls : IconFunc = (pSize : number, pColour : string) =>
{
    return <SportsEsports sx = {{ fill: pColour, fontSize: pSize }} /> 
};

const iconSoundEffects : IconFunc = (pSize : number, pColour : string) =>
{
    return <VolumeUp sx = {{ fill: pColour, fontSize: pSize }} /> 
};

export default Settings;