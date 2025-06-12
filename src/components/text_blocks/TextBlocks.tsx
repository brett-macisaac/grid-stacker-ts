import { useState, useMemo, CSSProperties, useRef, memo } from "react";

import { useTheme, utils } from "../../standard_ui/standard_ui";
import GridDisplayer from "../grid_displayer/GridDisplayer.js";
import GridChar from "../../classes/GridChar.js";
import Block from "../../classes/Block.js";

interface PropsTextBlocks
{
    prText: string;
    prSizeText?: number;
    prStyle?: CSSProperties;
    prIsHorizontal?: boolean;
    prColourBackground?: string;
    prColourEmptyCell?: string;
    prColourText?: string;
    prColourPattern?: string[];
    prColourBorder?: string;
    prRandomiseColourPatternStart?: boolean;
}

const TextBlocks = memo(

    function TextBlocks({ prText, prSizeText = 40, prStyle, prIsHorizontal = true, prColourBackground, prColourEmptyCell, prColourText, 
                          prColourPattern = Block.sColours, prColourBorder, prRandomiseColourPatternStart = true }: PropsTextBlocks)
    {
        // Acquire global theme.
        const { theme } = useTheme();

        let lIndexColourPattern : number = prRandomiseColourPatternStart ? utils.getRandomInt(0, prColourPattern.length - 1) : 0;//utils.getRandomInt(0, prColourPattern.length - 1);

        const lTextGridified = useMemo<GridChar[][]>(
            () =>
            {
                return prText.split(' ').map(
                    (pWord) => 
                    {
                        return pWord.split('').map((char) => { return new GridChar(char, prColourText); })
                    }
                )
            },
            [ prText, prColourText ]
        );

        const lStyleCon = useMemo<CSSProperties>(
            () =>
            {
                return {
                    // overflowX: "scroll",
                    flexDirection: "row", 
                    flexWrap: "wrap",
                    ...prStyle, 
                    columnGap: prSizeText * 0.6 , rowGap: prSizeText * 0.6
                };
            },
            [ prStyle, prSizeText ]
        );

        const lStyleConWord = useMemo<CSSProperties>(
            () =>
            {
                return {
                    flexDirection: prIsHorizontal ? "row" : "column", 
                    columnGap: prSizeText * 0.14,
                    rowGap: prSizeText * 0.20,
                };
            },
            [ prIsHorizontal, prSizeText ]
        );

        return (
            <div style = { lStyleCon }>
                {
                    lTextGridified.map(
                        (pWordGridified, pIndex) =>
                        {
                            return (
                                <div 
                                    key  = { pIndex } 
                                    style = { lStyleConWord }
                                >
                                    {
                                        pWordGridified.map(
                                            (pCharGridified, pIndex2) =>
                                            {
                                                let lColour : string = "";

                                                if (prColourText)
                                                {
                                                    lColour = prColourText;
                                                    // pCharGridified.setColour(prColourText);
                                                }
                                                else if (prColourPattern)
                                                {
                                                    lColour = prColourPattern[lIndexColourPattern];
                                                    // pCharGridified.setColour(prColourPattern[gIndexColourPattern]);
                                                    lIndexColourPattern = (lIndexColourPattern + 1) % prColourPattern.length;
                                                }
                                                else
                                                {
                                                    lColour = Block.getRandomColour();
                                                    // pCharGridified.setColourRandom();
                                                }

                                                return (
                                                    <GridDisplayer 
                                                        key = { pIndex2 } 
                                                        prGrid = { pCharGridified.grid } 
                                                        prMaxWidth = { prSizeText } prMaxHeight = { prSizeText } 
                                                        prColourFilledCell = { lColour }
                                                        prColourBackground = { prColourBackground ? prColourBackground : theme.cst.grid.background } 
                                                        prColourEmptyCell = { prColourEmptyCell ? prColourEmptyCell : theme.cst.gridCell.empty }
                                                        prColourBorder = { prColourBorder }
                                                    />
                                                );
                                            }
                                        )
                                    }
                                </div>
                            )
                        }
                    )
                }
            </div>
        );
    }

);

export default TextBlocks;