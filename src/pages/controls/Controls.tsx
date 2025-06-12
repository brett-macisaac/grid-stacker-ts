import React, { useState, useEffect, useContext, useMemo, useCallback, CSSProperties } from 'react';

import { ButtonStd, StylesButtonStd, SliderStd, TextStd, PageContainerStd, StylesPageContainerStd, utils, PopUpProps, NavButtonProps, useTheme, useWindowSize, StylesSliderStd, IconFunc } from "../../standard_ui/standard_ui";
import Container, { StylesContainer } from '../../components/container/Container';
import ButtonNextPage from '../../components/button_next_page/ButtonNextPage';
import { usePrefs } from '../../contexts/PreferenceContext';
import { Account, Back, HeaderLogo } from "../nav_buttons";

import TextBlocks from '../../components/text_blocks/TextBlocks';
import CheckBoxStd, { StylesCheckBoxStd } from '../../components/check_box/CheckBoxStd';
import { fontSizeN, spacingN } from '../../utils/utils_ui';
import { stylePageTitle, styleBtnNextPage, stylePageConGeneral } from '../../utils/styles';
import ControlDescription, { PropsControlDescription } from './ControlDescription';
import GridSymbol from '../../classes/GridSymbol';

import { imgKeyA, imgKeyArrowDown, imgKeyArrowLeft, imgKeyArrowRight, imgKeyArrowUp, imgKeyD, imgKeyS, imgKeySpace, imgKeyW } from './imgsKeys';

const gHeaderButtonsLeft : NavButtonProps[] = [ Back ];

