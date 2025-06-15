import React, { useState, useEffect, useContext, useRef, useMemo, useCallback, memo, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

import { ButtonStd, StylesButtonStd, SliderStd, TextStd, PageContainerStd, StylesPageContainerStd, utils, PopUpProps, NavButtonProps, useTheme, useWindowSize, StylesSliderStd } from "../../standard_ui/standard_ui";
import { Dimensions } from '../../standard_ui/types';
import { useUser } from '../../contexts/UserContext';
import { usePrefs } from '../../contexts/PreferenceContext';
import { Account, Back, HeaderLogo, SettingsIcon } from "../nav_buttons";
import { User, MetaStats, GameStats, GameButtonProps, GameButtons } from "../../types";
import ApiRequestor from '../../ApiRequestor';
import { stylePageConMenuWithNavButton, styleBtnNextPageBottom, styleConBtnNextPage, stylePageTitle, styleConInner, styleContainer, styleCountLabel } from "../../utils/styles"
const gHeaderButtonsLeft : NavButtonProps[] = [ Back ];
const gHeaderButtonsRight : NavButtonProps[] = [ SettingsIcon ];

import { fontSizeN, spacingN } from "../../utils/utils_ui";
import { lclStrgKeyMetaStats } from '../../utils/constants';

import sounds from '../../assets/sounds/sounds';
import gridSymbols from './symbols_buttons';
import Vector2D from '../../classes/Vector2D';
import Block, { BlockType } from '../../classes/Block';
import GameStatsManager from '../../classes/GameStatsManager';
import Grid, { GridDrawPos } from '../../classes/Grid';
import GridDisplayer from '../../components/grid_displayer/GridDisplayer';
import ButtonBlocks from '../../components/button_blocks/ButtonBlocks';
import CountLabel, { StylesCountLabel } from '../../components/count_label/CountLabel';
import Container, { StylesContainer } from '../../components/container/Container';
import TextBlocks from '../../components/text_blocks/TextBlocks';
import TableStd, { defaultTableHeight, StyleTableStd, TableData } from '../../components/table_std/TableStd';
import { lclStrgKeyPopUpBlackList } from '../../standard_ui/components/pop_up_std/PopUpStd';
import { getTableDataHighScores } from "../../utils/utils_app_specific";
import MetaStatsManager from '../../classes/MetaStatsManager';
import GridSymbol from '../../classes/GridSymbol';

const gSymbolSwap : GridSymbol = new GridSymbol('swap', Block.getRandomColour());

interface PropsGameLandscape
{
    prGrid: Grid;
    prBlockTallies: Map<BlockType, number>;
    prNextBlocks: Block[];
    prGridHold: Grid;
    prGameInProgress: Boolean;
    prActiveBlocks: string;
    prStats: TableData;
    prScore: number;
    prLinesCleared: number;
    prMultiplier: number;
    prGameButtons: GameButtons;
    prOnPressExit: () => any;
    prOnPressPlay: () => Promise<any>;
    prClockwiseNext: (pIndexNext : number) =>  any;
    prAntiClockwiseNext: (pIndexNext : number) =>  any;
    prClockwiseHeld: () => any;
    prAntiClockwiseHeld: () => any;
    prSwapNextBlockWithHeldBlock: () => any;
    prIsLoading?: boolean;
    prUpdater: object;
};

function GameLandscape({ prGrid, prBlockTallies, prNextBlocks, prGridHold, prGameInProgress, prActiveBlocks, prStats, 
                         prScore, prLinesCleared, prMultiplier, prGameButtons, prOnPressExit, prOnPressPlay, 
                         prClockwiseNext, prAntiClockwiseNext, prClockwiseHeld, prAntiClockwiseHeld, 
                         prSwapNextBlockWithHeldBlock, prIsLoading = false, prUpdater } : PropsGameLandscape) 
{
    // Acquire theme.
    const { theme } = useTheme();

    const [ stOptionsPopUpMsg, setOptionsPopUpMsg ] = useState<PopUpProps | undefined>(undefined);

    const cxWindowSize = useWindowSize();

    useEffect(
        () =>
        {
            console.log("Initialise Page")
        },
        []
    );

    // The width of the containers' (right) border.
    // const lWidthBorder = parseInt(styles.con.borderRight);

    // The maximum dimension of the game buttons.
    const lMaxDimensionsGameButton = useMemo<Dimensions>(
        () => 
        {
            // The width of the control containers.
            const lWidthConControls = utils.getPercentValStr(gWidthConControls, cxWindowSize.width);

            const lMaxWidthGameButton : number = Math.floor(lWidthConControls - 2 * gPaddingConControls); // - lWidthBorder
            const lMaxHeightGameButton : number = Math.floor((cxWindowSize.height - 2 * gPaddingConControls - 4 * gRowGapConControls) / 5);

            return { width: lMaxWidthGameButton, height: lMaxHeightGameButton };
        },
        [ cxWindowSize ]
    );
    // const lMaxWidthGameButton = Math.floor(lWidthConControls - 2 * styles.conControls.padding - lWidthBorder);
    // const lMaxHeightGameButton = Math.floor((window.innerHeight - 2 * styles.conControls.padding - 4 * styles.conControls.rowGap) / 5);
    // const lMaxSizeGameButton = Math.min(lMaxWidthGameButton, lMaxHeightGameButton);

    const lMaxSizeGameButtonSymbol : number = useMemo(
        () =>
        {
            return Math.min(100, Math.min(lMaxDimensionsGameButton.width, lMaxDimensionsGameButton.height) - 2 * gPaddingBtnGameControl);
        },
        [ lMaxDimensionsGameButton ]
    );
    // let lMaxSizeGameButtonSymbol = lMaxSizeGameButton - 2 * styles.btnGameControl.padding;
    // lMaxSizeGameButtonSymbol = lMaxSizeGameButtonSymbol > 100 ? 100 : lMaxSizeGameButtonSymbol;

    // The maximum dimensions of the game grid.
    const lMaxDimensionsGameGrid = useMemo<Dimensions>(
        () => 
        {
            const lMaxHeightGameGrid = cxWindowSize.height// Math.floor(window.innerHeight); // Math.floor(
            const lMaxWidthGameGrid = utils.getPercentValStr(gWidthConGrid, cxWindowSize.width); // Math.floor(

            return { width: lMaxWidthGameGrid, height: lMaxHeightGameGrid };
        },
        [ cxWindowSize ]
    );
    // const lMaxHeightGameGrid = Math.floor(window.innerHeight);
    // const lMaxWidthGameGrid = Math.floor(utils.GetPercentVal(styles.conGrid.width, window.innerWidth));

    // The size of the stats table's text.
    // const lSizeTextStatsTable = window.innerWidth >= 800 ? 0 : -1;
    const lSizeTextStatsTable = useMemo<number>(
        () =>
        {
            return cxWindowSize.width >= 800 ? 17 : 15;
        },
        [ cxWindowSize ]
    )

    // The expected height of the stats table.
    const lHeightStatsTable = useMemo<number>(
        () =>
        {
            return defaultTableHeight(3, lSizeTextStatsTable, [ true, true, false, false ])
        },
        [ lSizeTextStatsTable ]
    );
    // const lHeightStatsTable = defaultTableHeight(3, lSizeTextStatsTable, [ true, true, false, false ]);

    // The dimensions of the tally container.
    const lDimensionsConTallies = useMemo<Dimensions>(
        () => 
        {
            const lHeightGameInfo : number = (2 * gConGameInfoPadding + 2 * gConGameInfoRowGap + 3 * gLblGameInfoTextSize);

            const lHeightConTally = cxWindowSize.height - lHeightStatsTable - lHeightGameInfo;
            const lWidthConTally = utils.getPercentValStr(gWidthConInfo, cxWindowSize.width) - gWidthBorder;

            console.log(`Height of Tally Container: ${lWidthConTally}x${lHeightConTally}`);

            return { width: lWidthConTally, height: lHeightConTally };
        },
        [ cxWindowSize, lHeightStatsTable ]
    );
    // const lHeightConTally = window.innerHeight - lHeightStatsTable;
    // const lWidthConTally = utils.GetPercentVal(styles.conStats.width, window.innerWidth);

    // The maximum dimensions of the grids displayed in the tally container (such that there's three columns).
    const lMaxDimensionsTallyGrid = useMemo<Dimensions>(
        () => 
        {
            const lMaxHeightTallyGrid = (lDimensionsConTallies.height - 2 * gRowColumnGapConTallySub - gFontSizeTitle - 2 * gPaddingConTally - gRowGapConTally) / 3; // Math.floor(
            const lMaxWidthTallyGrid = (lDimensionsConTallies.width - 2 * gRowColumnGapConTallySub - 2 * gPaddingConTally) / 2; //Math.floor(

            return { width: Math.min(100, lMaxWidthTallyGrid), height: Math.min(100, lMaxHeightTallyGrid) };
        },
        [ lDimensionsConTallies ]
    );
    // let lMaxHeightTallyGrid = Math.floor((lHeightConTally - 4 * styles.conTallySub.rowGap - utilsGlobalStyles.fontSizeN() - 2 * styles.conTally.padding) / 4);
    // let lMaxWidthTallyGrid = Math.floor((lWidthConTally - styles.conTallySub.columnGap - 2 * styles.conTally.padding -  lWidthBorder) / 2);
    // lMaxHeightTallyGrid = lMaxHeightTallyGrid > 100 ? 100 : lMaxHeightTallyGrid;
    // lMaxWidthTallyGrid = lMaxWidthTallyGrid > 100 ? 100 : lMaxWidthTallyGrid;

    // The maximum dimensions of the grids displayed in the 'next blocks' container.
    const lMaxDimensionsNextBlocks = useMemo<Dimensions>(
        () => 
        {
            let lMaxHeight = Math.floor(
                (cxWindowSize.height - gRowGapConHoldBlock - 4 * gRowGapConNextBlock - 
                 2 * gFontSizeTitle - 2 * gPaddingConBlocks - gRowGapConBlocks) / 5
            )
            const lMaxWidth : number = Math.floor(utils.getPercentValStr(gWidthConBlocks, cxWindowSize.width) - 2 * gPaddingConBlocks);

            return { width: Math.min(100, lMaxWidth), height: Math.min(100, lMaxHeight) };
        },
        [ cxWindowSize ]
    );
    // let lMaxHeightNextGrids = Math.floor(
    //     (window.innerHeight - styles.conHoldBlock.rowGap - 4 * styles.conNextBlocks.rowGap - 
    //      2 * utilsGlobalStyles.fontSizeN() - 2 * styles.conBlocks.padding - styles.conBlocks.rowGap) / 5
    // );
    // let lMaxWidthNextGrids = Math.floor(utils.GetPercentVal(styles.conBlocks.width, window.innerWidth) - 2 * styles.conBlocks.padding);
    // lMaxHeightNextGrids = lMaxHeightNextGrids > 100 ? 100 : lMaxHeightNextGrids;
    // lMaxWidthNextGrids = lMaxWidthNextGrids > 100 ? 100 : lMaxWidthNextGrids;

    const lGameButtonSymbolsLeft = useMemo<GameButtonProps[]>(
        () =>
        {
            return [
                prGameButtons.downMax, prGameButtons.leftMax, prGameButtons.left, prGameButtons.anticlockwise, prGameButtons.hold
            ];
        },
        [ prGameButtons ]
    );

    const lGameButtonSymbolsRight = useMemo<GameButtonProps[]>(
        () =>
        {
            return [
                prGameButtons.swapHoldWithNext, prGameButtons.rightMax, prGameButtons.right, prGameButtons.clockwise, prGameButtons.rotate180,
            ];
        },
        [ prGameButtons ]
    );

    const lStyleCon = useMemo<StylesPageContainerStd>(
        () =>
        {
            return { con: { ...styles.container, backgroundColor: theme.std.header.background } };
        },
        [ theme ]
    );

    const lStyleConControlsLeft = useMemo<CSSProperties>(
        () =>
        {
            return { 
                ...styles.conControls, ...styles.con, borderColor: theme.std.pageContainer.background, 
                justifyContent: prGameInProgress ? "space-between" : "center" 
            }
        },
        [ theme, prGameInProgress ]
    );

    const lStyleConControlsRight = useMemo<CSSProperties>(
        () =>
        {
            return { 
                ...styles.conControls, ...styles.con, borderColor: theme.std.pageContainer.background, 
                justifyContent: prGameInProgress ? "space-between" : "center" 
            }
        },
        [ theme, prGameInProgress ]
    );

    const lStyleBtnGameControl = useMemo<Map<string, StylesButtonStd>>(
        () =>
        {
            const lMap : Map<string, StylesButtonStd> = new Map<string, StylesButtonStd>();

            for (const colour of Block.sColours)
            {
                lMap.set(
                    colour, 
                    { 
                        con: { 
                            ...styles.btnGameControl, 
                            border: `1px solid ${colour}`,
                            width: lMaxDimensionsGameButton.width, height: lMaxDimensionsGameButton.height,
                            maxWidth: 200
                        }
                    }
                );
            }

            return lMap;
        },
        [ lMaxDimensionsGameButton ]
    );

    const lStyleConBtnPlayExit = useMemo<CSSProperties>(
        () =>
        {
            return { ...styles.conMenuControl, backgroundColor: theme.std.header.background + "AA" };
        },
        [ theme ]
    );

    const lStyleBtnPlayExit = useMemo<StylesButtonStd>(
        () =>
        {
            return { con: { ...styles.btnMenuControl, backgroundColor: theme.std.pageContainer.background + "CB", border: "none" } };
        },
        [ theme ]
    );

    const lStyleConNextAndHeldBlocks = useMemo<CSSProperties>(
        () =>
        {
            return { ...styles.conBlocks, ...styles.con, borderColor: theme.std.pageContainer.background };
        },
        [ theme ]
    );

    const lStyleGridHoldNextTally = useMemo<CSSProperties>(
        () =>
        {
            return {
                borderRadius: 10,
            };
        },
        []
    );

    const lStyleConGrid = useMemo<CSSProperties>(
        () =>
        {
            return { ...styles.conGrid, ...styles.con, borderColor: theme.std.pageContainer.background };
        },
        [ theme ]
    );

    const lStyleConInfo = useMemo<CSSProperties>(
        () =>
        {
            return { ...styles.conInfo, ...styles.con, borderColor: theme.std.pageContainer.background, overflowY: "scroll" };
        },
        [ theme ]
    );

    const lStyleTable = useMemo<StyleTableStd>(
        () =>
        {
            return {
                con: {
                    borderColor: theme.std.pageContainer.background, overflowX: "auto",
                    alignSelf: "flex-start", borderTopRightRadius: spacingN()
                }
            };
        },
        [ theme ]
    );

    const lStyleGridGame = useMemo<CSSProperties>(
        () =>
        {
            return {
                borderLeft: "none", borderRight: "none",
                borderRadius: spacingN()
            };
        },
        []
    );

    return ( 
        <PageContainerStd
            prShowHeader = { false }
            prPopUpProps = { stOptionsPopUpMsg }
            prStyles = { lStyleCon }
            prIsLoading = { prIsLoading }
        >
            <div 
                style = { lStyleConControlsLeft }
            >
                {
                    !prGameInProgress && (
                        <div style = { lStyleConBtnPlayExit }>
                            <ButtonBlocks 
                                prText = "PLAY" prSizeText = { 50 }
                                prOnPress = { prOnPressPlay }
                                prColourBackground = { "transparent" }
                                prColourEmptyCell = { "transparent" }
                                prIsHorizontal = { false }
                                prStyle = { lStyleBtnPlayExit } 
                            />
                        </div>
                    )
                }
                {
                    lGameButtonSymbolsLeft.map(
                        (pButton : GameButtonProps, pIndex : number) =>
                        {
                            return (
                                <ButtonStd 
                                    key = { pIndex }
                                    prStyles = { lStyleBtnGameControl.get(pButton.symbol.colour) }
                                    prOnPress = { pButton.onPress } prIsOnDown
                                >
                                    <GridDisplayer 
                                        prGrid = { pButton.symbol.grid } 
                                        prMaxHeight = { lMaxSizeGameButtonSymbol }
                                        prMaxWidth = { lMaxSizeGameButtonSymbol }
                                        prColourBackground = 'transparent'
                                    />
                                </ButtonStd>
                            )
                        }
                    )
                }
            </div>

            <div style = { lStyleConInfo } className = 'hideScrollBar'>

                <div style = { styles.conTally }>

                    <TextStd prText = "TALLY" prIsBold prStyle = { styles.lblTitle } />
                    <div style = { styles.conTallySub }>
                        {
                            Block.sTypeArray.map(
                                (pBlockType : BlockType, pIndex : number) =>
                                {
                                    const lGrid = new Grid(4, 4);

                                    const lBlock = new Block(pBlockType);

                                    if (!prActiveBlocks.includes(pBlockType))
                                    {
                                        lBlock.colour = Block.sColourShadow;
                                    }

                                    lGrid.drawBlockAt(lBlock, "CentreMid");

                                    const lCount : number = prBlockTallies.get(pBlockType) || 0;

                                    lGrid.text = lCount.toString().padStart(3, '0');

                                    return (
                                        <GridDisplayer 
                                            key = { pIndex }
                                            prGrid = { lGrid } 
                                            prMaxHeight = { lMaxDimensionsTallyGrid.height } 
                                            prMaxWidth = { lMaxDimensionsTallyGrid.width } 
                                            prColourBackground='transparent'
                                            prColourBorder = { theme.std.pageContainer.background }
                                            prStyle = { lStyleGridHoldNextTally }
                                        />
                                    );
                                }
                            )
                        }
                    </div>
                </div>

                {/* The user's current score, multiplier, and number of line clears. */}
                <div style = { styles.conGameInfo }>
                    <TextBlocks prText = { `S:${utils.intToCommaSeparatedString(prScore)}` } prSizeText = { gLblGameInfoTextSize } prColourBackground = 'transparent' prRandomiseColourPatternStart = { false } />
                    <TextBlocks prText = { `M:x${prMultiplier}` } prSizeText = { gLblGameInfoTextSize } prColourBackground = 'transparent' prRandomiseColourPatternStart = { false } />
                    <TextBlocks prText = { `L:${prLinesCleared}` } prSizeText = { gLblGameInfoTextSize } prColourBackground = 'transparent' prRandomiseColourPatternStart = { false } />
                </div>

                <div style = { styles.conTable } className = "hideScrollBar">
                    <TableStd 
                        prData = { prStats }
                        prStyle = { lStyleTable }
                        prBorders = { gBordersTable }
                    />
                </div>

            </div>

            <div style = { lStyleConGrid }>
                {
                    prGrid && (
                        <GridDisplayer 
                            prGrid = { prGrid } 
                            prMaxWidth = { lMaxDimensionsGameGrid.width } 
                            prMaxHeight = { lMaxDimensionsGameGrid.height } 
                            prGapCells = { 2 } prBorderWidth = { 2 } prPadding = { 2 }
                            prColourBackground = 'transparent'
                            prColourBorder = { theme.std.pageContainer.background }
                            prStyle = { lStyleGridGame }
                            prUpdater = { prUpdater }
                            prOnPress = { prGameButtons.down.onPress }
                        />
                    )
                }
            </div>

            <div style = { lStyleConNextAndHeldBlocks }>

                <div style = { styles.conNextBlocks }>
                    <TextStd prText = "NEXT" prIsBold prStyle = { styles.lblTitle } />
                    {
                        prNextBlocks.map(
                            (pNextBlock, pIndex) =>
                            {
                                const lGrid = new Grid(4, 4);

                                lGrid.drawBlockAt(pNextBlock, "CentreMid");

                                return (
                                    <GridDisplayer 
                                        key = { pIndex }
                                        prGrid = { lGrid } 
                                        prMaxHeight = { lMaxDimensionsNextBlocks.height } 
                                        prMaxWidth = { lMaxDimensionsNextBlocks.width } 
                                        // prColourBorder = { pIndex == prNextBlocks.length - 1 ? theme.cst.game.borderNextBlock : theme.std.pageContainer.background }
                                        prColourBorder = { pIndex == prNextBlocks.length - 1 ? prNextBlocks[prNextBlocks.length - 1].getColour() : theme.std.pageContainer.background }
                                        prColourBackground = 'transparent'
                                        prStyle = { lStyleGridHoldNextTally }
                                        prOnPressLeft = { prAntiClockwiseNext } 
                                        prOnPressRight = { prClockwiseNext }
                                        prItemOnPress = { pIndex }
                                        // key = { pIndex }
                                        // prGrid = { lGrid } 
                                        // prMaxHeight = { lMaxHeightNextGrids } 
                                        // prMaxWidth = { lMaxWidthNextGrids } 
                                        // prColourBorder = { pIndex == prNextBlocks.length - 1 ? theme.selected : undefined }
                                        // prOnClick = { lOnClick }
                                    />
                                );
                            }
                        )
                    }
                </div>
                
                <div style = { styles.conHoldBlock }>
                    <TextStd prText = "HOLD" prIsBold prStyle = { styles.lblTitle } />
                    <GridDisplayer 
                        prGrid = { prGridHold } 
                        // prOnPress={prClockwiseHeld}
                        prOnPressLeft = { prAntiClockwiseHeld }
                        prOnPressRight = { prClockwiseHeld }
                        prMaxHeight = { lMaxDimensionsNextBlocks.height } 
                        prMaxWidth = { lMaxDimensionsNextBlocks.width } 
                        prColourBackground = 'transparent'
                        prColourBorder = { theme.std.pageContainer.background }
                        prStyle = { lStyleGridHoldNextTally }
                        prUpdater = { prUpdater }
                    />
                </div>

            </div>

            <div 
                style = { lStyleConControlsRight }
            >
                {
                    !prGameInProgress && (
                        <div style = { lStyleConBtnPlayExit }>
                            <ButtonBlocks 
                                prText = "EXIT" prSizeText = { 50 }
                                prOnPress = { prOnPressExit } 
                                prColourBackground = { "transparent" }
                                prColourEmptyCell = { "transparent" }
                                prIsHorizontal = { false }
                                prStyle = { lStyleBtnPlayExit } 
                            />
                        </div>
                    )
                }
                {
                    lGameButtonSymbolsRight.map(
                        (pButton : GameButtonProps, pIndex : number) =>
                        {
                            return (
                                <ButtonStd 
                                    key = { pIndex }
                                    prStyles = { lStyleBtnGameControl.get(pButton.symbol.colour) }
                                    prOnPress = { pButton.onPress } prIsOnDown
                                >
                                    <GridDisplayer 
                                        prGrid = { pButton.symbol.grid } 
                                        prMaxHeight = { lMaxSizeGameButtonSymbol }
                                        prMaxWidth = { lMaxSizeGameButtonSymbol }
                                        prColourBackground = 'transparent'
                                    />
                                </ButtonStd>
                            )
                        }
                    )
                }
            </div>

        </PageContainerStd>
    );
}

// const gRowGapContainer : number = 2;

const gRowGapConControls : number = 6;

const gPaddingConControls : number = 6;

const gWidthConControls : string = "15%";

const gPaddingBtnGameControl : number = 7;

const gFontSizeTitle : number = fontSizeN();

const gRowGapConHoldBlock : number = spacingN(-2);

const gRowGapConNextBlock : number = spacingN(-2);

const gPaddingConBlocks : number = spacingN(-2);

const gRowGapConBlocks : number = spacingN(-1);

const gWidthConBlocks : string = "10%";

const gWidthConGrid : string = "35%";

const gWidthConInfo : string = "25%";

const gRowColumnGapConTallySub : number = spacingN(-2);

const gPaddingConTally : number = spacingN(-2);

const gRowGapConTally : number = spacingN(-2);

const gLblGameInfoTextSize : number = 17;

const gConGameInfoRowGap : number = 7;

const gConGameInfoPadding : number = 7;

const gWidthBorder : number = 1;

const styles : { [ key: string ]: CSSProperties } = 
{
    container:
    {
        // rowGap: gRowGapContainer,
        height: "100%",
        flexDirection: "row",
        padding: 0,
    },
    con:
    {
        height: "100%",
        borderRight: `${gWidthBorder}px solid`
    },
    conControls:
    {
        //backgroundColor: "#0A0AA1",
        width: gWidthConControls,
        padding: gPaddingConControls,
        rowGap: gRowGapConControls,
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative"
    },
    conInfo:
    {
        //backgroundColor: "#500AA1",
        width: gWidthConInfo,
    },
    conTally:
    {
        padding: gPaddingConTally,
        rowGap: gRowGapConTally,
        flexGrow: 1
    },
    conTallySub:
    {
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: gRowColumnGapConTallySub,
        columnGap: gRowColumnGapConTallySub,
        justifyContent: "center"
    },
    conGameInfo:
    {
        rowGap: gConGameInfoRowGap,
        flexDirection: "column",
        padding: gConGameInfoPadding
    },
    conGrid:
    {
        //backgroundColor: "#0A83A1",
        width: gWidthConGrid,
        alignItems: "center",
        justifyContent: "center"
    },
    conBlocks:
    {
        width: gWidthConBlocks,
        padding: gPaddingConBlocks,
        rowGap: gRowGapConBlocks,
        justifyContent: "center",
        alignItems: "center"
    },
    conNextBlocks:
    {
        rowGap: gRowGapConNextBlock,
        alignItems: "center"
    },
    conHoldBlock:
    {
        rowGap: gRowGapConHoldBlock,
        alignItems: "center"
    },
    conRightMost:
    {
        borderRightWidth: 0
    },
    btnGameControl:
    {
        padding: gPaddingBtnGameControl,
        borderRadius: spacingN(-1),
        width: "fit-content",
        //border: "1px solid"
    },
    btnMenuControl:
    {
        height: "100%",
        maxHeight: 350,
        borderRadius: spacingN(-1),
        padding: 16,
        width: "fit-content"
    },
    conMenuControl:
    {
        zIndex: 1,
        position: "absolute",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    lblTitle:
    {
        fontSize: gFontSizeTitle,
        textAlign: 'center'
    },
    conTable:
    {
        alignSelf: "left", overflowX: "scroll", 
        flexShrink: 0 
    }
};

const gBordersTable : boolean[] = [ true, true, false, false ];

export default GameLandscape;