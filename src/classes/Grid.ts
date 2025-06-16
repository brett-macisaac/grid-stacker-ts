import Vector2D from "./Vector2D";
import Block from "./Block";
import GridCell from "./GridCell";

type GridDrawPos = "CentreMid" | "CentreLeft" | "CentreTop" | "CentreBottom" | "TopThreeRows";

interface GridDimension { columns: number; rows: number }

/**
* An object of this class is a grid upon which blocks can be displayed.
*/
class Grid
{

// Fields (11) =========================================================================================================

    /**
    * An array of colours which defines the grid.
    */
    #fGrid : GridCell[]//(string | undefined)[];

    /**
    * The dimensions of fGrid.
    */
    #fNumRows : number;
    #fNumColumns : number;

    /**
    * The falling block's 'shadow'.
    */
    #fBlockShadow : Block;

    /**
    * The text to display on the grid.
    */
    #fText : string;

    /**
    * When a user tries to move a block on the grid, the movement might be prevented by one of two things:
        (1). A grid boundary, or
        (2). Another already-placed block.
      When this is true, the blocks movement was blocked by the grid boundary; if otherwise, false.
    * Distinguishing between these two movement impediments might be useful when designing the game's sound effects.
    */
    #fWasMoveBlockedByBoundary;


// Static Fields (7) ---------------------------------------------------------------------------------------------------

    /*
    * An object to represent general position 'types' of the grid. 
    */
    // static DrawPosition = Object.freeze(
    //     { 
    //         CentreMid: "CentreMid", 
    //         CentreLeft: "CentreLeft", 
    //         CentreTop: "CentreTop", 
    //         CentreBottom: "CentreBottom",
    //         TopThreeRows: "TopThreeRows" // Spawn in the 'earliest' available position within the top two rows.
    //     }
    // );

    /*
    * The colour of an empty tile.
    */
    //static sColourEmptyTile = "#000000";

    // The default number of columns (i.e. the number of tiles in each row).
    static S_NUM_COLUMNS_DEFAULT = 10;

    // The default number of rows (i.e. the number of tiles in each column).
    static S_NUM_ROWS_DEFAULT = 22;

    // The maximum number of rows (max value of this.#fNumRows).
    static S_MAX_NUM_ROWS = 50;

    // The minimum number of rows (min value of this.#fNumRows).
    static S_MIN_NUM_ROWS = 4;

    // The maximum number of columns (max value of this.#fNumColumns).
    static S_MAX_NUM_COLUMNS = 25;

    // The minimum number of columns (min value of this.#fNumColumns).
    static S_MIN_NUM_COLUMNS = 4;


// Constructors (1) ====================================================================================================

    /**
    * The constructor.
    * 
    * Parameters:
        * @param pNumColumns 
        * @param pNumRows 
        * @param pText 
    */
    constructor(pNumColumns : number, pNumRows : number, pText : string = "")
    {
        // Store references of all the tiles.
        this.#fGrid = [];//Array(pNumColumns * pNumRows).fill(undefined);

        const lNumCells : number = pNumColumns * pNumRows;

        for (let i = 0; i < lNumCells; ++i)
        {
            this.#fGrid.push(new GridCell());
        }

        this.#fNumRows = pNumRows;
        this.#fNumColumns = pNumColumns;

        this.#fText = pText;

        this.#fWasMoveBlockedByBoundary = false;

        this.#fBlockShadow = new Block();
    }


// Public Methods (9) ==================================================================================================

