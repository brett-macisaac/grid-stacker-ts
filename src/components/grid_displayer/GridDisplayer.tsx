import React, { CSSProperties, useMemo, memo, useCallback } from 'react';

import { useTheme } from "../../standard_ui/standard_ui.js";
import Grid, { GridDimension } from '../../classes/Grid';
import GridCellDisplayer from './GridCellDisplayer.js';
import { PressFunctions, getPressFunction } from "../../standard_ui/components/button_std/ButtonStd";
import GridCell from '../../classes/GridCell.js';

interface GridDisplayerSizes
{
    gridWidth: number,
    gridHeight: number,
    cellSize: number,
}

interface PropsGridDisplayer
{
    prGrid: Grid;
    prMaxWidth: number;
    prMaxHeight: number;
    prSizeCell?: number;
    prBorderWidth?: number;
    prGapCells?: number;
    prPadding?: number;
    prOnPress?: (pItem: any | undefined) => any;
    prOnPressLeft?: (pItem: any | undefined) => any;
    prOnPressRight?: (pItem: any | undefined) => any;
    prItemOnPress?: any;
    prColourFilledCell?: string;
    prColourEmptyCell?: string;
    prColourBackground?: string;
    prColourBorder?: string;
    prStyle?: CSSProperties;
    prUpdater?: object;
}

