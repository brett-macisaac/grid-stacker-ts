import React, { useState, useEffect, useContext, useRef, useMemo, useCallback, memo, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

import { ButtonStd, StylesButtonStd, SliderStd, TextStd, PageContainerStd, StylesPageContainerStd, utils, PopUpProps, NavButtonProps, useTheme, useWindowSize, StylesSliderStd } from "../../standard_ui/standard_ui";
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

import GamePortrait from './GamePortrait';
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
import TableStd, { StyleTableStd, TableData } from '../../components/table_std/TableStd';
import { lclStrgKeyPopUpBlackList } from '../../standard_ui/components/pop_up_std/PopUpStd';
import { getTableDataHighScores } from "../../utils/utils_app_specific";
import MetaStatsManager from '../../classes/MetaStatsManager';
import GridSymbol from '../../classes/GridSymbol';

function createBlockTallies() : Map<BlockType, number>
{
    return new Map<BlockType, number>(
        [ 
            [ "I", 0 ],
            [ "J", 0 ],
            [ "L", 0 ],
            [ "O", 0 ],
            [ "S", 0 ],
            [ "T", 0 ],
            [ "Z", 0 ],
        ]
    );
}

function Game() 
{
    const navigate = useNavigate();

    const cxPrefs = usePrefs();

    const cxWindowSize = useWindowSize();

    const cxUser = useUser();

    // An object that tracks how much of each tally has been updated.
    const [ stBlockTallies, setBlockTallies ] = useState<Map<BlockType, number>>(createBlockTallies());

    const [ stIsLoading, setIsLoading ] = useState<boolean>(false);

    const rfScore = useRef<number>(0);
    const rfLines = useRef<number>(0);
    const rfMultiplier = useRef<number>(1);

    const rfNextBlocks = useRef<Block[]>(Block.getRandomBlocks(4, cxPrefs.prefs.blocks));

    const rfNextBlock = useRef<Block>(new Block());

    const rfHeldBlock = useRef<Block | undefined>(undefined);

    const [ stUpdater, setUpdater ] = useState<object>({});
    
    //const [ grid, setGrid ] = useState({ instance: rfGrid.current });

    const rfGrid = useRef<Grid>(
        new Grid(cxPrefs.prefs.cols, cxPrefs.prefs.rows)
    );

    const rfGridHold = useRef<Grid>(new Grid(4, 4));

    const rfBlock = useRef<Block | undefined>(undefined);

    const rfRecords = useRef<TableData>(
        getTableDataHighScores()
    );

    const rfGameInProgress = useRef<boolean>(false);

    const areMenuButtonsEnabled = useRef<boolean>(true);

    const isBlockThePrevHeldBlock = useRef<boolean>(false);

    const didHeldBlockJustSpawn = useRef<boolean>(false);

    useEffect(
        () =>
        {
            const setRecords = async () =>
            {
                const lKeyGridSize = Grid.getKeyGridSize(cxPrefs.prefs.cols, cxPrefs.prefs.rows);

                const lGameStatsLocal : GameStats = GameStatsManager.getStatsLocal(cxPrefs.prefs.blocks, lKeyGridSize) || GameStatsManager.getDefaultGameStats();

                // Get global stats (if available).
                const lGameStatsGlobal : GameStats = await GameStatsManager.getStatsGlobal(cxPrefs.prefs.blocks, lKeyGridSize) || GameStatsManager.getDefaultGameStats();

                rfRecords.current = getTableDataHighScores(lGameStatsGlobal, lGameStatsLocal);

                reRender();
            };

            setRecords();

            // Get some random block colours for the buttons.
            const lRandomColours : string[] = Block.getRandomColours(4);

            // An object to store the buttons' colours.
            const lColoursButtons : { [key: string]: string } = { 
                left: "", right: "", leftMax: "", rightMax: "", down: "", downMax: "", clockwise: "", anticlockwise: "", 
                rotate180: "", hold: "" 
            };

            // Set colour of the horizontal movement buttons.
            gridSymbols.left.setColour(lRandomColours[0]); gridSymbols.right.setColour(lRandomColours[0]); 
            gridSymbols.rightMax.setColour(lRandomColours[0]); gridSymbols.leftMax.setColour(lRandomColours[0]);

            // Set colour of the vertical movement buttons.
            gridSymbols.down.setColour(lRandomColours[1]); gridSymbols.downMax.setColour(lRandomColours[1]); 

            // Set colour of the rotation  buttons.
            gridSymbols.clockwise.setColour(lRandomColours[2]); gridSymbols.anticlockwise.setColour(lRandomColours[2]);
            gridSymbols.rotate180.setColour(lRandomColours[2]);

            // Set colour of the 'hold' button.
            gridSymbols.hold.setColour(lRandomColours[3]);

            // Update buttons' colours.
            reRender();

            document.addEventListener("keydown", handleKeyDown);

            document.addEventListener("keyup", handleKeyUp)

            return () =>
            {
                document.removeEventListener("keydown", handleKeyDown);
                document.removeEventListener("keyup", handleKeyUp);
            }
        },
        []
    );

    const handlePlay = useCallback(
        async () =>
        {
            if (!areMenuButtonsEnabled.current)
                return;

            // Set the game flag.
            rfGameInProgress.current = true;

            // Reset the game's state.
            resetGame();

            // The current period that defines the block's fall rate.
            let lFallPeriodCurrent = gFallPeriodMax;

            // The number of 'period cycles' that have elapsed.
            let lNumPeriodCyclesElapsed = 0;

            /*
            * The value which determines what lFallPeriodCurrent will be when a new level is reached.
            * The higher this value, the lower lFallPeriodCurrent is; when lPeriodCoefficient is at its highest value, 
            lFallPeriodCurrent is at its lowest.
            */
            let lPeriodCoefficient = 0;

            // Spawn the first block.
            spawnNextBlock();

            while (true)
            {
                // Simulate gravity (wait before dropping).
                await utils.sleepFor(gSoftDrop ? gFallPeriodSoftDrop : lFallPeriodCurrent);

                // If the held block was just spawned in, wait again (i.e. 'reset' gravity).
                if (didHeldBlockJustSpawn.current)
                {
                    didHeldBlockJustSpawn.current = false;

                    await utils.sleepFor(gSoftDrop ? gFallPeriodSoftDrop : lFallPeriodCurrent);
                }

                // Try to move the piece down the screen; if it can move down, continue.
                if (moveBlock(Vector2D.sUp))//, true))
                { continue; }

                // Disable user's ability to move the block.
                rfBlock.current = undefined;

                // Reset the gSoftDrop flag.
                gSoftDrop = false;

                const lNumFullLines = (rfGrid.current).getNumFullLines();

                // If the user cleared at least one line.
                if (lNumFullLines != 0)
                {
                    // The current level.
                    let lLevel = Math.floor(rfLines.current / gLengthLevel) + 1;

                    // Calculate the score from the line clears (don't multiply by level, as the multiplier takes care of this).
                    let lScoreFromLineClears = gScoresLineClears[lNumFullLines - 1]; // lLevel

                    // If the user cleared multiple lines, increase the multiplier.
                    if (lNumFullLines > 1)
                    {
                        // Whether it's a 'perfect' clear, meaning that the grid is empty after the lines are cleared.
                        const lIsPerfectClear = rfGrid.current.isEmptyAfterClear();

                        console.log(`Increment multiplier by ${lIsPerfectClear ? lNumFullLines : 1}`);

                        console.log(`Multiplier before: ${rfMultiplier.current}`);

                        // If it's a perfect clear, increment by the number of lines cleared; otherwise, increment by 1.
                        rfMultiplier.current += lIsPerfectClear ? lNumFullLines : 1;

                        console.log(`Multiplier after: ${rfMultiplier.current}`);
                    }
                    else
                    {
                        // The minimum multiplier is the current level times 0.5. i.e. the user's multiplier increases
                        // by 0.5 for every level they reach.
                        const lMinMultiplier = Math.max(1, lLevel * 0.5);

                        // Decrease multiplier by 1/3
                        rfMultiplier.current = Math.max(lMinMultiplier, Math.floor((2 / 3) * rfMultiplier.current));
                    }

                    rfLines.current += lNumFullLines;

                    // A flag that, when true, indicates that a new level has been reached.
                    const lIsNewLevel = rfLines.current - gLengthLevel * lLevel >= 0;

                    if (lIsNewLevel)
                        rfMultiplier.current += 0.5;

                    // Multiply the base score.
                    lScoreFromLineClears *= rfMultiplier.current;

                    console.log(`Score from ${lNumFullLines} lines: ${lScoreFromLineClears}`);

                    rfGrid.current.text = `+${lScoreFromLineClears}`;

                    // Remove full lines.
                    await removeFullLines();

                    rfGrid.current.text = "";

                    rfScore.current += lScoreFromLineClears;

                    // Increment the score and lines.
                    // addScoreAndLines(lScoreFromLineClears, lNumFullLines);

                    if (lIsNewLevel)
                    {
                        // A flag that, when true, indicates that there are no more period cycles.
                        const lNoMorePeriodCycles = lNumPeriodCyclesElapsed + 1 === gNumPeriodCycles;

                        if (!lNoMorePeriodCycles) // If there are further period cycles.
                        {
                            // Update lNumPeriodCyclesElapsed and lPeriodCoefficient.
                            if (lFallPeriodCurrent === gFallPeriodMin)
                            {
                                ++lNumPeriodCyclesElapsed;
                                
                                lPeriodCoefficient = lNumPeriodCyclesElapsed;
                            }
                            else
                            {
                                ++lPeriodCoefficient;
                            }

                            // Calculate the period for the current level.
                            lFallPeriodCurrent = gFallPeriodMax - gFallPeriodInterval * lPeriodCoefficient;
                        }

                        const lLevelNew = lLevel + 1;

                        // For testing the fall period.
                        console.log("Lines: " + rfLines.current);
                        console.log("Level " + lLevelNew + ": fall period is " + lFallPeriodCurrent);
                    }
                    
                }

                // Create and spawn the next block.
                const lValidSpawn = spawnNextBlock();

                // If the block cannot be spawned, end the game and notify the Player that the game is over.
                if (!lValidSpawn)
                {
                    break;
                }
            }

            console.log("Game over");

            rfGameInProgress.current = false;

            // Disable user's ability to move the block.
            rfBlock.current = undefined;

            // Disable the menu buttons temporarily so that the user doesn't accidentally click it.
            disableMenuButtonsTemporarily();

            reRender();

            await lUpdateStats();

            console.log("Game over 2");
        },
        []
    );

    const handleExit = useCallback(
        () =>
        {
            if (!areMenuButtonsEnabled.current)
                return;

            navigate("/");
        },
        []
    );

    /*
    * Clears all rows that are full and also shifts all other (non-full) rows downwards.
     
     * Return Value:
         > The number of full rows that were cleared. 
    */
    const removeFullLines = useCallback(
        async () => //throws InterruptedException
        {
            // The dimensions of the grid.
            const lGridDimensions = rfGrid.current.dimension;

            // The time taken to clear 1 line.
            const lPausePerLine = 400;

            // The time to pause between individual tiles being shifted down (ms).
            const lPausePerTile = lPausePerLine / lGridDimensions.columns;

            // The number of full rows found thus far.
            let lNumFullRows = 0;

            let lIndexSound = 0;

            for (let row = lGridDimensions.rows - 1; row >= 0; --row)
            {   
                let lIsRowFull = true;
                let lIsRowEmpty = true;
                
                for (let col = 0; col < lGridDimensions.columns; ++col)
                {
                    if (!lIsRowFull && !lIsRowEmpty) // If both booleans have been falsified.
                    {
                        break;
                    }
                    else if (rfGrid.current.isTileEmpty(col, row))
                    {
                        // If at least one tile is empty, the row can't be full.
                        lIsRowFull = false;
                    }
                    else // if (!this.IsTileEmpty(col, row))
                    {
                        // If at least one tile is filled, the row can't be empty.
                        lIsRowEmpty = false;
                    }
                }
                
                if (lIsRowFull) 
                { 
                    // Record occurrence of full row.
                    ++lNumFullRows;
                    
                    // Clear the row.
                    for (let col = 0; col < lGridDimensions.columns; ++col)
                    {
                        if (rfGrid.current.isTileEmpty(col, row))
                        { continue; }

                        // Clear the colour of the tile at coordinate (col,row).
                        rfGrid.current.emptyTile(col, row);
                        lDrawNextBlockOutline();

                        reRender();

                        playSound(gSounds.removeBlock[lIndexSound]);
                        lIndexSound = (lIndexSound + 1) % gSounds.removeBlock.length;

                        await utils.sleepFor(lPausePerTile);
                    }
                }
                // else if (lIsRowEmpty) // If the row is empty, this means that all rows above it are also empty.
                // {
                //     break;
                // }
                else if (lNumFullRows !== 0) // && !lIsRowFull && !lIsRowEmpty (if the row isn't full and isn't empty: i.e. semi-filled).
                {
                    // Shift the (non-full, non-empty) row down lNumFullRows rows.
                    for (let col = 0; col < lGridDimensions.columns; ++col)
                    {
                        if (rfGrid.current.isTileEmpty(col, row))
                        { continue; }

                        // Copy the colour of the tile at coordinate (col,row) to the appropriate row (row + lNumFullRows).
                        rfGrid.current.setCellColour(col, row + lNumFullRows, rfGrid.current.getCell(col, row).backgroundColour);

                        // Clear the colour of the tile at coordinate (col,row).
                        rfGrid.current.emptyTile(col, row);
                        lDrawNextBlockOutline();

                        reRender();

                        playSound(gSounds.removeBlock[lIndexSound]);
                        lIndexSound = (lIndexSound + 1) % gSounds.removeBlock.length;

                        await utils.sleepFor(lPausePerTile);
                    }
                    
                }
                
            }
            
            // Return the number of full rows that were cleared.
            return lNumFullRows;
        },
        []
    );

    const moveBlock = useCallback(
        (pMovement : Vector2D) =>
        {
            if (!(rfBlock.current instanceof Block))
            { return false; }

            let lDidMove = rfBlock.current.move(pMovement, rfGrid.current, true);

            if (lDidMove)
            {
                if (pMovement == Vector2D.sLeft)
                {
                    playSound(gSounds.left);
                }
                else if (pMovement == Vector2D.sRight)
                {
                    playSound(gSounds.right);
                }
                else if (pMovement == Vector2D.sUp)
                {
                    playSound(gSounds.down);
                }

                lDrawNextBlockOutline();

                reRender();
            }

            return lDidMove;
        },
        []
    );

    const lDrawNextBlockOutline = useCallback(
        () =>
        {
            if (rfNextBlocks.current && rfNextBlocks.current.length > 0)
            {
                rfGrid.current.unDrawBlock(rfNextBlock.current, false);

                rfGrid.current.drawBlockAt(rfNextBlock.current, "TopThreeRows", false);
            }
        },
        []
    );

    const lUndrawNextBlockOutline = useCallback(
        () =>
        {
            rfGrid.current.unDrawBlock(rfNextBlock.current, false);
        },
        []
    );

    const playRotationSound = useCallback(
        (pClockwise : boolean, p180 : boolean = true) =>
        {
            if (p180)
                playSound(gSounds.rotate180);
            else if (pClockwise)
                playSound(gSounds.clockwise);
            else
                playSound(gSounds.anticlockwise);
        },
        []
    );

    /*
    * Tries to rotate the current block in a given direction.

    * Parameters:
        > a_clockwise: a flag that, when true, indicates that the block is to be rotated clockwise.
    */
    const rotateBlock = useCallback(
        (pClockwise : boolean, p180 : boolean = false) =>
        {
            if (!(rfBlock.current instanceof Block))
            { return false; }

            let lDidRotate = p180 ? rfBlock.current.rotate180(rfGrid.current) : rfBlock.current.rotate(pClockwise, rfGrid.current, true);

            if (lDidRotate)
            {
                playRotationSound(pClockwise, p180);

                lDrawNextBlockOutline();

                reRender();
            }

            return lDidRotate;
        },
        []
    );

    /*
    * Rotates one of the 'next' blocks in a given direction.
    */
    const rotateNextBlock = useCallback(
        (pIndexNext : number = -1, pClockwise : boolean = true, p180 : boolean = false) =>
        {
            if (pIndexNext < 0 || pIndexNext >= rfNextBlocks.current.length)
                pIndexNext = rfNextBlocks.current.length - 1;

            rfNextBlocks.current[pIndexNext].changeRotationIndex(pClockwise);

            if (p180)
                rfNextBlocks.current[pIndexNext].changeRotationIndex(pClockwise);

            playRotationSound(pClockwise, p180);

            if (pIndexNext == rfNextBlocks.current.length - 1)
            {
                lUndrawNextBlockOutline();

                rfNextBlock.current = rfNextBlocks.current[pIndexNext].copy();

                lDrawNextBlockOutline();
            }

            reRender();
        },
        []
    );

    const clockwiseNextBlock = useCallback(
        (pIndexNext : number) =>
        {
            rotateNextBlock(pIndexNext, true)
        },
        [ rotateNextBlock ]
    );

    
    const antiClockwiseNextBlock = useCallback(
        (pIndexNext : number) =>
        {
            rotateNextBlock(pIndexNext, false)
        },
        [ rotateNextBlock ]
    );

    /*
    * Tries to rotate the current block 180 degrees.
    */
    const rotateBlock180 = useCallback(
        () =>
        {
            if (!(rfBlock.current instanceof Block))
            { return false; }

            let lDidRotate = rfBlock.current.rotate180(rfGrid.current);

            if (lDidRotate)
            {
                lDrawNextBlockOutline();

                playRotationSound(false, true);
                reRender();
            }

            return lDidRotate;
        },
        []
    );

    const rotateHeldBlock = useCallback(
        (pClockwise : boolean, p180 : boolean = false) =>
        {
            if (!rfHeldBlock.current)
                return;

            console.log("Hello" + pClockwise);

            rfHeldBlock.current.changeRotationIndex(pClockwise);

            if (p180)
                rfHeldBlock.current.changeRotationIndex(pClockwise);

            rfGridHold.current.reset();

            rfGridHold.current.drawBlockAt(rfHeldBlock.current, "CentreMid");

            playRotationSound(pClockwise);

            reRender();
        },
        []
    );

    const clockwiseHeldBlock = useCallback(
        () =>
        {
            rotateHeldBlock(true);
        },
        [ rotateHeldBlock ]
    );

    const antiClockwiseHeldBlock = useCallback(
        () =>
        {
            rotateHeldBlock(false);
        },
        [ rotateHeldBlock ]
    );

    const swapNextBlockWithHeldBlock = useCallback(
        () =>
        {
            if (!rfHeldBlock.current)
                return;

            lUndrawNextBlockOutline();

            const lTemp : Block = rfHeldBlock.current.copy();

            rfHeldBlock.current = rfNextBlock.current.copy();

            rfNextBlocks.current[rfNextBlocks.current.length - 1] = lTemp;

            rfNextBlock.current = rfNextBlocks.current[rfNextBlocks.current.length - 1].copy();

            // Draw the new held block.
            rfGridHold.current.reset();
            rfGridHold.current.drawBlockAt(rfHeldBlock.current, "CentreMid");

            lDrawNextBlockOutline();

            reRender();
        },
        []
    );

    const shiftBlock = useCallback(
        (pDirection : Vector2D) =>
        {
            if (!(rfBlock.current instanceof Block))
            { return; }

            const lLengthShift = rfBlock.current.shift(rfGrid.current, pDirection, false);

            if (lLengthShift != 0)
            {
                const lSound = rfGrid.current.wasMoveBlockedByBoundary ? gSounds.impactBoundary : gSounds.impactBlocks;

                playSound(lSound);

                lDrawNextBlockOutline();

                // if (pDirection == Vector2D.s_left)
                //     new Audio(gSounds.shiftLeft).play();
                // else if (pDirection == Vector2D.s_right)
                //     new Audio(gSounds.shiftRight).play();
                // else if (pDirection == Vector2D.s_up && lLengthShift > 1)
                //     new Audio(gSounds.shiftDown).play();
            }
            reRender();
        },
        []
    );

    const spawnNextBlock = useCallback(
        () =>
        {
            // If rfBlock has already been set (e.g. from the player 'holding' a block), do not spawn a new block in.
            // i.e. a block should only be spawned if it's undefined.
            if (rfBlock.current)
            { return; }

            rfBlock.current = rfNextBlocks.current[rfNextBlocks.current.length - 1].copy();
            isBlockThePrevHeldBlock.current = false;

            // Undraw the outline of the next block (as it's now the current block).
            lUndrawNextBlockOutline();

            let lCanSpawn = rfGrid.current.drawBlockAt(rfBlock.current, "TopThreeRows");

            rfNextBlocks.current = [ 
                Block.getRandomBlock(cxPrefs.prefs.blocks),
                ...(rfNextBlocks.current.slice(0, rfNextBlocks.current.length - 1))
            ];

            rfNextBlock.current = rfNextBlocks.current[rfNextBlocks.current.length - 1].copy();

            // Try to draw the outline of the next block.
            lDrawNextBlockOutline();

            if (lCanSpawn)
            {
                incrementTally(rfBlock.current.type);
            }

            reRender();

            return lCanSpawn;
        },
        []
    );

    const holdBlock = useCallback(
        () =>
        {
            if (!(rfBlock.current instanceof Block))
            { return; }

            // If the current block was the block held previously, return.
            if (isBlockThePrevHeldBlock.current)
            { return; }

            // Remove the current block.
            rfGrid.current.unDrawBlock(rfBlock.current);

            let lCanSpawn : boolean = true;

            if (!rfHeldBlock.current)
            {
                // The next block to spawn (given that there's no held block, use this instead).
                const lNextBlock = rfNextBlocks.current[rfNextBlocks.current.length - 1];

                // See if the next block can be spawned.
                lCanSpawn = rfGrid.current.drawBlockAt(lNextBlock, "TopThreeRows", true, false);

                if (lCanSpawn)
                {
                    rfGrid.current.unDrawBlock(lNextBlock);

                    // rfHeldBlock.current = rfBlock.current.copy();
                    setHeldBlock(rfBlock.current.copy());

                    rfBlock.current = undefined;

                    spawnNextBlock();
                }
            }
            else
            {
                lCanSpawn = rfGrid.current.drawBlockAt(rfHeldBlock.current, "TopThreeRows");

                if (lCanSpawn)
                {
                    lDrawNextBlockOutline();

                    const lBlockCurrent = rfBlock.current.copy();

                    rfBlock.current = rfHeldBlock.current;
                    isBlockThePrevHeldBlock.current = true;

                    // rfHeldBlock.current = lBlockCurrent;
                    setHeldBlock(lBlockCurrent);
                }
            }

            if (lCanSpawn)
            {
                reRender(); 
                playSound(gSounds.holdBlock);
                didHeldBlockJustSpawn.current = true;
            }
            else if (rfBlock.current)
            {
                // Redraw the current block.
                const lRedrawSuccessful = rfGrid.current.drawBlock(rfBlock.current);
                console.log("Can't spawn the held block.");

                if (lRedrawSuccessful)
                {
                    console.log("The current block was successfully redrawn");
                }
            }
        },
        []
    );

    const setHeldBlock = useCallback(
        (pBlock : Block | undefined) =>
        {
            rfHeldBlock.current = pBlock;

            rfGridHold.current.reset();

            if (rfHeldBlock.current)
            {
                rfGridHold.current.drawBlockAt(rfHeldBlock.current, "CentreMid");
            }
        },
        []
    );

    const addScoreAndLines = useCallback(
        (pScore : number, pLines : number) =>
        {
            rfScore.current += pScore
            rfLines.current += pLines;
        },
        []
    );

    const resetGameInfo = useCallback(
        () =>
        {
            rfScore.current = 0
            rfLines.current = 0;
            rfMultiplier.current = 1;
        },
        []
    );

    /*
    * Once a game is over, this function should be called to update the game's stats.
    */
    const lUpdateStats = useCallback(
        async () =>
        {
            setIsLoading(true);

            // The user's stats.
            const lScoreNow = rfScore.current;
            const lLinesNow = rfLines.current;

            const lIsGuest : boolean = !cxUser.user;

            const lUsername : string = cxUser.user ? cxUser.user.username : cxPrefs.prefs.usernameGuest;

            // Update the 'meta' stats.
            MetaStatsManager.updateMetaStatsLocal(lScoreNow, lLinesNow);

            const lKeyGridSize : string = Grid.getKeyGridSize(cxPrefs.prefs.cols, cxPrefs.prefs.rows);

            // The grid-size key.
            const lGameStatsLocal : GameStats = GameStatsManager.updateStatsLocal(cxPrefs.prefs.blocks, lKeyGridSize, lScoreNow, lLinesNow, lUsername);

            let lGameStatsGlobal : GameStats | undefined = undefined;

            if (cxUser.user)
            {
                lGameStatsGlobal = await GameStatsManager.updateStatsGlobal(cxPrefs.prefs.blocks, lKeyGridSize, lScoreNow, lLinesNow, lUsername);
            }
            else
            {
                lGameStatsGlobal = await GameStatsManager.getStatsGlobal(cxPrefs.prefs.blocks, lKeyGridSize);
            }

            rfRecords.current = getTableDataHighScores(lGameStatsGlobal, lGameStatsLocal);

            reRender();

            setIsLoading(false);
        },
        []
    );

    const resetTallies = useCallback(
        () => 
        {
            setBlockTallies(createBlockTallies());
        },
        []
    );

    const incrementTally = useCallback(
        (pBlockType : BlockType) =>
        {
            setBlockTallies(
                (prev) =>
                {
                    const lTalliesNew : Map<BlockType, number> = createBlockTallies();

                    for (let [ key, value ] of prev)
                    {
                        lTalliesNew.set(key, key == pBlockType ? value + 1 : value);
                    }

                    return lTalliesNew;
                }
            );
        },
        []
    );

    const resetNextBlocks = useCallback(
        () =>
        {
            rfNextBlocks.current = Block.getRandomBlocks(4, cxPrefs.prefs.blocks);

            rfNextBlock.current = rfNextBlocks.current[rfNextBlocks.current.length - 1].copy();
        },
        []
    );

    const resetGame = useCallback(
        () =>
        {
            rfGrid.current.reset();
            resetGameInfo();
            resetTallies();
            resetNextBlocks();
            setHeldBlock(undefined);
            reRender();
        },
        []
    );

    /*
    * This is designed to be called at the end of a game to disable the menu buttons (i.e. the 'PLAY' and 'EXIT') buttons
    */
    const disableMenuButtonsTemporarily = () =>
    {
        areMenuButtonsEnabled.current = false;

        const enableMenuButtons = () => { areMenuButtonsEnabled.current = true };

        setTimeout(enableMenuButtons, 1000);
    };

    const reRender = () =>
    {
        setUpdater({});
    }

    const playSound = useCallback(
        async (pSound : string) =>
        {
            // Disable sound on iOS/MAC due to performance issues.
            if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent))
                return;

            if (!cxPrefs.prefs.soundOn)
                return;

            const lSoundStr = sounds[utils.getRandomInt(0, sounds.length - 1)];

            let lSoundObj = new Audio(lSoundStr);

            lSoundObj.volume = 0.03;

            await lSoundObj.play();
        },
        [ cxPrefs ]
    );

    const rfKeysDown = useRef<Set<string>>(new Set<string>());

    const handleKeyUp = useCallback(
        (pEvent : KeyboardEvent) =>
        {
            if (pEvent.repeat)
                return;

            pEvent.stopPropagation();

            // The key that was released.
            const lKey : string = pEvent.code;

            rfKeysDown.current.delete(lKey);
            // console.log("Up:")
            // console.log(rfKeysDown.current);
        },
        []
    );

    const handleKeyDown = useCallback(
        (pEvent : KeyboardEvent) =>
        {
            if (pEvent.repeat)
                return;

            pEvent.stopPropagation();
            
            if (!rfBlock.current) // || !rfGameInProgress.current
            { return; }

            // The key that was pressed down.
            // code values: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
            const lKey : string = pEvent.code;

            rfKeysDown.current.add(lKey);
            // console.log("Down:")
            // console.log(rfKeysDown.current);

            // Whether the shift key is down.
            const lIsShiftDown = pEvent.shiftKey;

            // Translational Movement.
            if (lKey === "ArrowDown")
            {
                gSoftDrop = !gSoftDrop;
            }
            else if (lKey === "ArrowUp")
            {
                shiftBlock(Vector2D.sUp);
            }
            else if (lKey === "ArrowLeft")
            {
                if (lIsShiftDown)
                    shiftBlock(Vector2D.sLeft);
                else
                    moveBlock(Vector2D.sLeft);
            }
            else if (lKey === "ArrowRight")
            {
                if (lIsShiftDown)
                    shiftBlock(Vector2D.sRight);
                else
                    moveBlock(Vector2D.sRight);
            }

            // Rotational Movement.
            if (lKey == "KeyD" || lKey == "KeyA" || lKey == "KeyS")
            {
                const lClockWise : boolean = lKey == "KeyD";

                const l180 : boolean = lKey == "KeyS";

                let lRotatedNextBlock : boolean = false;

                // Rotate one of the 'next' blocks.
                for (let i = 0; i < rfNextBlocks.current.length; ++i)
                {
                    if (rfKeysDown.current.has(`Numpad${rfNextBlocks.current.length - i}`))
                    {
                        rotateNextBlock(i, lClockWise, l180);
                        lRotatedNextBlock = true;
                        break;
                    }
                }

                // Rotate either the held block or the current block.
                if (!lRotatedNextBlock)
                {
                    if (rfKeysDown.current.has("Numpad0"))
                        rotateHeldBlock(lClockWise, l180);
                    else
                        rotateBlock(lClockWise, l180);
                }
            }

            // Block holding.
            if (lKey == "Space")
            {
                holdBlock();
            }

            // Replace held block with the next block.
            if (lKey == "KeyW")
            {
                swapNextBlockWithHeldBlock();
            }
        },
        []
    );

    const lGameButtons = useMemo<GameButtons>(
        () =>
        {
            // Get some random block colours for the buttons.
            const lRandomColours : string[] = Block.getRandomColours(4);

            return {
                left: { onPress: () => moveBlock(Vector2D.sLeft), symbol: new GridSymbol('left', lRandomColours[0]) },
                right: { onPress: () => moveBlock(Vector2D.sRight), symbol: new GridSymbol('right', lRandomColours[0]) },
                leftMax: { onPress: () => shiftBlock(Vector2D.sLeft), symbol: new GridSymbol('leftMax', lRandomColours[0]) },
                rightMax: { onPress: () => shiftBlock(Vector2D.sRight), symbol: new GridSymbol('rightMax', lRandomColours[0]) },

                down: { onPress: () => { gSoftDrop = !gSoftDrop; }, symbol: new GridSymbol('down', lRandomColours[1]) },
                downMax: { onPress: () => shiftBlock(Vector2D.sUp), symbol: new GridSymbol('downMax', lRandomColours[1]) },

                clockwise: { onPress: () => rotateBlock(true), symbol: new GridSymbol('clockwise', lRandomColours[2]) },
                anticlockwise: { onPress: () => rotateBlock(false), symbol: new GridSymbol('anticlockwise', lRandomColours[2]) },
                rotate180: { onPress: () => rotateBlock(true, true), symbol: new GridSymbol('rotate180', lRandomColours[2]) },

                hold: { onPress: holdBlock, symbol: new GridSymbol('hold', lRandomColours[3]) },
            };

            // return {
            //     play: handlePlay,
            //     exit: handleExit,
            //     left: () => moveBlock(Vector2D.sLeft),
            //     right: () => moveBlock(Vector2D.sRight),
            //     clockwise: () => rotateBlock(true),
            //     anticlockwise: () => rotateBlock(false),
            //     down: () => { gSoftDrop = !gSoftDrop; },
            //     downMax: () => shiftBlock(Vector2D.sUp),
            //     leftMax: () => shiftBlock(Vector2D.sLeft),
            //     rightMax: () => shiftBlock(Vector2D.sRight),
            //     rotate180: rotateBlock180,
            //     hold: holdBlock,
            //     clockwiseNext: (pIndexNext : number) => rotateNextBlock(pIndexNext, true),
            //     anticlockwiseNext: (pIndexNext : number) => rotateNextBlock(pIndexNext, false),
            //     clockwiseHeld: () => rotateHeldBlock(true),
            //     anticlockwiseHeld: () => rotateHeldBlock(true),
            // };
        },
        [ moveBlock, rotateBlock, shiftBlock, rotateBlock180, holdBlock ]
    );

    // const lGridHold = new Grid(4, 4);
    // if (rfHeldBlock.current)
    // {
    //     lGridHold.drawBlockAt(rfHeldBlock.current, "CentreMid", false);
    // }

    // if (cxWindowSize.isLandscape)
    // {
    //     return (
    //         <GameLandscape 
    //             prGrid = { rfGrid.current }
    //             prBlockTallies = { blockTallies }
    //             prNextBlocks = { rfNextBlocks.current }
    //             prGridHold = { lGridHold }
    //             prGameInProgress = { rfGameInProgress.current }
    //             prActiveBlocks = { cxPrefs.prefs.blocks }
    //             prStats = { stats.current }
    //             prHandlers = { lHandlers }
    //             prButtonSymbols = { gridSymbols }
    //             pUpdater = { updater }
    //         />
    //     );
    // }
    // else
    // {
        return (
            <GamePortrait 
                prGrid = { rfGrid.current }
                prBlockTallies = { stBlockTallies }
                prNextBlocks = { rfNextBlocks.current }
                prGridHold = { rfGridHold.current }
                prGameInProgress = { rfGameInProgress.current }
                prActiveBlocks = { cxPrefs.prefs.blocks }
                prStats = { rfRecords.current }
                prScore = { rfScore.current }
                prMultiplier = { rfMultiplier.current }
                prLinesCleared = { rfLines.current }
                prGameButtons = { lGameButtons }
                prOnPressPlay = { handlePlay }
                prOnPressExit = { handleExit }
                prClockwiseNext = { clockwiseNextBlock }
                prAntiClockwiseNext = { antiClockwiseNextBlock }
                prClockwiseHeld = { clockwiseHeldBlock }
                prAntiClockwiseHeld = { antiClockwiseHeldBlock }
                prSwapNextBlockWithHeldBlock = { swapNextBlockWithHeldBlock }
                prUpdater = { stUpdater }
                prIsLoading = { stIsLoading }
            />
        );
    // }
}