function Controls() 
{
    const { theme } = useTheme();

    const lStyleTitle = useMemo<CSSProperties>(
        () =>
        {
            return stylePageTitle(theme);
        },
        [ theme ]
    );

    return ( 
        <PageContainerStd
            prLogo = { HeaderLogo }
            prHeaderButtonsLeft = { gHeaderButtonsLeft }
            prStyles = { stylePageConGeneral }
        >

            <TextBlocks 
                prText = "CONTROLS" prSizeText = { 40 } 
                prColourBackground = { theme.cst.gridCell.empty } 
                prStyle = { lStyleTitle } 
            />

            <div style = { styles.conControls }>
                {
                    gControlDescriptions.map(
                        (pCtrlDesc, pIndex) =>
                        {
                            return (
                                <ControlDescription 
                                    key = { pIndex }
                                    { ...pCtrlDesc }
                                />
                            );
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
        rowGap: spacingN(1),
        //justifyContent: "center", // Issue when content overflows, scroll doesn't go to top.
        //alignItems: "center",
        paddingLeft: spacingN(-2),
        paddingRight: spacingN(-2),
    },
    conControls:
    {
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: spacingN(1),
        columnGap: spacingN(1),
        justifyContent: "center",
        //alignItems: "center",
    },
    conControl:
    {
        rowGap: spacingN(-2),
        // width: "100%",
        // maxWidth: 500
    },
    description:
    {
        textAlign: "center",
    },
    title1:
    {
        textAlign: "center",
        //marginTop: spacingN(-3),
    },
    title2:
    {
        marginTop: spacingN(-1),
    },
    imgKeySquare:
    {
        width: 50,
        height: 50
    }

};

const gControlDescriptions : PropsControlDescription[] =
    [
        {
            prTitle: "Move Left",
            prDescription: "Moves the falling block 1 space to the left.",
            prSymbolScreen: new GridSymbol("left"),
            prKeyImgSrcKeyboard: imgKeyArrowLeft
        },
        {
            prTitle: "Move Right",
            prDescription: "Moves the falling block 1 space to the right.",
            prSymbolScreen: new GridSymbol("right"),
            prKeyImgSrcKeyboard: imgKeyArrowRight
        },
        {
            prTitle: "Move Down (Soft Drop)",
            prDescription: "Increases the speed of the falling block. Press again to return to the normal speed.",
            prSymbolScreen: new GridSymbol("down"),
            prKeyImgSrcKeyboard: imgKeyArrowDown,
        },
        {
            prTitle: "Move Down (Hard Drop)",
            prDescription: "Instantly moves the falling block as far down as it can go.",
            prSymbolScreen: new GridSymbol("downMax"),
            prKeyImgSrcKeyboard: imgKeyArrowUp
        },
        {
            prTitle: "Rotate Clockwise",
            prDescription: "Rotates the falling block 90 degrees clockwise.",
            prSymbolScreen: new GridSymbol("clockwise"),
            prKeyImgSrcKeyboard: imgKeyD
        },
        {
            prTitle: "Rotate Anti-clockwise",
            prDescription: "Rotates the falling block 90 degrees anti-clockwise.",
            prSymbolScreen: new GridSymbol("anticlockwise"),
            prKeyImgSrcKeyboard: imgKeyA
        },
        {
            prTitle: "Rotate 180",
            prDescription: "Rotates the falling block 180 degrees.",
            prSymbolScreen: new GridSymbol("rotate180"),
            prKeyImgSrcKeyboard: imgKeyS
        },
        {
            prTitle: "Hold",
            prDescription: "Removes the block that is currently falling and replaces it with the block in the 'hold' grid. If there isn't a block in the hold grid, the next block spawns in.",
            prSymbolScreen: new GridSymbol("hold"),
            prTextKeyboard: "Space-bar"
            // prKeyImgSrcKeyboard: imgKeySpace,
        },
        {
            prTitle: "Swap Next With Held",
            prDescription: "Swaps the held block with the next block.",
            prSymbolScreen: new GridSymbol("swap"),
            prKeyImgSrcKeyboard: imgKeyW
        },
        {
            prTitle: "Rotate Clockwise (Next Blocks)",
            prDescription: "Rotate one of the next blocks 90 degrees clockwise.",
            prTextScreen: "Press the right side of the grid that contains the block that you want to rotate (can be any of the four 'next' blocks).",
            prTextKeyboard: "Hold down one of the keypad numbers between 1 and 4 and then click the clockwise rotation key."
        },
        {
            prTitle: "Rotate Anti-clockwise (Next Blocks)",
            prDescription: "Rotates one of the next blocks 90 degrees anit-clockwise.",
            prTextScreen: "Press the left side of the grid that contains the block that you want to rotate (can be any of the four 'next' blocks).",
            prTextKeyboard: "Hold down one of the keypad numbers between 1 and 4 and then click the anti-clockwise rotation key."
        },
        {
            prTitle: "Rotate 180 (Next Blocks)",
            prDescription: "Rotates one of the next blocks 180 degrees.",
            prTextScreen: "Unavailable; however, you can simply press the block's grid twice in a row.",
            prTextKeyboard: "Hold down one of the keypad numbers between 1 and 4 and then click the 'rotate 180' key."
        },
        {
            prTitle: "Rotate Clockwise (Held Block)",
            prDescription: "Rotates the held block 90 degrees clockwise.",
            prTextScreen: "Press the right side of the grid on which the held block is displayed.",
            prTextKeyboard: "Hold down the keypad number 0 key and then click the clockwise rotation key."
        },
        {
            prTitle: "Rotate Anit-clockwise (Held Block)",
            prDescription: "Rotates the held block 90 degrees anti-clockwise.",
            prTextScreen: "Press the left side of the grid on which the held block is displayed.",
            prTextKeyboard: "Hold down the keypad number 0 key and then click the anti-clockwise rotation key."
        },
        {
            prTitle: "Rotate 180 (Held Block)",
            prDescription: "Rotates the held block 180 degrees",
            prTextScreen: "Unavailable; however, you can simply press the held block's grid twice in a row.",
            prTextKeyboard: "Hold down the keypad number 0 key and then click the 'rotate 180' key."
        },
    ];

export default Controls;