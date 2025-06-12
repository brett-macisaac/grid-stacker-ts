import React, { useContext, memo, CSSProperties, useMemo } from 'react';

import { useTheme, TextStd, useWindowSize, LoadAreaStd, PopUpStd, HeaderStd, StylesHeaderStd, StylesNavBarStd, NavBarStd } from "../../standard_ui/standard_ui";

import GridSymbol from '../../classes/GridSymbol';
//import gridSymbols from '../game/symbols_buttons';
import GridDisplayer from '../../components/grid_displayer/GridDisplayer';
import Container, { StylesContainer } from '../../components/container/Container';
import { styleContainer } from "../../utils/styles";
import { fontSizeN, spacingN } from '../../utils/utils_ui';
import Block from '../../classes/Block';

interface PropsControlDescription 
{
    prTitle: string;
    prDescription: string;
    prTextScreen?: string;
    prSymbolScreen?: GridSymbol;
    prTextKeyboard?: string;
    prKeyImgSrcKeyboard?: string;
};

const ControlDescription = memo(

    function ControlDescription({ prTitle, prDescription, prTextScreen = "", prSymbolScreen, prTextKeyboard = "", 
                                  prKeyImgSrcKeyboard = "" } : PropsControlDescription)
    {
        const { theme } = useTheme();

        const lStyleConControls  = useMemo<CSSProperties>(
            () =>
            {
                return { ...styles.conControls, borderColor: theme.std.header.border, backgroundColor: theme.std.header.border };
            },
            [ theme ]
        );

        const lStyleConControlScreens  = useMemo<CSSProperties>(
            () =>
            {
                return { ...styles.conControl, ...styles.conControlScreen, borderColor: theme.std.header.border, backgroundColor: theme.std.pageContainer.background };
            },
            [ theme ]
        );

        const lStyleConControlKeyboard  = useMemo<CSSProperties>(
            () =>
            {
                return { ...styles.conControl, ...styles.conControlKeyboard, borderColor: theme.std.header.border, backgroundColor: theme.std.pageContainer.background };
            },
            [ theme ]
        );

        const lStyleConControlTitle  = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    ...styles.text, ...styles.titleControl, 
                    backgroundColor: theme.std.header.background, borderColor: theme.std.header.border
                };
            },
            [ theme ]
        );

        const lStyleBtnGameControl = useMemo<Map<string, CSSProperties>>(
            () =>
            {
                const lMap : Map<string, CSSProperties> = new Map<string, CSSProperties>();
    
                for (const colour of Block.sColours)
                {
                    lMap.set(
                        colour, 
                        { 
                            ...styles.btnGameControl, 
                            border: `1px solid ${colour}`,
                            backgroundColor: theme.cst.gridCell.empty,
                        }
                    );
                }
    
                return lMap;
            },
            [ theme ]
        );

        return (
            <Container prStyles = { lStyleContainer } prTitle = { prTitle }>

                {/* <TextStd 
                    prText = { prTitle }
                    prStyle = { styles.text } prIsBold
                /> */}

                <TextStd 
                    prText = { prDescription }
                    prStyle = { styles.text } prIsItalic
                />

                <div style = { lStyleConControls }>

                    <div style = 
                        { lStyleConControlScreens }
                    >
                        <TextStd 
                            prText = { "Screen" }
                            prIsBold
                            prStyle = { lStyleConControlTitle }
                        />

                        <div style = { styles.conControlInner }>
                            {
                                prSymbolScreen && (
                                    <div
                                        style = { lStyleBtnGameControl.get(prSymbolScreen.colour) }
                                    >
                                        <GridDisplayer 
                                            prGrid = { prSymbolScreen.grid } 
                                            prMaxHeight = { 80 } prMaxWidth = { 80 } 
                                            prColourBackground='transparent'
                                        />
                                    </div>
                                )
                            }
                            {
                                prTextScreen && (
                                    <TextStd 
                                        prText = { prTextScreen }
                                        prStyle = { styles.text }
                                    />
                                )
                            }
                        </div>

                    </div>

                    <div style = 
                        { lStyleConControlKeyboard }
                    >
                        <TextStd 
                            prText = { "Keyboard" } prIsBold
                            prStyle = { lStyleConControlTitle }
                        />

                        <div style = { styles.conControlInner }>
                            { 
                                prKeyImgSrcKeyboard && ( 
                                    <img src = { prKeyImgSrcKeyboard } alt = "prKeyImgSrcKeyboard" style = { styles.imgKey } /> 
                                ) 
                            }
                            {
                                prTextKeyboard && (
                                    <TextStd 
                                        prText = { prTextKeyboard }
                                        prStyle = { styles.text }
                                    />
                                )
                            }
                        </div>

                    </div>

                </div>

            </Container>
        );
    }

);

const lStyleContainer : StylesContainer = {
    conOuter: { ...styleContainer.conOuter, maxWidth: 400 },
    conInner: { ...styleContainer.conInner, padding: spacingN(), rowGap: spacingN() },
    text: { ...styleContainer.text }
};

const styles : { [ key: string ]: CSSProperties } = 
{
    container:
    {
        rowGap: spacingN(-1),
    },
    text:
    {
        // textAlign: "center",
        fontSize: fontSizeN()
    },
    conControls:
    {
        flexDirection: "row",
        width: "100%",
        border: "1px solid",
        borderRadius: spacingN(-1),
        overflow: "hidden",
        columnGap: 1
    },
    conControl:
    {
        width: "50%",
        // alignItems: "center",
        // paddingBottom: spacingN(-2)
    },
    conControlInner:
    {
        width: "100%", height: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 8, paddingRight: 8,
        rowGap: spacingN(-2),
        padding: spacingN(-2)
    },
    conControlScreen:
    {
        // borderRight: "1px solid",
    },
    conControlKeyboard:
    {
        // borderLeft: "1px solid"
    },
    titleControl:
    {
        width: "100%",
        flexShrink: 0,
        padding: 10,
        // marginBottom: spacingN(-2),
        borderBottom: "1px solid",
        fontSize: fontSizeN(0.5),
        textAlign: "center",
    },
    btnGameControl:
    {
        width: "fit-content",
        padding: 7,
        borderRadius: spacingN(),
        //border: "1px solid"
    },
    imgKey:
    {
        width: 120, height: 120,
        // maxWidth: "100%", maxHeight: "100%"
    },
    imgKeySquare:
    {
        width: 60,
        height: 60
    },
    imgKeyRect:
    {
        width: 120,
        height: 50
    },
    conKey:
    {
        //marginBottom: spacingN(-3),
        rowGap: spacingN(-3)
    }
};

export default ControlDescription;

export type { PropsControlDescription };