    /** Copy method. */
    copy()
    {
        const lCopy = new Grid(this.#fNumColumns, this.#fNumRows, this.#fText);

        let lIndex = 0;

        for (const cell of this.#fGrid)
        {
            lCopy.grid[lIndex++] = cell.copy(); // colour;
        }

        return lCopy;
    }

    get dimension() : GridDimension
    {
        return { columns: this.#fNumColumns, rows: this.#fNumRows };
    }

    set text(pText : string)
    {
        this.#fText = pText;
    }

    get text()
    {
        return this.#fText;
    }

    set grid(pGrid : GridCell[])
    {
        this.#fGrid = pGrid;
    }

    get grid()
    {
        return this.#fGrid;
    }

    get wasMoveBlockedByBoundary()
    {
        return this.#fWasMoveBlockedByBoundary;
    }

    getIndex(pCol : number, pRow : number) : number
    {
        return pRow * this.#fNumColumns + pCol;
    }

    getCell(pCol : number, pRow : number) : GridCell
    {
        return this.#fGrid[this.getIndex(pCol, pRow)];
    }

    setCellColour(pCol : number, pRow : number, pColour : string | undefined, pIsBackground : boolean = true) : void
    {
        const lCell : GridCell = this.getCell(pCol, pRow);

        if (pIsBackground)
        {
            lCell.backgroundColour = pColour;
        }
        else
        {
            lCell.borderColour = pColour; //`${pColour}`;
        }
    }

    emptyTile(pCol : number, pRow : number) : void
    {
        this.setCellColour(pCol, pRow, undefined, true);
        this.setCellColour(pCol, pRow, undefined, false);
    }

    isTileEmpty(pCol : number, pRow : number) : boolean
    {
        return this.getCell(pCol, pRow).backgroundColour == undefined;
    }

    /*
     * This method returns true if the given position/coordinate is empty; false if otherwise.
     
     * Parameters:
         > aPosition: the position being checked.
    */
    isPositionEmpty(pPosition : Vector2D) : boolean
    {
        return this.isTileEmpty(pPosition.x, pPosition.y);
    }

    /*
    * Sets all of the tiles to undefined (i.e. empty the grids' tiles).
    */
    reset() : void
    {
        for (const cell of this.#fGrid)
        {
            cell.clear();
        }
        // this.#fGrid.fill(undefined);
    }
    
    /*
     * Returns true if the grid is completely empty; false if otherwise.
    */
    isEmpty() : boolean
    {
        const lIndexBottomRow = this.#fNumRows - 1;
        
        // If the bottom row is empty, all other rows must also be empty.
        for (let col = 0; col < this.#fNumColumns; ++col)
        {
            if (!this.isTileEmpty(col, lIndexBottomRow)) // If the tile isn't empty.
            { return false; }
        }
        
        return true;
    }

    getNumFullLines() : number
    {
        // The number of full rows found thus far.
        let lNumFullRows = 0;

        for (let row = this.#fNumRows - 1; row >= 0; --row)
        {   
            let lIsRowFull = true;
            let lIsRowEmpty = true;
            
            for (let col = 0; col < this.#fNumColumns; ++col)
            {
                if (!lIsRowFull && !lIsRowEmpty) // If both booleans have been falsified.
                {
                    break;
                }
                else if (this.isTileEmpty(col, row))
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
            }
            // else if (lIsRowEmpty) // If the row is empty, this means that all rows above it are also empty.
            // {
            //     break;
            // }
        }
        
        // Return the number of full rows.
        return lNumFullRows;
    }

    /*
    * Returns whether the grid would be empty after clearing.
    */
    isEmptyAfterClear() : boolean
    {
        if (this.isEmpty())
            return true;

        for (let row = this.#fNumRows - 1; row >= 0; --row)
        {   
            let lIsRowFull = true;
            let lIsRowEmpty = true;
            
            for (let col = 0; col < this.#fNumColumns; ++col)
            {
                if (!lIsRowFull && !lIsRowEmpty) // If both booleans have been falsified.
                {
                    return false;
                }
                else if (this.isTileEmpty(col, row))
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
        }

        return true;
    }

    /**
    * This method returns true if the given position/coordinate is both valid (within valid bounds) and empty; false if
      otherwise.
    * It's expected that the Block class will use this method in the process of determining whether a block can be 
      moved in a given direction.

    * Parameters:
        * @param pPosition 

    * @returns true if the given position/coordinate is both valid (within valid bounds) and empty; false if otherwise.
    */
    canBeMovedTo(pPosition : Vector2D) : boolean
    {
        const lCanMove = this.isPositionOnBoard(pPosition) && this.isPositionEmpty(pPosition);

        if (!lCanMove)
        {
            if (!this.isPositionOnBoard(pPosition))
                this.#fWasMoveBlockedByBoundary = true;
            else 
                this.#fWasMoveBlockedByBoundary = false;
            
        }
        return lCanMove;
    }

    /**
    * @param pPosition The position being checked.
    * @returns true if the given position/coordinate is valid (within valid bounds); false if otherwise
    */
    isPositionOnBoard(pPosition : Vector2D) : boolean
    {
        return (pPosition.x >= 0 && pPosition.x <= this.#fNumColumns - 1) && 
               (pPosition.y >= 0 && pPosition.y <= this.#fNumRows - 1);
    }

    /**
    * This method draws the given tetromino at the given position 'type'.

    * Parameters:
        * @param pBlock 
        * @param pDrawPosition 
        * @param pDrawShadow 

    * @returns True is returned if the tetromino is successfully drawn; false if otherwise. 
    */
    drawBlockAt(pBlock : Block, pDrawPosition : GridDrawPos, pDrawBackground : boolean = true, pDoNotDrawBlock : boolean = false,
                pDrawShadow : boolean = true) : boolean
    {
        let lSpawnLocation;

        if (pDrawPosition == "CentreTop")
        {
            // The tetrominos' centre points should be in the second row (y coordinate is 1)
            // The tetrominos should be centred in the columns (round to the left).
            lSpawnLocation = new Vector2D(Math.floor((this.#fNumColumns - 1) / 2), 1);
        }
        else if (pDrawPosition === "TopThreeRows")
        {
            lSpawnLocation = new Vector2D(0, 0);

            for (let row = 0; row < 3; ++row)
            {
                lSpawnLocation.y = row;

                for (let col = 0; col < this.#fNumColumns; ++col)
                {
                    lSpawnLocation.x = col;

                    pBlock.position = lSpawnLocation;
    
                    if (!this.drawBlock(pBlock, pDrawBackground, pDoNotDrawBlock, pDrawShadow))
                        continue;

                    return true;
                }
            }

            return false;
        }
        else // if (a_spawn_pos == SpawnPosition.CentreMid) (should have one for each DrawPosition)
        {
            lSpawnLocation = new Vector2D(Math.floor((this.#fNumColumns - 1) / 2), Math.floor(this.#fNumRows / 2));
        }

        pBlock.position = lSpawnLocation;

        if (this.drawBlock(pBlock, pDrawBackground, pDoNotDrawBlock, pDrawShadow))
        {
            return true;
        }
        else //if (pDrawPosition != "TopThreeRows")
        {
            return this.drawBlockAt(pBlock, "TopThreeRows", pDrawBackground, pDoNotDrawBlock, pDrawShadow);
        }
    }
    
    /*
    * This method draws the given tetromino at its current position.
     
    * Parameters:
        > aBlock: the tetromino to be drawn onto the grid.
         
    * Return Value:
        > True is returned if the tetromino is successfully drawn; false if otherwise. 
    */
    drawBlock(pBlock : Block, pDrawBackground : boolean = true, pDoNotDrawBlock : boolean = false, pDrawShadow : boolean = false)
    {
        // Check if the position is invalid.
        let lIsPositionValid : boolean = true;

        for (const v of pBlock.getPosition()) 
        {
            if (!this.canBeMovedTo(v))
            {
                lIsPositionValid = false;
                break;
            }
        }

        // Return if the tetromino's position is invalid.
        if (!lIsPositionValid) 
            return false;

        // Get the tetromino's colour.
        const lColourBlock : string = pBlock.getColour();

        // Draw the shadow.
        // if (aDrawShadow)
        // {
        //     // The shadow tetromino
        //     this.#fBlockShadow = aBlock.copy();

        //     this.#fBlockShadow.colour = Block.sColourShadow;

        //     let lLengthDrop = this.#fBlockShadow.Drop(this, false);

        //     // Draw the shadow if the distance from it to aBlock is greater than 3 rows.
        //     if (lLengthDrop < 4)
        //         this.UnDrawBlock(this.#fBlockShadow, false);
        // }

        // Draw the tetromino.
        if (!pDoNotDrawBlock)
        {
            for (const v of pBlock.getPosition()) 
            {
                this.setCellColour(v.x, v.y, lColourBlock, pDrawBackground);
            }
        }

        return true;
    }
    
    /*
     * This method removes the given tetromino from the grid.
     
     * Parameters:
         > aBlock: the tetromino to be drawn onto the grid.
    */
    unDrawBlock(pBlock : Block, pUndrawBackground : boolean = true, pUndrawShadow : boolean = false)
    {
        // Check if the position is invalid.
        let lIsPositionValid = true;
        for (const v of pBlock.getPosition()) 
        {
            if (!this.isPositionOnBoard(v))
            {
                lIsPositionValid = false;
                break;
            }
        }
        
        // Return if the tetromino's position is invalid.
        if (!lIsPositionValid)
        { 
            console.log("Invalid position!");
            return; 
        }

        // Remove the 'shadow' tetromino.
        // if (aUndrawShadow && this.#fBlockShadow)
        //     this.UnDrawBlock(this.#fBlockShadow, false);

        for (const v of pBlock.getPosition()) 
        {
            this.setCellColour(v.x, v.y, undefined, pUndrawBackground);
            // this.emptyTile(v.x, v.y);
        }
    }

    removeBlockOutlines() : void
    {
        for (const cell of this.#fGrid)
        {
            cell.borderColour = undefined;
        }
    }

// Static Methods (1) ==================================================================================================

    static getKeyGridSize(pCols : number, pRows : number)
    {
        return `${pCols}x${pRows}`;
    }


}

export default Grid;

export type { GridDimension, GridDrawPos };