/**
* A component that displays an instance of class Grid. 
*/
const GridDisplayer = memo(

    function GridDisplayer({ prGrid, prMaxWidth, prMaxHeight, prSizeCell, prBorderWidth = 1, prGapCells = 1, prPadding = 1, prOnPress, prOnPressLeft, prOnPressRight, prItemOnPress,
                             prColourFilledCell, prColourEmptyCell, prColourBackground, prColourBorder, prStyle, prUpdater } : PropsGridDisplayer)
    {
        // Acquire global theme.
        const { theme } = useTheme();

        const lTextPadded = useMemo<string>(
            () =>
            {
                const lDimensionGrid : GridDimension = prGrid.dimension;

                let lText = "";

                let lWords = prGrid.text.split(" ");
            
                // Each word of the text must be on its own line. Therefore, the length of each word must be a multiple of the 
                // number of columns
                for (const lWord of lWords)
                {
                    let lLengthWordPadded = 0;

                    if (lWord.length % lDimensionGrid.columns == 0)
                        lLengthWordPadded = lWord.length;
                    else
                        lLengthWordPadded = lDimensionGrid.columns - (lWord.length % lDimensionGrid.columns) + lWord.length;

                    lText += lWord.padEnd(lLengthWordPadded, " ");
                }

                return lText;
            },
            [ prGrid, prUpdater ]
        );

        const lGridDisplayerSizes = useMemo<GridDisplayerSizes>(
            () =>
            {
                const lDimensionGrid : GridDimension = prGrid.dimension;

                // The total amount of space required for the cells' gaps in the horizontal direction.
                const lSumGapWidth = prGapCells * (lDimensionGrid.columns - 1);

                // The total amount of space required for the cells' gaps in the vertical direction.
                const lSumGapHeight = prGapCells * (lDimensionGrid.rows - 1);

                let lPaddingSize : number = 2 * prPadding;

                let lBorderWidth = 2 * prBorderWidth;

                // The (max) height of each square such that one column will be exactly equal to this.#fMaxHeight.
                let lMaxHeightCell = (prMaxHeight - lSumGapHeight - lBorderWidth - lPaddingSize) / lDimensionGrid.rows; // Math.floor(

                // The (max) width of each square such that one column will be exactly equal to this.#fMaxHeight.
                let lMaxWidthCell = (prMaxWidth - lSumGapWidth - lBorderWidth - lPaddingSize) / lDimensionGrid.columns; // Math.floor(

                // The tiles' dimension (lDimensionTile * lDimensionTile) (multiple by 0.99 to ensure the dimensions don't exceed 
                // the maximums, which can be caused by decimal precision error).
                const lMaxSizeCell = Math.min(lMaxHeightCell, lMaxWidthCell); // Math.floor(
                // return Math.floor(Math.min(lMaxHeightTile, lMaxWidthTile));

                let lSizeCell : number = Math.max(prSizeCell && prSizeCell <= lMaxSizeCell ? prSizeCell : lMaxSizeCell, 1);

                const lWidth = lSizeCell * lDimensionGrid.columns + lSumGapWidth + lBorderWidth + lPaddingSize;
                const lHeight = lSizeCell * lDimensionGrid.rows + lSumGapHeight + lBorderWidth + lPaddingSize;

                lSizeCell = Math.max(lSizeCell * 0.995, 1);

                return { gridWidth: lWidth, gridHeight: lHeight, cellSize: lSizeCell }
            },
            [ prGrid, prMaxHeight, prMaxWidth, prGapCells, prBorderWidth, prPadding, prSizeCell ]
        );

        const lStyleCon = useMemo<CSSProperties>(
            () =>
            {
                const lColourBackground = prColourBackground ? prColourBackground : theme.cst.grid.background;

                return { 
                    flexDirection: "row", flexWrap: "wrap", flexShrink: 0, columnGap: prGapCells, rowGap: prGapCells,
                    justifyContent: "center",
                    position: "relative",
                    width: lGridDisplayerSizes.gridWidth, height: lGridDisplayerSizes.gridHeight, 
                    backgroundColor: lColourBackground,
                    border: `${prBorderWidth}px solid ${prColourBorder ? prColourBorder : lColourBackground}`,
                    fontSize: lGridDisplayerSizes.cellSize * 0.8, textAlign: "center",
                    overflow: "hidden",
                    padding: prPadding,
                    ...prStyle
                }
            },
            [ theme, lGridDisplayerSizes, prStyle, prBorderWidth, prColourBorder, prGapCells, prPadding ]
        );

        const lOnPress = useCallback(
            () =>
            {
                if (prOnPress)
                {
                    prOnPress(prItemOnPress);
                }
            },
            [ prOnPress, prItemOnPress ]
        );

        const lOnPressLeft = useCallback(
            () =>
            {
                if (prOnPressLeft)
                {
                    prOnPressLeft(prItemOnPress);
                }
            },
            [ prOnPressLeft, prItemOnPress ]
        );

        
        const lOnPressRight = useCallback(
            () =>
            {
                if (prOnPressRight)
                {
                    prOnPressRight(prItemOnPress);
                }
            },
            [ prOnPressRight, prItemOnPress ]
        );

        const lPressFunctions = useMemo<PressFunctions>(
            () =>
            {
                return getPressFunction(true, lOnPress);
            },
            [ prOnPress, prItemOnPress ]
        );

        const lPressFunctionsLeft = useMemo<PressFunctions>(
            () =>
            {
                return getPressFunction(true, lOnPressLeft);
            },
            [ lOnPressLeft, prItemOnPress ]
        );

        const lPressFunctionsRight = useMemo<PressFunctions>(
            () =>
            {
                return getPressFunction(true, lOnPressRight);
            },
            [ lOnPressRight, prItemOnPress ]
        );

        return (
            <div 
                { ...lPressFunctions }
                style = { lStyleCon } 
                // onTouchStart = { lOnPress } onMouseDown = { lOnPress }
                className = "unselectable"
            >
                { 
                    prOnPressLeft && (
                        <div style = { styles.halfLeft } { ...lPressFunctionsLeft }></div>
                    )
                }
                { 
                    prOnPressRight && (
                        <div style = { styles.halfRight } { ...lPressFunctionsRight }></div>
                    )
                }

                {
                    prGrid.grid.map(
                        (pCell : GridCell, pIndex : number) =>
                        {
                            let lColour : string | undefined = pCell.backgroundColour;

                            if (!lColour) // If the tile is empty.
                            {
                                lColour = prColourEmptyCell ? prColourEmptyCell : theme.cst.gridCell.empty;
                            }
                            else
                            {
                                lColour = prColourFilledCell ? prColourFilledCell : lColour;
                            }

                            return (
                                <GridCellDisplayer 
                                    key = { pIndex } 
                                    prSize = { lGridDisplayerSizes.cellSize }
                                    prColour = { lColour }
                                    prColourBorder = { pCell.borderColour }
                                    prText = { (lTextPadded && pIndex < lTextPadded.length) ? lTextPadded[pIndex] : undefined }
                                />
                            );
                        }
                    )
                }
            </div>
        );
    }

);

const styles : { [ key: string ]: CSSProperties } =
{
    halfLeft: {
        position: "absolute",
        width: "50%", height: "100%",
        left: 0,
        // backgroundColor: "#FF000033"
    },
    halfRight: {
        position: "absolute",
        width: "50%", height: "100%",
        right: 0,
        // backgroundColor: "#0000FF33"
    }
}


export default GridDisplayer;