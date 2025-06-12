import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';


import globalProps, { utilsGlobalStyles } from '../../styles';
import optionsHeaderButtons from '../../components/options_header_buttons.jsx';

import ButtonStandard from '../../components/button_standard/ButtonStandard.jsx';
import PageContainer from '../../components/page_container/PageContainer.jsx';
import Grid from '../../classes/Grid';
import Block from '../../classes/Block';
import GridDisplayer from '../../components/grid_displayer/GridDisplayer.jsx';
import GridChar from '../../classes/GridChar';
import gridSymbols from './symbols_buttons';
import ButtonBlocks from '../../components/button_blocks/ButtonBlocks';
import TextBlocks from '../../components/text_blocks/TextBlocks';
import utils from '../../utils/utils';
import consts from '../../utils/constants';
import ThemeContext from "../../contexts/ThemeContext.js";
import PreferenceContext from '../../contexts/PreferenceContext.js';
import TextStandard from '../../components/text_standard/TextStandard';
import TextInputStandard from '../../components/text_input_standard/TextInputStandard.jsx'
import TableStandard, { defaultTableHeight } from '../../components/table_standard/TableStandard';
import { PopUpOk } from '../../components/pop_up_standard/PopUpStandard.jsx'
import utilsAppSpecific from '../../utils/utils_app_specific';

