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

interface PropsGamePortrait
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

function GamePortrait({ prGrid, prBlockTallies, prNextBlocks, prGridHold, prGameInProgress, prActiveBlocks, prStats, 
                        prScore, prLinesCleared, prMultiplier, 
                        prGameButtons, prOnPressExit, prOnPressPlay, prClockwiseNext, prAntiClockwiseNext, 
                        prClockwiseHeld, prAntiClockwiseHeld, prSwapNextBlockWithHeldBlock, prIsLoading = false, prUpdater } : PropsGamePortrait) 
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

    // The width of the container.
    // const gWidthContainer = window.innerWidth >= styles.container.maxWidth ? styles.container.maxWidth : window.innerWidth;

    // The height of the top container.
    // let lHeightConTop = utils.getPercentValStr(styles.conTop.height, window.innerHeight);
    const lHeightConTop = useMemo<number>(
        () =>
        {
            return utils.getPercentValStr(gConTopHeight, cxWindowSize.height);
        },
        [ cxWindowSize ]
    );

    // The height of the bottom container.
    // let lHeightConBottom = window.innerHeight - lHeightConTop;
    const lHeightConBottom = useMemo<number>(
        () =>
        {
            return cxWindowSize.height - lHeightConTop;
        },
        [ cxWindowSize, lHeightConTop ]
    );

    // The width of the top middle container.
    // const gWidthConTopMid = utils.getPercentVal(styles.conTopMid.width, gWidthContainer);
    const lWidthConTopMid = useMemo<number>(
        () =>
        {
            return Math.max(utils.getPercentValStr(gConTopMidWidth, cxWindowSize.width), cxWindowSize.width - 2 * gConTopSideMaxWidth);
        },
        [ cxWindowSize ]
    );

    // The widths of the containers at the top left and top-right.
    // const gWidthTopSide = (gWidthContainer - gWidthConTopMid) / 2;
    const lWidthTopSide = useMemo<number>(
        () =>
        {
            return (cxWindowSize.width - lWidthConTopMid) / 2;
        },
        [ cxWindowSize, lWidthConTopMid ]
    );

    // The maximum dimensions of the grids displayed in the tally container (also used for the 'next' and 'hold' grids). 
    // const gMaxHeightTallyGrid = Math.floor((lHeightConTop - 7 * styles.conTopSide.rowGap - fontSizeN() - 2 * styles.conTopSide.padding) / 7);
    // const gMaxWidthTallyGrid = Math.floor(gWidthTopSide - 2 * styles.conTopSide.padding - 2);
    const lMaxDimensionsTallyGrids = useMemo<Dimensions>(
        () => 
        {
            const gMaxHeightTallyGrid = Math.floor((lHeightConTop - 7 * gConTopSideRowGap - gFontSizeTitle - 2 * gConTopSidePadding) / 7);
            const gMaxWidthTallyGrid = Math.floor(lWidthTopSide - 2 * gConTopSidePadding - 2);

            return { width: Math.max(40, gMaxWidthTallyGrid), height: Math.max(40, gMaxHeightTallyGrid)};
        },
        [ lWidthTopSide ]
    );

    // The maximum dimensions of the game grid.
    // const gMaxHeightGameGrid = Math.floor(lHeightConTop - gHeightStatsTable);
    // const gMaxWidthGameGrid = Math.floor(gWidthConTopMid);
    const lMaxDimensionsGameGrid = useMemo<Dimensions>(
        () => 
        {
            const lMaxHeightGameGrid = lHeightConTop - gHeightStatsTable - (2 * gConGameInfoPadding + 2 * gConGameInfoRowGap + 3 * gLblGameInfoTextSize); // Math.floor(
            const lMaxWidthGameGrid = lWidthConTopMid; // Math.floor(

            return { width: lMaxWidthGameGrid, height: lMaxHeightGameGrid };
        },
        [ lHeightConTop, lWidthConTopMid ]
    );

    const lMaxDimensionsGameButton = useMemo<Dimensions>(
        () => 
        {
            const lMaxWidthGameButton : number = Math.floor((cxWindowSize.width - 2 * gConGameControlsPadding - 4 * gConGameControlsSubColumnGap) / 5);
            const lMaxHeightGameButton : number = Math.floor((lHeightConBottom - 2 * gConGameControlsPadding - gConGameControlsRowGap) / 2);

            return { width: lMaxWidthGameButton, height: lMaxHeightGameButton };
        },
        [ cxWindowSize, lHeightConBottom ]
    );

    const lMaxSizeGameButtonSymbol : number = useMemo(
        () =>
        {
            return Math.min(lMaxDimensionsGameButton.width, lMaxDimensionsGameButton.height) - 2 * gBtnGameControlPadding;
        },
        [ lMaxDimensionsGameButton ]
    );

    // The maximum dimension of the game buttons.
    // const gMaxWidthGameButton : number = Math.floor((cxWindowSize.width - 2 * gConGameControlsPadding - 4 * gConGameControlsSubColumnGap) / 5);
    // const gMaxHeightGameButton : number = Math.floor((lHeightConBottom - 2 * gConGameControlsPadding - gConGameControlsRowGap) / 2);
    // const gMaxSizeGameButton : number = Math.min(gMaxWidthGameButton, gMaxHeightGameButton);
    // const gMaxSizeGameButtonSymbol : number = gMaxSizeGameButton - 2 * gBtnGameControlPadding;

    const lGameButtonSymbolsTop = useMemo<GameButtonProps[]>(
        () =>
        {
            return [
                prGameButtons.left, prGameButtons.leftMax, prGameButtons.hold, prGameButtons.rightMax, prGameButtons.right
            ];
        },
        [ prGameButtons ]
    );

    const lGameButtonSymbolsBottom = useMemo<GameButtonProps[]>(
        () =>
        {
            return [
                prGameButtons.anticlockwise, prGameButtons.rotate180, prGameButtons.swapHoldWithNext, prGameButtons.downMax, prGameButtons.clockwise
                // prGameButtons.anticlockwise, prGameButtons.down, prGameButtons.rotate180, prGameButtons.downMax, prGameButtons.clockwise
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

    const lStyleConBlockTallies = useMemo<CSSProperties>(
        () =>
        {
            return { 
                ...styles.conTopSide, 
                ...styles.conTopLeft, 
                borderColor: theme.std.pageContainer.background 
            };
        },
        [ theme ]
    );

    
    const lStyleConNextAndHeldBlocks = useMemo<CSSProperties>(
        () =>
        {
            return { ...styles.conTopSide, ...styles.conTopRight, borderColor: theme.std.pageContainer.background };
        },
        [ theme ]
    );

    const lStyleConGameButtons = useMemo<CSSProperties>(
        () =>
        {
            return { ...styles.conBottom, borderColor: theme.std.pageContainer.background };
        },
        [ theme ]
    );

    const lStyleConBtnPlayExit = useMemo<CSSProperties>(
        () =>
        {
            return { ...styles.conMenuControls, backgroundColor: theme.std.header.background + "AA" };
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

    const lStyleTable = useMemo<StyleTableStd>(
        () =>
        {
            return {
                con: {
                    borderColor: theme.std.pageContainer.background, overflowX: "auto",
                    alignSelf: "flex-start", borderBottomRightRadius: spacingN()
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

    const lStyleGridSideContainers = useMemo<CSSProperties>(
        () =>
        {
            return {
                borderRadius: 10,
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

            {/* The top section (block tallies, the grid itself, and the next/held blocks) */}
            <div style = { styles.conTop }>

                {/* Block Tallies */}
                <div style = { lStyleConBlockTallies } className = 'hideScrollBar'>
                    <TextStd prText = "TALLY" prIsBold prStyle = { styles.lblTitle } />
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
                                        prMaxHeight = { lMaxDimensionsTallyGrids.height } 
                                        prMaxWidth = { lMaxDimensionsTallyGrids.width } 
                                        prColourBackground='transparent'
                                        prColourBorder = { theme.std.pageContainer.background }
                                        prStyle = { lStyleGridSideContainers }
                                    />
                                );
                            }
                        )
                    }
                </div>

                {/* Table and Grid */}
                <div style = { styles.conTopMid }>

                    {/* Table that displays the game's local and global records. */}
                    <div style = { styles.conTable } className = "hideScrollBar">
                        <TableStd 
                            prData = { prStats }
                            // prSizeText = { -1 } 
                            prStyle = { lStyleTable }
                            prBorders = { gBordersTable }
                        />
                    </div>

                    {/* The user's current score, multiplier, and number of line clears. */}
                    <div style = { styles.conGameInfo }>
                        <TextBlocks prText = { `S:${utils.intToCommaSeparatedString(prScore)}` } prSizeText = { gLblGameInfoTextSize } prColourBackground = 'transparent' prRandomiseColourPatternStart = { false } />
                        <TextBlocks prText = { `M:x${prMultiplier}` } prSizeText = { gLblGameInfoTextSize } prColourBackground = 'transparent' prRandomiseColourPatternStart = { false } />
                        <TextBlocks prText = { `L:${prLinesCleared}` } prSizeText = { gLblGameInfoTextSize } prColourBackground = 'transparent' prRandomiseColourPatternStart = { false } />
                    </div>

                    {/* The grid on which the game is played. */}
                    <div style = { styles.conGrid }>
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
                </div>

                {/* The 'next' and 'held' blocks. */}
                <div style = { lStyleConNextAndHeldBlocks }>

                    <div style = { styles.conNextBlocks }>
                        <TextStd prText = "NEXT" prIsBold prStyle = { styles.lblTitle } />
                        {
                            prNextBlocks.map(
                                (pNextBlock, pIndex) =>
                                {
                                    const lGrid = new Grid(4, 4);

                                    lGrid.drawBlockAt(pNextBlock, "CentreMid");

                                    // const lOnClick = (pIndex == prNextBlocks.length - 1) ? prHandlers.rotateNextBlock : undefined;

                                    return (
                                        <GridDisplayer 
                                            key = { pIndex }
                                            prGrid = { lGrid } 
                                            prMaxHeight = { lMaxDimensionsTallyGrids.height } 
                                            prMaxWidth = { lMaxDimensionsTallyGrids.width } 
                                            // prColourBorder = { pIndex == prNextBlocks.length - 1 ? theme.cst.game.borderNextBlock : theme.std.pageContainer.background }
                                            prColourBorder = { pIndex == prNextBlocks.length - 1 ? prNextBlocks[prNextBlocks.length - 1].getColour() : theme.std.pageContainer.background }
                                            prColourBackground = 'transparent'
                                            prStyle = { lStyleGridSideContainers }
                                            prOnPressLeft = { prAntiClockwiseNext } 
                                            prOnPressRight = { prClockwiseNext }
                                            prItemOnPress = { pIndex }
                                        />
                                    );
                                }
                            )
                        }
                    </div>

                    {/* <GridDisplayer 
                        prGrid = { gSymbolSwap.grid }
                        prMaxHeight = { lMaxDimensionsTallyGrids.height } prMaxWidth = { lMaxDimensionsTallyGrids.width } 
                        prColourBackground = 'transparent' prColourBorder = { prGameButtons.hold.symbol.colour }
                        prColourFilledCell = { prGameButtons.hold.symbol.colour }
                        prStyle = { lStyleGridSideContainers } prPadding = { 4 }
                        prOnPress = { prSwapNextBlockWithHeldBlock }
                    /> */}

                    <div style = { styles.conHoldBlock }>
                        <TextStd prText = "HOLD" prIsBold prStyle = { styles.lblTitle } />
                        <GridDisplayer 
                            prGrid = { prGridHold } 
                            // prOnPress={prClockwiseHeld}
                            prOnPressLeft = { prAntiClockwiseHeld }
                            prOnPressRight = { prClockwiseHeld }
                            prMaxHeight = { lMaxDimensionsTallyGrids.height } 
                            prMaxWidth = { lMaxDimensionsTallyGrids.width } 
                            prColourBackground = 'transparent'
                            prColourBorder = { theme.std.pageContainer.background }
                            prStyle = { lStyleGridSideContainers }
                            prUpdater = { prUpdater }
                        />
                    </div>

                </div>

            </div>

            {/* Game buttons. */}
            <div style = { lStyleConGameButtons }>
                {/* The 'play' and 'exit' buttons */}
                {
                    !prGameInProgress && (
                        <div style = { lStyleConBtnPlayExit }>
                            <ButtonBlocks 
                                prText = "PLAY" 
                                prOnPress = { prOnPressPlay } 
                                prColourBackground = { "transparent" }
                                prColourEmptyCell = { "transparent" }
                                prStyle = { lStyleBtnPlayExit } 
                            />
                            <ButtonBlocks 
                                prText = "EXIT" 
                                prOnPress = { prOnPressExit } 
                                prColourBackground = { "transparent" }
                                prColourEmptyCell = { "transparent" }
                                prStyle = { lStyleBtnPlayExit } 
                            />
                        </div>
                    )
                }

                {/* The buttons used to play the game */}
                <div style = { styles.conGameControls }>

                    {/* First row of buttons */}
                    <div style = { styles.conGameControlsSub }>
                        {
                            lGameButtonSymbolsTop.map(
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
                                                prColourBackground='transparent'
                                            />
                                        </ButtonStd>
                                    )
                                }
                            )
                        }
                    </div>

                    {/* Second row of buttons */}
                    <div style = { styles.conGameControlsSub }>
                    {
                            lGameButtonSymbolsBottom.map(
                                (pButton, pIndex) =>
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
                                                prColourBackground='transparent'
                                            />
                                        </ButtonStd>
                                    )
                                }
                            )
                        }
                    </div>
                </div>

            </div>

        </PageContainerStd>
    );
}

const gConTopHeight : string = "75%";

const gConBottomHeight : string = "25%";

const gConTopMidWidth : string = "56%";

const gConTopSideWidth : string = "22%";

const gConTopSideMaxWidth : number = 200;

const gConTopSideRowGap : number = spacingN(-2);

const gConTopSidePadding : number = spacingN(-2);

const gConGameControlsPadding : number = 6;
// styles.conGameControls.padding

const gConGameControlsRowGap : number = 6;

const gConGameControlsSubColumnGap : number = 6;
//styles.conGameControlsSub.columnGap

const gBtnGameControlPadding : number = 7;
//styles.btnGameControl.padding

const gFontSizeTitle : number = fontSizeN();

const gConGameInfoRowGap : number = 7;

const gConGameInfoPadding : number = 7;

const gLblGameInfoTextSize : number = 17;

const styles : { [ key: string ]: CSSProperties } = 
{
    container:
    {
        padding: 0,
        // rowGap: spacing,
        //maxWidth: 800,
        height: "100%",
        overflow: "hidden"
    },
    conTop:
    {
        flexDirection: "row",
        width: "100%",
        height: gConTopHeight,
        backgroundColor: "transparent"
        //height: 0.75 * window.innerHeight,
        //backgroundColor: "#330606"
    },
    conBottom:
    {
        width: "100%",
        height: gConBottomHeight,
        //height: 0.25 * window.innerHeight,
        // borderTop: "2px solid",
        justifyContent: "center",
        position: "relative"
        //backgroundColor: "#000853"
    },
    conTopSide:
    {
        width: "22%", maxWidth: gConTopSideMaxWidth,
        //backgroundColor: "#005304",
        padding: gConTopSidePadding,
        rowGap: gConTopSideRowGap,
        justifyContent: "center",
        alignItems: "center",
        overflowY: "scroll"
    },
    conTopMid:
    {
        width: gConTopMidWidth,
        justifyContent: "space-between",
        backgroundColor: "transparent",
        flexGrow: 1
        //alignItems: "center"
    },
    conGameInfo:
    {
        rowGap: gConGameInfoRowGap,
        flexDirection: "column",
        padding: gConGameInfoPadding
    },
    lblTitle:
    {
        fontSize: gFontSizeTitle,
        textAlign: 'center'
    },
    conGrid:
    {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    conTopLeft:
    {
        borderRight: "2px solid",
        borderBottom: "2px solid",
        justifyContent: "start",
        borderBottomRightRadius: spacingN()
    },
    conTopRight:
    {
        borderLeft: "2px solid",
        borderBottom: "2px solid",
        borderBottomLeftRadius: spacingN(),
        rowGap: spacingN(-1),
        // marginTop: "auto",
        justifyContent: "end",
    },
    conNextBlocks:
    {
        rowGap: spacingN(-2),
    },
    conHoldBlock:
    {
        rowGap: spacingN(-2),
        alignItems: "center"
    },
    conMenuControls:
    {
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        rowGap: spacingN(-2),
        padding: spacingN(-1),
        zIndex: 1,
        position: "absolute",
    },
    btnMenuControl:
    {
        width: "80%",
        maxWidth: 400,
        borderRadius: spacingN(),
        padding: 8,
        alignItems: "center",
    },
    conGameControls:
    {
        height: "100%",
        padding: gConGameControlsPadding, //spacingN(-2),
        rowGap: gConGameControlsRowGap,
        justifyContent: "space-between",
        alignItems: "center"
    },
    conGameControlsSub:
    {
        // height: "50%",
        flexDirection: "row",
        columnGap: gConGameControlsSubColumnGap, //spacingN(-1),
        alignItems: "center"
    },
    btnGameControl:
    {
        padding: gBtnGameControlPadding,
        borderRadius: spacingN(-1),
        //border: "1px solid"
    },
    conTable:
    {
        alignSelf: "left", overflowX: "scroll"
    }
};

const gBordersTable : boolean[] = [ false, true, true, false ];

// The height of the 'stats table'.
const gHeightStatsTable : number = Math.floor(defaultTableHeight(3, 15, gBordersTable));

export default GamePortrait;