import React, { CSSProperties, useContext, useState, memo } from "react";

import { ButtonStd, StylesButtonStd } from '../../standard_ui/standard_ui';
import TextBlocks from '../text_blocks/TextBlocks';
import Block from "../../classes/Block";

interface PropsButtonBlocks
{
    prText: string;
    prSizeText?: number;
    prOnPress: () => void;
    prOnSinglePress?: () => void;
    prDoubleClick?: boolean;
    prIsOnDown?: boolean;
    prStyle?: StylesButtonStd;
    prColourBackground?: string;
    prColourEmptyCell?: string;
    prColourText?: string;
    prColourBorder?: string;
    prIsHorizontal?: boolean;
}

/*
* A 'blockified' button component which by default implements the app's global theme.

* Props:
*/
const ButtonBlocks = memo(

    function ButtonBlocks({ prText, prSizeText, prOnPress, prOnSinglePress, prDoubleClick, prIsOnDown, prStyle, prColourBackground = "transparent", 
                            prColourEmptyCell, prColourText, prColourBorder, prIsHorizontal = true }: PropsButtonBlocks)
    {
        return (
            <ButtonStd 
                prOnPress = { prOnPress } prOnSinglePress = { prOnSinglePress } 
                prStyles = { prStyle } prDoubleClick = { prDoubleClick } prIsOnDown = { prIsOnDown } prIsBorderDisabled = { false }
            >
                <TextBlocks 
                    prText = { prText } 
                    prSizeText = { prSizeText }
                    prColourText = { prColourText } 
                    prColourPattern = { Block.sColours }
                    prColourBackground = { prColourBackground } 
                    prColourEmptyCell = { prColourEmptyCell } 
                    prColourBorder = { prColourBorder }
                    prIsHorizontal = { prIsHorizontal } 
                />
            </ButtonStd>
        );
    }

);

export default ButtonBlocks;