function GameLandscape({ prGrid, prBlockTallies, prNextBlocks, prGridHold, prGameInProgress, prActiveBlocks, prStats, 
                         prHandlers, prButtonSymbols, pUpdater }) 
{
    // Acquire global theme.
    const { themeName } = useContext(ThemeContext);
    let theme = globalProps.themes[themeName];

    const navigate = useNavigate();

    const [ optionsPopUpMsg, setOptionsPopUpMsg ] = useState(undefined);

    // The width of the containers' (right) border.
    const lWidthBorder = parseInt(styles.con.borderRight);

    // The width of the control containers.
    const lWidthConControls = utils.GetPercentVal(styles.conControls.width, window.innerWidth);

    // The maximum dimension of the game buttons.
    const lMaxWidthGameButton = Math.floor(lWidthConControls - 2 * styles.conControls.padding - lWidthBorder);
    const lMaxHeightGameButton = Math.floor((window.innerHeight - 2 * styles.conControls.padding - 4 * styles.conControls.rowGap) / 5);
    const lMaxSizeGameButton = Math.min(lMaxWidthGameButton, lMaxHeightGameButton);
    let lMaxSizeGameButtonSymbol = lMaxSizeGameButton - 2 * styles.btnGameControl.padding;
    lMaxSizeGameButtonSymbol = lMaxSizeGameButtonSymbol > 100 ? 100 : lMaxSizeGameButtonSymbol;

    // The maximum dimensions of the game grid.
    const lMaxHeightGameGrid = Math.floor(window.innerHeight);
    const lMaxWidthGameGrid = Math.floor(utils.GetPercentVal(styles.conGrid.width, window.innerWidth));

    // The size of tjhe stats table's text.
    const lSizeTextStatsTable = window.innerWidth >= 800 ? 0 : -1;

    // The expected height of the stats table.
    const lHeightStatsTable = defaultTableHeight(4, lSizeTextStatsTable, [ true, true, false, false ]);

    // The dimensions of the tally container.
    const lHeightConTally = window.innerHeight - lHeightStatsTable;
    const lWidthConTally = utils.GetPercentVal(styles.conStats.width, window.innerWidth);

    // The maximum dimensions of the grids displayed in the tally container (such that there's two columns).
    let lMaxHeightTallyGrid = Math.floor((lHeightConTally - 4 * styles.conTallySub.rowGap - utilsGlobalStyles.fontSizeN() - 2 * styles.conTally.padding) / 4);
    let lMaxWidthTallyGrid = Math.floor((lWidthConTally - styles.conTallySub.columnGap - 2 * styles.conTally.padding -  lWidthBorder) / 2);
    lMaxHeightTallyGrid = lMaxHeightTallyGrid > 100 ? 100 : lMaxHeightTallyGrid;
    lMaxWidthTallyGrid = lMaxWidthTallyGrid > 100 ? 100 : lMaxWidthTallyGrid;

    // The maximum dimensions of the grids displayed in the 'next blocks' container.
    let lMaxHeightNextGrids = Math.floor(
        (window.innerHeight - styles.conHoldBlock.rowGap - 4 * styles.conNextBlocks.rowGap - 
         2 * utilsGlobalStyles.fontSizeN() - 2 * styles.conBlocks.padding - styles.conBlocks.rowGap) / 5
    );
    let lMaxWidthNextGrids = Math.floor(utils.GetPercentVal(styles.conBlocks.width, window.innerWidth) - 2 * styles.conBlocks.padding);
    lMaxHeightNextGrids = lMaxHeightNextGrids > 100 ? 100 : lMaxHeightNextGrids;
    lMaxWidthNextGrids = lMaxWidthNextGrids > 100 ? 100 : lMaxWidthNextGrids;

    // The 'left' game buttons.
    const lGameButtonSymbolsLeft = [
        prButtonSymbols.leftMax, prButtonSymbols.down, prButtonSymbols.hold, prButtonSymbols.left, prButtonSymbols.anticlockwise
    ];

    // The 'right' game buttons
    const lGameButtonSymbolsRight = [
        prButtonSymbols.rightMax, prButtonSymbols.downMax, prButtonSymbols.rotate180, prButtonSymbols.right, prButtonSymbols.clockwise
    ];

    return ( 
        <PageContainer
            navigate = { navigate }
            showHeader = { false }
            optionsLeftHeaderButtons = { [ optionsHeaderButtons.back ] }
            optionsRightHeaderButtons = { [ optionsHeaderButtons.settings ] }
            optionsPopUpMsg = { optionsPopUpMsg }
            style = {{ ...styles.container, backgroundColor: theme.header }}
        >
            <div 
                style = {{ 
                    ...styles.conControls, ...styles.con, borderColor: theme.content, 
                    justifyContent: prGameInProgress ? "space-between" : "center" 
                }}
            >
                {
                    !prGameInProgress && (
                        <div style = {{ ...styles.conMenuControl, backgroundColor: theme.header + "AA" }}>
                            <ButtonBlocks 
                                text = "PLAY" prSizeText = { 50 }
                                onPress = { prHandlers.play }
                                prColourBackground = { "transparent" }
                                prColourEmptyCell = { "transparent" }
                                prIsHorizontal = { false }
                                style = {{ 
                                    ...styles.btnMenuControl, 
                                    backgroundColor: theme.content + "CB"
                                }} 
                            />
                        </div>
                    )
                }
                {
                    lGameButtonSymbolsLeft.map(
                        (pSymbol, pIndex) =>
                        {
                            const lOnPress = prHandlers[pSymbol.name] ? prHandlers[pSymbol.name] : () => { console.log("No handler assigned."); };

                            return (
                                <ButtonStandard 
                                    key = { pIndex }
                                    style = {{ 
                                        ...styles.btnGameControl, border: `1px solid ${pSymbol.colour}`,
                                        width: lMaxWidthGameButton, height: lMaxHeightGameButton
                                    }}
                                    onPress = { lOnPress } isOnDown
                                >
                                    <GridDisplayer 
                                        prGrid = { pSymbol.grid } 
                                        prMaxHeight = { lMaxSizeGameButtonSymbol }
                                        prMaxWidth = { lMaxSizeGameButtonSymbol }
                                        prColourBackground = { theme.buttonContent }
                                    />
                                </ButtonStandard>
                            )
                        }
                    )
                }
            </div>

            <div style = {{ ...styles.conStats, ...styles.con, borderColor: theme.content }}>
                <div style = { styles.conTally }>
                    <TextStandard text = "TALLY" isBold style = {{ textAlign: "center" }} />
                    <div style = { styles.conTallySub }>
                        {
                            Object.keys(Block.Type).map(
                                (pBlockType, pIndex) =>
                                {
                                    const lGrid = new Grid(4, 4);

                                    const lBlock = new Block(pBlockType);

                                    if (!prActiveBlocks.includes(pBlockType))
                                    {
                                        lBlock.colour = Block.sColourShadow;
                                    }

                                    lGrid.DrawBlockAt(lBlock, Grid.DrawPosition.CentreMid, false);

                                    lGrid.text = prBlockTallies[pBlockType].toString().padStart(3, '0');

                                    return (
                                        <GridDisplayer 
                                            key = { pIndex }
                                            prGrid = { lGrid } 
                                            prMaxHeight = { lMaxHeightTallyGrid } 
                                            prMaxWidth = { lMaxWidthTallyGrid } 
                                        />
                                    );
                                }
                            )
                        }
                    </div>
                </div>
                <TableStandard 
                    prData = { prStats }
                    prSizeText = { lSizeTextStatsTable }
                    prBorders = { [ true, true, false, false ] }
                />
            </div>

            <div style = {{ ...styles.conGrid, ...styles.con, borderColor: theme.content }}>
                {
                    prGrid && (
                        <GridDisplayer 
                            prGrid = { prGrid } 
                            prMaxWidth = { lMaxWidthGameGrid } 
                            prMaxHeight = { lMaxHeightGameGrid } 
                        />
                    )
                }
            </div>

            <div style = {{ ...styles.conBlocks, ...styles.con, borderColor: theme.content }}>

                <div style = { styles.conNextBlocks }>
                    <TextStandard text = "NEXT" isBold style = {{ textAlign: "center" }} />
                    {
                        prNextBlocks.map(
                            (pNextBlock, pIndex) =>
                            {
                                const lGrid = new Grid(4, 4);

                                lGrid.DrawBlockAt(pNextBlock, Grid.DrawPosition.CentreMid);

                                const lOnClick = (pIndex == prNextBlocks.length - 1) ? prHandlers.rotateNextBlock : undefined;

                                return (
                                    <GridDisplayer 
                                        key = { pIndex }
                                        prGrid = { lGrid } 
                                        prMaxHeight = { lMaxHeightNextGrids } 
                                        prMaxWidth = { lMaxWidthNextGrids } 
                                        prColourBorder = { pIndex == prNextBlocks.length - 1 ? theme.selected : undefined }
                                        prOnClick = { lOnClick }
                                    />
                                );
                            }
                        )
                    }
                </div>
                
                <div style = { styles.conHoldBlock }>
                    <TextStandard text = "HOLD" isBold style = {{ textAlign: "center" }} />
                    <GridDisplayer 
                        prGrid = { prGridHold } 
                        prOnClick = { prHandlers.rotateHeldBlock }
                        prMaxHeight = { lMaxHeightNextGrids } 
                        prMaxWidth = { lMaxWidthNextGrids } 
                    />
                </div>

            </div>

            <div 
                style = {{ 
                    ...styles.conControls, ...styles.con, ...styles.conRightMost, borderColor: theme.content, 
                    justifyContent: prGameInProgress ? "space-between" : "center" 
                }}
            >
                {
                    !prGameInProgress && (
                        <div style = {{ ...styles.conMenuControl, backgroundColor: theme.header + "AA" }}>
                            <ButtonBlocks 
                                text = "EXIT" prSizeText = { 50 }
                                onPress = { () => prHandlers.exit(navigate) } 
                                prColourBackground = { "transparent" }
                                prColourEmptyCell = { "transparent" }
                                prIsHorizontal = { false }
                                style = {{ ...styles.btnMenuControl, backgroundColor: theme.content + "CB" }} 
                            />
                        </div>
                    )
                }
                {
                    lGameButtonSymbolsRight.map(
                        (pSymbol, pIndex) =>
                        {
                            const lOnPress = prHandlers[pSymbol.name] ? prHandlers[pSymbol.name] : () => { console.log("No handler assigned."); };

                            return (
                                <ButtonStandard 
                                    key = { pIndex }
                                    style = {{ 
                                        ...styles.btnGameControl, border: `1px solid ${pSymbol.colour}`, 
                                        width: lMaxWidthGameButton, height: lMaxHeightGameButton
                                    }}
                                    onPress = { lOnPress } isOnDown
                                >
                                    <GridDisplayer 
                                        prGrid = { pSymbol.grid } 
                                        prMaxHeight = { lMaxSizeGameButtonSymbol }
                                        prMaxWidth = { lMaxSizeGameButtonSymbol }
                                        prColourBackground = { theme.buttonContent }
                                    />
                                </ButtonStandard>
                            )
                        }
                    )
                }
            </div>

        </PageContainer>
    );
}