/*
* The slowest/highest period at which the block falls (ms).
*/
const gFallPeriodMax = 1000;

/*
* The fastest/lowest period at which the block falls (ms).
*/
const gFallPeriodMin = 250;

/*
* The interval between consecutive block fall period (ms): e.g. the fall rate at level 4 will be 
  s_fall_rate_interval ms lower than at level 3.
* The difference between the max and min fall periods must be divisible by this value: i.e. 
  (s_fall_period_initial - s_fall_period_min) % s_fall_period_interval == 0 must be true.
*/
const gFallPeriodInterval = 125;

/*
* The period at which the block falls when the 'soft-drop' mode is active.
*/
const gFallPeriodSoftDrop = 200;

/*
* The number of period cycles that may elapse.
*/
const gNumPeriodCycles = ((gFallPeriodMax - gFallPeriodMin) / gFallPeriodInterval) + 1;

/*
* The number of lines the Player must clear to go up a level.
* Given that a player can clear at most 4 lines in a single block placement, this should be 4 or higher, as 
  otherwise a player will be able to go up multiple levels in a single move, which may not be desirable.
*/
const gLengthLevel = 4;

/*
* This array is used to increase a player's score when they clear n lines, where n ranges from 1 to 4.
* At level x, after clearing n lines, the player's score increases by gScoresLineClears[n - 1] * x; if the player 
  executed a 'perfect clear' whereby the grid is completely empty, this value is doubled.
*/
const gScoresLineClears = [ 50, 200, 500, 1500 ] //[ 40, 100, 300, 1200 ];

