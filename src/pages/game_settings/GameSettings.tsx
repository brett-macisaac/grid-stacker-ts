import React, { useState, useEffect, useContext, useRef, useMemo, useCallback, memo, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import ClearIcon from '@mui/icons-material/Clear';

import { ButtonStd, StylesButtonStd, SliderStd, TextStd, PageContainerStd, StylesPageContainerStd, utils, PopUpProps, NavButtonProps, useTheme, useWindowSize, StylesSliderStd } from "../../standard_ui/standard_ui";
import { useUser } from '../../contexts/UserContext';
import { usePrefs } from '../../contexts/PreferenceContext';
import { Account, Back, HeaderLogo, SettingsIcon } from "../nav_buttons";
import { User, MetaStats, GameStats } from "../../types";
import ApiRequestor from '../../ApiRequestor';
import { stylePageConMenuWithNavButton, styleBtnNextPageBottom, styleConBtnNextPage, stylePageTitle, styleConInner, styleContainer, styleCountLabel } from "../../utils/styles"
const gHeaderButtonsLeft : NavButtonProps[] = [ Back ];
const gHeaderButtonsRight : NavButtonProps[] = [ SettingsIcon ];

import { fontSizeN, spacingN } from "../../utils/utils_ui";
import { lclStrgKeyPreferences } from "../../utils/constants";

import Block from '../../classes/Block';
import GameStatsManager from '../../classes/GameStatsManager';
import Grid from '../../classes/Grid';
import GridDisplayer from '../../components/grid_displayer/GridDisplayer';
import ButtonBlocks from '../../components/button_blocks/ButtonBlocks';
import CountLabel, { StylesCountLabel } from '../../components/count_label/CountLabel';
import Container, { StylesContainer } from '../../components/container/Container';
import TextBlocks from '../../components/text_blocks/TextBlocks';
import TableStd, { StyleTableStd, TableData } from '../../components/table_std/TableStd';
import { lclStrgKeyPopUpBlackList } from '../../standard_ui/components/pop_up_std/PopUpStd';
import { getTableDataHighScores } from "../../utils/utils_app_specific";

const gRngCols = { min: 4, max: 10 };
const gRngRows = { min: 4, max: 22 };

const gGridFullSize = new Grid(gRngCols.max, gRngRows.max);

type TimesPlayed = { local: number, global: number };

// https://dmitripavlutin.com/react-throttle-debounce/
// https://dmitripavlutin.com/react-cleanup-async-effects/

function GameSettings() 
{
    // Acquire user.
    const cxUser = useUser();

    // Acquire theme.
    const { theme } = useTheme();

    // Acquire preferences.
    const cxPrefs = usePrefs();

    const cxWindowSize = useWindowSize();

    const navigate = useNavigate();

    const [ stNumColumns, setNumColumns ] = useState<number>(cxPrefs.prefs.cols);

    const [ stNumRows, setNumRows ] = useState<number>(cxPrefs.prefs.rows);

    const [ stBlockList, setBlockList ] = useState<string>(cxPrefs.prefs.blocks);

    const [ stHighScores, setHighScores ] = useState<TableData>(getTableDataHighScores());

    const [ stTimesPlayed, setTimesPlayed ] = useState<TimesPlayed>({ local: 0, global: 0 });

    const [ stOptionsPopUpMsg, setOptionsPopUpMsg ] = useState<PopUpProps | undefined>(undefined);

    const [ stIsLoadingStats, setIsLoadingStats ] = useState<boolean>(false);

    const rfStatUpdateCounts = useRef(0);

    // const debouncedHandler = useMemo(
    //     () => debounce(async (asyncCallback) => await asyncCallback(), 500),
    //     []
    // );

    useEffect(
        () =>
        {
            // cxPrefs.update(stNumColumns, stNumRows, undefined, stBlockList);

            updateStatsDebounced(stNumColumns, stNumRows, stBlockList);
        },
        [ stNumColumns, stNumRows, stBlockList ]
    );

    useEffect(
        () =>
        {
            return () => 
            {
                // Cleanup of the debounced update.
                updateStatsDebounced.cancel();
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

    const updateStatsDebounced = useMemo(
        () =>
        {
            return debounce(
                async (pNumColumns : number, pNumRows: number, pBlockList : string) =>
                // async () =>
                {
                    // cxPrefs.update(pNumColumns, pNumRows, pBlockList = pBlockList);

                    console.log("Stats Update #" + ++(rfStatUpdateCounts.current));

                    console.log(`${pNumRows}x${pNumColumns}`);

                    const lKeyGridSize = Grid.getKeyGridSize(pNumColumns, pNumRows);

                    const lGameStatsLocal : GameStats = GameStatsManager.getStatsLocal(pBlockList, lKeyGridSize) || GameStatsManager.getDefaultGameStats();

                    setIsLoadingStats(true);

                    // Get global stats (if available).
                    const lGameStatsGlobal : GameStats = await GameStatsManager.getStatsGlobal(pBlockList, lKeyGridSize, false) || GameStatsManager.getDefaultGameStats();

                    setIsLoadingStats(false);

                    // Set state variables.
                    setHighScores(getTableDataHighScores(lGameStatsGlobal, lGameStatsLocal));

                    setTimesPlayed({ local: lGameStatsLocal.timesPlayed || 0, global: lGameStatsGlobal.timesPlayed || 0 });
                },
                750
            )
        }, 
        [] // [ stNumColumns, stNumRows, stBlockList ]
    );

    const toggleBlock = useCallback(
        (pBlockType : string) =>
        {
            let lBlockList : string[] = stBlockList.split('');

            const lIsBlockSelected = lBlockList.includes(pBlockType);

            if (lBlockList.length == 1 && lIsBlockSelected)
            {
                setOptionsPopUpMsg(
                    {
                        title: "Invalid Setting",
                        message: `You must select at least one block to play.`
                    }
                );
                return;
            }
            else if (lIsBlockSelected)
            {
                lBlockList = lBlockList.filter(block => block !== pBlockType);
                //console.log("Removed the " + pBlockType + " piece.");
            }
            else
            {
                lBlockList.push(pBlockType);
                //console.log("Added the " + pBlockType + " piece.");

                // blockList must always be in alphabetical order.
                lBlockList.sort();
            }

            const lBlockListNew : string = lBlockList.join('');
            console.log(lBlockListNew);

            setBlockList(lBlockListNew);
        },
        [ stBlockList ]
    );

    const lHandleNext = useCallback(
        () =>
        {
            cxPrefs.update(stNumColumns, stNumRows, undefined, stBlockList);

            if (cxUser.user)
            {
                navigate("/game");
            }
            else
                navigate("/guestUsername");
        },
        [ cxUser, stNumColumns, stNumRows, stBlockList ]
    );

    const lOnChangeSldNumRows = useCallback(
        (pVal : number) => { setNumRows(pVal); },
        []
    );

    const lOnChangeSldNumCols = useCallback(
        (pVal : number) => { setNumColumns(pVal); },
        []
    );

    const lStyleSldNumRows = useMemo<StylesSliderStd>(
        () => 
        {
            return {
                con: {
                    border: "none",
                    rowGap: spacingN(0),
                },
                progress: { 
                    // borderLeft: `1px solid ${theme.std.header.border}`, 
                    borderRight: `1px solid ${theme.cst.grid.background}`, 
                    borderRadius: 0
                }
            }
        },
        [ theme ]
    );

    const lStyleSldNumCols = useMemo<StylesSliderStd>(
        () => 
        {
            return {
                con: {
                    border: "none",
                    rowGap: spacingN(0),
                },
                progress: { 
                    borderTop: `1px solid ${theme.cst.grid.background}`, 
                    // borderBottom: `1px solid ${theme.std.header.border}`, 
                    // borderRight: `1px solid ${theme.std.header.border}`, 
                    borderRadius: 0
                }
            }
        },
        [ theme ]
    );

    const lStyleConCrossIcon = useMemo<CSSProperties>(
        () =>
        {
            return { 
                height: 40, width: 40, flexShrink: 0,
                backgroundColor: theme.std.header.background, 
                borderBottomLeftRadius: spacingN(-2),
                // borderLeft: `1px solid ${theme.std.header.border}`,
                // borderBottom: `1px solid ${theme.std.header.border}`,
                justifyContent: "center", alignItems: "center"
            };
        },
        [ theme ]
    );

    const lStyleConSldNumCols = useMemo<CSSProperties>(
        () =>
        {
            return { height: 40, width: 300, flexDirection: "row" };
        },
        []
    );

    const lStyleConSliders = useMemo<CSSProperties>(
        () =>
        {
            return { height: 290, width: 290 };
        },
        []
    );

    const lStyleBtnPlay = useMemo<StylesButtonStd>(
        () =>
        {
            return styleBtnNextPageBottom(cxWindowSize.isPortraitOrBigScreen);
        },
        [ cxWindowSize ]
    );

    const lStyleCon = useMemo<StylesPageContainerStd>(
        () =>
        {
            return stylePageConMenuWithNavButton(cxWindowSize.isPortraitOrBigScreen);
        },
        [ cxWindowSize ]
    );

    const lStyleConBtnPlay = useMemo<CSSProperties>(
        () =>
        {
            return styleConBtnNextPage(cxWindowSize.isPortraitOrBigScreen, theme);
        },
        [ theme, cxWindowSize ]
    );

    const lGridVariable = useMemo<Grid>(
        () =>
        {
            return new Grid(stNumColumns, stNumRows);
        },
        [ stNumColumns, stNumRows ]
    );

    const lStyleTable = useMemo<StyleTableStd>(
        () =>
        {
            return {
                con: { border: "none" },
                cellHeader: { padding: 10 },
                cellContent: { padding: 10, textAlign: "center", }
            }
        },
        [ theme ]
    );

    return ( 
        <PageContainerStd
            prLogo = { HeaderLogo }
            prHeaderButtonsLeft = { gHeaderButtonsLeft }
            prHeaderButtonsRight = { gHeaderButtonsRight }
            prStyles = { lStyleCon }
            prPopUpProps = { stOptionsPopUpMsg }
        >
            <div style = { styleConInner }>

                <TextBlocks 
                    prText = "GAME OPTIONS" prSizeText = { 40 } 
                    prColourBackground = { theme.cst.gridCell.empty } 
                    prStyle = { lStyleTitle } 
                />

                <Container prTitle = "GRID DIMENSIONS" prStyles = { styleContainer }>

                    <TextStd
                        prText = "Select the grid's dimensions." 
                        prStyle = { styles.prompt } prIsItalic
                    />

                    <div style = { lStyleConSliders }>

                        <div style = {{ height: 250, flexDirection: "row" }}>

                            <SliderStd 
                                prMin = { 0 } prMax = { gRngRows.max } prValue = { stNumRows } prStep = { 1 } 
                                prIsVertical prIsVerticalTopDown = { false }
                                prOnChange = { lOnChangeSldNumRows }
                                prStyles = { lStyleSldNumRows } prWidth = { 40 }
                                prShowValue = { false } prShowLabel = { true } prShowStickyValue = { true }
                                prMinAllowed = { gRngRows.min }
                            />

                            <div style = { styles.conGrids }>
                                <GridDisplayer 
                                    prGrid = { gGridFullSize } 
                                    prMaxWidth = { 300 } prMaxHeight = { 300 } prSizeCell = { 10.3 }
                                    prColourEmptyCell='#00000060'
                                    prStyle = { styles.grid }
                                />
                                <GridDisplayer 
                                    prGrid = { lGridVariable } 
                                    prMaxWidth = { 300 } prMaxHeight = { 300 } prSizeCell = { 10.3 }
                                    prStyle = { styles.grid }
                                />
                            </div>

                        </div>

                        <div style = { lStyleConSldNumCols }>

                            <div 
                                style = { lStyleConCrossIcon }
                            >
                                <ClearIcon 
                                    sx = { { fill: theme.std.header.border, fontSize: 30 } }
                                />
                            </div>

                            <SliderStd 
                                prMin = { 0 } prMax = { gRngRows.max } prValue = { stNumColumns } prStep = { 1 }
                                prOnChange = { lOnChangeSldNumCols }
                                prStyles = { lStyleSldNumCols }
                                prShowValue = { false } prShowLabel = { true } prShowStickyValue = { true }
                                prWidth = { 250 }
                                prMinAllowed = { gRngCols.min } prMaxAllowed = { gRngCols.max }
                            />

                        </div>

                    </div>
                </Container>

                <Container prTitle = "BLOCKS" prStyles = { styleContainer }>
                    <TextStd prText = "Select the blocks you want to play with." prStyle = { styles.prompt } prIsItalic />
                    <div style = { styles.conBlocksInner }>
                        {
                            Block.sTypeArray.map(
                                (pBlockType, pIndex) =>
                                {
                                    const lGrid = new Grid(4, 4);

                                    const lBlock = new Block(pBlockType);

                                    if (!stBlockList.includes(pBlockType))
                                    {
                                        lBlock.colour = Block.sColourShadow;
                                    }

                                    lGrid.drawBlockAt(lBlock, "CentreMid");

                                    return (
                                        <GridDisplayer 
                                            key = { pIndex }
                                            prGrid = { lGrid } 
                                            prMaxHeight = { 60 } 
                                            prMaxWidth = { 60 } 
                                            prOnPress = { toggleBlock }
                                            prItemOnPress = { pBlockType }
                                        />
                                    )
                                }
                            )
                        }
                    </div>
                </Container>

                <Container prTitle = "STATS" prStyles = { styleContainer } prIsLoading = { stIsLoadingStats }>
                    <TextStd prText = "Stats for the selected game." prIsItalic />

                    <TableStd 
                        prData = { stHighScores }
                        prStyle = { lStyleTable }
                        //prBorderColour = { theme.borders }
                        // prBorders = { [ false, false, false, false ] }
                        prBorderSize = { 3 }
                        prBorderRadiusOuter = { spacingN(-2) }
                        //prStyleColumn = {{ backgroundColor: theme.content }}
                    />

                    <CountLabel prText = "Games Played (Global)" prCount = { utils.intToCommaSeparatedString(stTimesPlayed.global) } prStyles = { styleCountLabel } />

                    <CountLabel prText = "Games Played (Local)" prCount = { utils.intToCommaSeparatedString(stTimesPlayed.local) } prStyles = { styleCountLabel } />

                </Container>

                {/* Display stats for this game, such as number of times played and high-score. */}

            </div>

            {/* Next Page Button */}
            <div style = { lStyleConBtnPlay }>
                <ButtonBlocks 
                    prText = { cxUser.user ? "PLAY" : "NEXT" }
                    prOnPress = { lHandleNext }
                    prIsHorizontal = { cxWindowSize.isPortraitOrBigScreen }
                    prStyle = { lStyleBtnPlay }
                />
            </div>

        </PageContainerStd>
    );
}



const styles : { [key: string]: CSSProperties } =
{
    conGrids:
    {
        justifyContent: "flex-end", alignItems: "flex-start", position: "relative"
    },
    grid:
    {
        position: 'absolute', bottom: 0, left: 0
    },
    prompt: 
    {
        //textAlign: "center",
        marginBottom: spacingN(-1),
        fontSize: fontSizeN(0)
    },
    conStats:
    {
        rowGap: spacingN(-1),
        flexGrow: 0
    },
    tableHighScore:
    {
        //width: "fit-content",
        //alignSelf: "center"
    },
    conBlocksInner:
    {
        flexDirection: "row", flexWrap: "wrap", columnGap: 10, rowGap: 10, justifyContent: "center"
    },
};

export default GameSettings;