GameLandscape.propTypes = 
{
    prGrid: PropTypes.shape({ instance: PropTypes.instanceOf(Grid) }).isRequired,
    prBlockTallies: PropTypes.shape({
        I: PropTypes.number,
        J: PropTypes.number,
        L: PropTypes.number,
        O: PropTypes.number,
        S: PropTypes.number,
        T: PropTypes.number,
        Z: PropTypes.number,
    }).isRequired,
    prNextBlocks: PropTypes.arrayOf(PropTypes.instanceOf(Block)).isRequired,
    prGameInProgress: PropTypes.bool.isRequired,
    prActiveBlocks: PropTypes.string.isRequired,
    prHandlers: PropTypes.shape({
        play: PropTypes.func,
    }).isRequired,
}

const styles = 
{
    container:
    {
        height: "100%",
        flexDirection: "row",
        padding: 0,
    },
    con:
    {
        height: "100%",
        borderRight: "2px solid"
    },
    conControls:
    {
        //backgroundColor: "#0A0AA1",
        width: "15%",
        padding: 6,
        rowGap: 6,
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative"
    },
    conStats:
    {
        //backgroundColor: "#500AA1",
        width: "25%",
    },
    conTally:
    {
        padding: utilsGlobalStyles.spacingVertN(-2),
        rowGap: utilsGlobalStyles.spacingVertN(-2),
        flexGrow: 1
    },
    conTallySub:
    {
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: utilsGlobalStyles.spacingVertN(-2),
        columnGap: utilsGlobalStyles.spacingVertN(-2),
        justifyContent: "center"
    },
    conGrid:
    {
        //backgroundColor: "#0A83A1",
        width: "35%",
        alignItems: "center",
        justifyContent: "center"
    },
    conBlocks:
    {
        width: "10%",
        padding: utilsGlobalStyles.spacingVertN(-2),
        rowGap: utilsGlobalStyles.spacingVertN(-1),
        justifyContent: "center",
        alignItems: "center"
    },
    conNextBlocks:
    {
        rowGap: utilsGlobalStyles.spacingVertN(-2),
        alignItems: "center"
    },
    conHoldBlock:
    {
        rowGap: utilsGlobalStyles.spacingVertN(-2),
        alignItems: "center"
    },
    conRightMost:
    {
        borderRightWidth: 0
    },
    btnGameControl:
    {
        padding: 7,
        borderRadius: globalProps.borderRadiusStandard,
        width: "fit-content",
        //border: "1px solid"
    },
    btnMenuControl:
    {
        height: "100%",
        maxHeight: 350,
        borderRadius: globalProps.borderRadiusStandard,
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
    }
};

// The height of the 'stats table'.
const lHeightStatsTable = Math.floor(defaultTableHeight(4, -1, [ true, true, false, false ]));

export default GameLandscape;