// A flag that, when true, indicates that the block should be 'soft dropped'.
let gSoftDrop = false;

// const gSounds = 
// {
//     left: "./src/assets/sounds/arcade_beep.wav",
//     right: "./src/assets/sounds/arcade_beep.wav",
//     down: "./src/assets/sounds/arcade_beep.wav",
//     clockwise: "./src/assets/sounds/drill_1.mp3",
//     anticlockwise: "./src/assets/sounds/drill_2.mp3",
//     rotate180: "./src/assets/sounds/drill_3.mp3",
//     impactBoundary: "./src/assets/sounds/metal_impact.wav",
//     impactBlocks: "./src/assets/sounds/slap_1.mp3",
//     removeBlock: [
//         "./src/assets/sounds/typewriter_1.mp3",
//         "./src/assets/sounds/typewriter_2.mp3",
//         "./src/assets/sounds/typewriter_3.mp3",
//         "./src/assets/sounds/typewriter_4.mp3",
//         "./src/assets/sounds/typewriter_5.mp3"
//     ],
//     holdBlock: "./src/assets/sounds/beep_whoosh.wav",
// };

const gSoundsArray = 
[
    "./src/assets/sounds/typewriter_1.mp3",
    "./src/assets/sounds/typewriter_2.mp3",
    "./src/assets/sounds/typewriter_3.mp3",
    "./src/assets/sounds/typewriter_4.mp3",
    "./src/assets/sounds/typewriter_5.mp3",
];

const gSounds = 
{
    left: "./src/assets/sounds/typewriter_1.mp3",
    right: "./src/assets/sounds/typewriter_2.mp3",
    down: "./src/assets/sounds/typewriter_5.mp3",
    clockwise: "./src/assets/sounds/typewriter_3.mp3",
    anticlockwise: "./src/assets/sounds/typewriter_4.mp3",
    rotate180: "./src/assets/sounds/typewriter_5.mp3",
    impactBoundary: "./src/assets/sounds/typewriter_1.mp3",
    impactBlocks: "./src/assets/sounds/typewriter_3.mp3",
    removeBlock: [
        "./src/assets/sounds/typewriter_1.mp3",
        "./src/assets/sounds/typewriter_2.mp3",
        "./src/assets/sounds/typewriter_3.mp3",
        "./src/assets/sounds/typewriter_4.mp3",
        "./src/assets/sounds/typewriter_5.mp3"
    ],
    holdBlock: "./src/assets/sounds/typewriter_5.mp3",
};

export default Game;