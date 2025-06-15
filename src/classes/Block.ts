import Vector2D from "./Vector2D";
import Grid from "./Grid";
import utils from "../standard_ui/utils";

/**
* The different block types.
*/
type BlockType = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

/**
* A class that represents a block.
*/
class Block
{

// Fields (18) =========================================================================================================

    /** The block's type. */
    #fType : BlockType;

    /**
     * The positions of each tile.
     * this.#fPositions[0] is the position of the tile around which the others rotate.
    */
    #fPositions : Vector2D[];

    /**
     * The value that indicates the current rotation state of the block.
     * There are four rotation states, represented by the indexes 0, 1, 2, and 3: i.e. a block can only be rotated 
       by 90 degrees at a time.
    */
    #fIndexRotation : number;

    /**
     * A colour unique to this block (i.e. not necessarily one of the 'stock' ones from Block.Colours).
    */
    #fColour : string = "";

// Static Fields (16) --------------------------------------------------------------------------------------------------
    
    // An object whose values represent each of the different types of block.
    // static Type = Object.freeze(    
    //     { 
    //         I: "I", 
    //         J: "J", 
    //         L: "L", 
    //         O: "O", 
    //         S: "S", 
    //         T: "T", 
    //         Z: "Z" 
    //     }
    // );

    static sTypeArray : BlockType[] = [ "I", "J", "L", "O", "S", "T", "Z" ];

    static sTypeSet : Set<string> = new Set<string>([ "I", "J", "L", "O", "S", "T", "Z" ]);

    // Original/classic colours.
    // static Colours = Object.freeze(    
    //     { 
    //         I: '#00ebeb', // I
    //         J: '#0000ff', // J
    //         L: '#ff8000', // L
    //         O: '#ebeb00', // O
    //         S: '#00eb00', // S
    //         T: '#eb00eb', // T
    //         Z: '#eb0000'  // Z
    //     }
    // );

    // An object whose values represent each of the block colours (darker than originals).
    // Maybe change to minimise chance of lawsuit.
    static sColoursMap : Map<BlockType, string> = new Map([
        [ "I", '#099797' ],
        [ "J", '#4444FA' ],
        [ "L", '#c46506' ],
        [ "O", '#c0c007' ],
        [ "S", '#06b306' ],
        [ "T", '#ad06ad' ],
        [ "Z", '#bb0505' ],
    ]);

    static sColours : string[] = [
        '#099797',
        '#4444FA',
        '#c46506',
        '#c0c007',
        '#06b306',
        '#ad06ad',
        '#bb0505',
    ];

    // Each block is composed of four tiles (size of this.#fPositions).
    static sNumTiles : number = 4;
    
    // The number of rotation indexes (0 to 3) (i.e. the number of values this.#fIndexRotation can take).
    static sNumRotationIndexes : number = 4;

    // The colour of a 'shadow' block.
    static sColourShadow : string = "#222222";
    
    // Offsets for the J, L, S, T, and Z blocks.
    static #sOffsetDataJLSTZ : Vector2D[][] =
    [  
        [ new Vector2D(0,0), new Vector2D(0,0),  new Vector2D(0,0), new Vector2D(0,0) ],  // Offset 1
        [ new Vector2D(0,0), new Vector2D(1,0),  new Vector2D(0,0), new Vector2D(-1,0) ], // Offset 2
        [ new Vector2D(0,0), new Vector2D(1,1), new Vector2D(0,0), new Vector2D(-1,1) ], // Offset 3
        [ new Vector2D(0,0), new Vector2D(0,-2),  new Vector2D(0,0), new Vector2D(0,-2) ], // Offset 4
        [ new Vector2D(0,0), new Vector2D(1,-2),  new Vector2D(0,0), new Vector2D(-1,-2) ], // Offset 5
    ];
    
    // Offsets for the I block.
    static #sOffsetDataI : Vector2D[][] =
    [  
        [ new Vector2D(0,0),  new Vector2D(-1,0), new Vector2D(-1,-1), new Vector2D(0,-1) ], // Offset 1
        [ new Vector2D(-1,0), new Vector2D(0,0),  new Vector2D(1,-1),  new Vector2D(0,-1) ], // Offset 2
        [ new Vector2D(2,0),  new Vector2D(0,0),  new Vector2D(-2,-1), new Vector2D(0,-1), ], // Offset 3
        [ new Vector2D(-1,0), new Vector2D(0,-1),  new Vector2D(1,0),  new Vector2D(0,1) ], // Offset 4
        [ new Vector2D(2,0),  new Vector2D(0,2), new Vector2D(-2,0), new Vector2D(0,-2) ],  // Offset 5

        [ new Vector2D(0,0),  new Vector2D(-1,-1), new Vector2D(0,0), new Vector2D(0,-2) ]  // Offset 6 (new)
    ];
    
    // Offset for the O block.
    static #sOffsetDataO : Vector2D[][] =
    [ 
        //[new Vector2D(0,0), new Vector2D(0,-1), new Vector2D(-1,-1), new Vector2D(-1,0) ] // Offset 1
        [ new Vector2D(0,0), new Vector2D(0,1), new Vector2D(-1,1), new Vector2D(-1,0) ]
    ];
    
    // Clockwise rotation matrix.
    static #sMatrixRotCCW : Vector2D[] =
    [
        new Vector2D( 0, -1), // Column 1
        new Vector2D( 1,  0)  // Column 2
    ];
    
    // Anti-clockwise rotation matrix.
    static #sMatrixRotCW : Vector2D[] =
    [ 
        new Vector2D( 0, 1), // Column 1
        new Vector2D(-1, 0)  // Column 2
    ];


// Constructors (1) ====================================================================================================

    /**
    * The constructor.

    * Parameters:
        * @param pType 
        * @param pPositions 
        * @param pIndexRotation 
    */
    constructor(pType : BlockType = "I", pPositions : Vector2D[] | undefined = undefined, pIndexRotation : number = 0)
    {
        if (pPositions)
            this.#fPositions = pPositions.map(position => position.copy());
        else
            this.#fPositions = Array(Block.sNumTiles).fill(new Vector2D());
    
        this.#fIndexRotation = pIndexRotation;
        
        this.#fType = pType;
    }

    /** Copy Constructor */
    copy() : Block
    {
        return new Block(this.#fType, this.#fPositions, this.#fIndexRotation);
    }


// Methods (9) =========================================================================================================

    rotate180(pGrid : Grid) : boolean
    {
        const lPositionsOriginal = this.#fPositions.map((pPos) => { return pPos.copy(); })

        this.rotate(true, pGrid, true, true);

        // What happens if the second rotation isn't possible? The block will be returned to the position that it was in after
        // the first rotation, which might not be possible.

        const lIs180Possible = this.rotate(true, pGrid, true, false, false, false);

        if (!lIs180Possible)
        {
            this.#fPositions = lPositionsOriginal;
        }

        pGrid.drawBlock(this);

        return lIs180Possible;
    }

    /* Rotation Method
     * This method rotates the block in the given direction.
     * The rotation system is based on the Super Rotation System (SRS). For more information on how this system works, 
       particularly the offsets for each block, see https://tetris.fandom.com/wiki/SRS.
    
     * Parameters:
         > aClockwise: the direction of rotation.
         > aGrid: the grid on which the block is displayed.
         > aTryOffsets: a flag that, when true, indicates that the piece should be offset in the event that it cannot 
           be directly rotated into a valid position.
         
     * Return Value:
         > A boolean indicating whether or not the block was successfully rotated. 
    */
    rotate(pClockwise : boolean, pGrid : Grid, pTryOffsets = true, pForceRotation = false, pUndrawBlock = true, pDrawBlock = true)
    {
        if (pTryOffsets && pUndrawBlock)
        { pGrid.unDrawBlock(this); }

        // The current rotation index (pre-rotation).
        const lIndexRotationOld = this.#fIndexRotation;
        
        // Increment/decrement this.#fIndexRotation according to aClockwise.
        if (pClockwise)
        {
            this.#fIndexRotation = (this.#fIndexRotation + 1) % Block.sNumRotationIndexes;
        }
        else
        {
            this.#fIndexRotation = (this.#fIndexRotation == 0) ? Block.sNumRotationIndexes - 1 : this.#fIndexRotation - 1;
        }

        for (let i = 0; i < this.#fPositions.length; ++i)
        {
            this.RotateTilePosition(0, i, pClockwise);
        }

        if (!pTryOffsets)
        { return false; }

        //console.log("Attempted Coordinates of Block Rotation: " + this.#fPositions);
        // Try to find a valid placement for the block by using the offset data (record result in lIsRotationPossible).
        const lIsRotationPossible = this.OffSet(lIndexRotationOld, this.#fIndexRotation, pGrid);

        // If the block can't be rotated (even after trying all available offsets), rotate back to the original 
        // position (unless the 'force' flag is set).
        if (!lIsRotationPossible && !pForceRotation)
        {
            this.rotate(!pClockwise, pGrid, false);
        }

        if (pDrawBlock && !pForceRotation)
        {
            pGrid.drawBlock(this);
        }

        return lIsRotationPossible;
    }
    
    /* Movement Method
     * This method moves the block by the given movement vector.
     * Note that, assuming that the block can be moved, the position on the grid is updated.
     
     * Parameters:
         > aMovement: the vector that defines the movement.
         > aGrid: the grid on which the block is to be moved.
         > aUpdateGrid: a flag that, when true, indicates that the grid is to be updated: i.e. the block should 
                          actually be moved on the grid, as opposed to just its position array being altered.

     * Return Value:
         > This method returns true if the block was successfully moved; false if otherwise.
    */
    move(pMovement : Vector2D, pGrid : Grid, pUpdateGrid : boolean)
    {
        if (pUpdateGrid)
        { pGrid.unDrawBlock(this); }

        let lCanMove = true;

        for (let i = 0; i < this.#fPositions.length; ++i)
        {
            if (!this.canMoveTilePosition(i, pMovement, pGrid))
            {
                //System.out.println("Invalid movement!");
                lCanMove = false;
                break;
            }
        }

        if (lCanMove)
        {
            for (let i = 0; i < this.#fPositions.length; ++i)
            {
                this.#fPositions[i].plusEquals(pMovement);
            }
        }

        if (pUpdateGrid)
        { pGrid.drawBlock(this, true); }

        return lCanMove;
    }

    Drop(pGrid : Grid, pDrawShadow : boolean = true) : number
    {
        pGrid.unDrawBlock(this, true, pDrawShadow);

        let lLengthDrop = 0;

        // Drop the block.
        while(this.move(Vector2D.sUp, pGrid, false))
            ++lLengthDrop;

        pGrid.drawBlock(this, true, false, pDrawShadow);

        return lLengthDrop;
    }

    /*
    * Moves the block as far as possible in the given direction.
    * Returns the length of the shift: i.e. how many times it moved.

    * Parameters:
        > aGrid: the grid on which to move the block. The block should already be on the grid.
        > aDirection: the direction in which to move. This should be a Vector2D object with a magnitude of 1: use the 
          static fields defined in Vector2D (i.e. s_up, s_down, s_left, and s_right).
        > aDrawShadow: whether or not the block's 'shadown' should also be drawn.
    */
    shift(pGrid : Grid, pDirection = Vector2D.sUp, pDrawShadow : boolean = true)
    {
        pGrid.unDrawBlock(this, true, pDrawShadow);

        let lLengthShift = 0;

        // Drop the block.
        while(this.move(pDirection, pGrid, false))
            ++lLengthShift;

        pGrid.drawBlock(this, true, false, pDrawShadow);

        return lLengthShift;
    }
    
    /*
     * This method returns true if the block can be moved in the given direction; false if otherwise. 
    */
    CanMove(pMovement : Vector2D, pGrid : Grid) : boolean
    {
        for (let i = 0; i < this.#fPositions.length; ++i)
        {
            if (!this.canMoveTilePosition(i, pMovement, pGrid))
            {
                //System.out.println("Invalid movement!");
                return false;
            }
        }

        return true;
    }
    
    /*
     * This method returns the colour associated with the block's type. 
    */
    getColour() : string
    {
        return this.#fColour ? this.#fColour : Block.sColoursMap.get(this.#fType) ?? "#00000000";
    }

// Accessors (2) -------------------------------------------------------------------------------------------------------

    /* Accessor of this.#fType
    */
    get type()
    {
        return this.#fType;
    }
    
    /* Accessor of fPositions.
    */
    // get position()
    getPosition() : Vector2D[]
    {
        return this.#fPositions;
    }

    /* Accessor of f_position.
    */
    get indexRotation()
    {
        return this.#fIndexRotation;
    }


// Mutators (1) --------------------------------------------------------------------------------------------------------

    set type(aType)
    {
        this.#fType = aType;
    }

    set indexRotation(aIndex)
    {
        this.#fIndexRotation = aIndex;
    }

    /**
    * This method sets the block's position in accordance with the given coordinate. The block's position is the block's
      'origin' coordinate (this.#fPositions[0?]).
    */
    set position(pPos : Vector2D)
    {
        // Set the position of the 'centre piece'.
        this.#fPositions[0] = pPos.copy();
        
        // Set the positions of the other (three) tiles.
        switch (this.#fType)
        {
            case "I" :
                // |/||/||/||/|
                //  1  0  3  2
                this.#fPositions[1] = this.#fPositions[0].Plus(new Vector2D(-1,0));
                this.#fPositions[2] = this.#fPositions[0].Plus(new Vector2D(2,0));
                this.#fPositions[3] = this.#fPositions[0].Plus(new Vector2D(1,0));
                break;
                
            case "J" :
                // |/|
                //  2
                // |/||/||/|
                //  1  0  3
                this.#fPositions[1] = this.#fPositions[0].Plus(new Vector2D(-1,0));
                this.#fPositions[2] = this.#fPositions[0].Plus(new Vector2D(-1,-1));
                this.#fPositions[3] = this.#fPositions[0].Plus(new Vector2D(1,0));
                break;
                
            case "L" :
                //       |/|
                //        2
                // |/||/||/|
                //  3  0  1
                this.#fPositions[1] = this.#fPositions[0].Plus(new Vector2D(1,0));
                this.#fPositions[2] = this.#fPositions[0].Plus(new Vector2D(1,-1));
                this.#fPositions[3] = this.#fPositions[0].Plus(new Vector2D(-1,0));
                break;

            case "O" :
                // |/||/|
                //  3  2
                // |/||/|
                //  0  1 
                this.#fPositions[1] = this.#fPositions[0].Plus(new Vector2D(1,0));
                this.#fPositions[2] = this.#fPositions[0].Plus(new Vector2D(1,-1));
                this.#fPositions[3] = this.#fPositions[0].Plus(new Vector2D(0,-1));
                break;

            case "S" :
                //    |/||/|
                //     2  3
                // |/||/|
                //  1  0 
                this.#fPositions[1] = this.#fPositions[0].Plus(new Vector2D(-1,0));
                this.#fPositions[2] = this.#fPositions[0].Plus(new Vector2D(0,-1));
                this.#fPositions[3] = this.#fPositions[0].Plus(new Vector2D(1,-1));
                break;

            case "T" :
                //    |/|
                //     2 
                // |/||/||/|
                //  1  0  3
                this.#fPositions[1] = this.#fPositions[0].Plus(new Vector2D(-1,0));
                this.#fPositions[2] = this.#fPositions[0].Plus(new Vector2D(0,-1));
                this.#fPositions[3] = this.#fPositions[0].Plus(new Vector2D(1,0));
                break;

            case "Z" :
                // |/||/|
                //  2  1
                //    |/||/|
                //     0  3
                this.#fPositions[1] = this.#fPositions[0].Plus(new Vector2D(0,-1));
                this.#fPositions[2] = this.#fPositions[0].Plus(new Vector2D(-1,-1));
                this.#fPositions[3] = this.#fPositions[0].Plus(new Vector2D(1,0));
                break;

            default :
                console.log("Unknown Block");
        }

        // The number of times the block must be rotated (the block is set to the 0th rotation position above).
        const lNumRotations = this.#fIndexRotation;

        for (let i = 0; i < lNumRotations; ++i)
        {
            for (let j = 0; j < this.#fPositions.length; ++j)
            {
                this.RotateTilePosition(0, j, true);
            }
        }

    }

    set colour(pColour : string)
    {
        this.#fColour = pColour;
    }

    /**
    * Modifies if #fIndexRotation field.
    * @param pClockwise If true, the #fIndexRotation is incremented by 1; otherwise, it's decremented by 1.
    */
    changeRotationIndex(pClockwise : boolean) : void
    {
        // Increment/decrement this.#fIndexRotation according to aClockwise.
        if (pClockwise)
        {
            this.#fIndexRotation = (this.#fIndexRotation + 1) % Block.sNumRotationIndexes;
        }
        else
        {
            this.#fIndexRotation = (this.#fIndexRotation == 0) ? Block.sNumRotationIndexes - 1 : this.#fIndexRotation - 1;
        }
    }


// Auxiliaries (3) =====================================================================================================

    /**
    * Rotates a coordinate in this.#fPositions.

    * Parameters:
        * @param pIndexOrigin The index of this.#fPositions corresponding to the coordinate that is considered the block's 
          origin/centre.
        * @param pIndexPos The index of this.#fPositions of the coordinate to be rotated about the coordinate at 
          aIndexOrigin.
        * @param pClockwise A flag that, when true, indicates that the coordinate should be rotated clockwise.
    */
    RotateTilePosition(pIndexOrigin : number, pIndexPos : number, pClockwise : boolean) : void
    {
        // The position of this.#fPositions[aIndexPos] relative to this.#fPositions[aIndexOrigin].
        const l_position_relative = this.#fPositions[pIndexPos].Minus(this.#fPositions[pIndexOrigin]);
        
        // The new position associated with index aIndexPos.
        const l_position_new = new Vector2D();
        
        // The rotation matrix necessary to 
        const l_matrix_rot = pClockwise ? Block.#sMatrixRotCW : Block.#sMatrixRotCCW;
        
        // Rotate the X position of l_position_relative (store result in l_position_new).
        l_position_new.x = (l_matrix_rot[0].x * l_position_relative.x) + 
                           (l_matrix_rot[1].x * l_position_relative.y);
        
        // Rotate the Y position of l_position_relative (store result in l_position_new).
        l_position_new.y = (l_matrix_rot[0].y * l_position_relative.x) + 
                           (l_matrix_rot[1].y * l_position_relative.y);
        
        // Make l_position_new relative to the universal origin, not the relative origin this.#fPositions[aIndexOrigin].
        l_position_new.plusEquals(this.#fPositions[pIndexOrigin]);
        
        // Set the new position.
        this.#fPositions[pIndexPos] = l_position_new;
    }

    /**
    * This method offsets the block's position in accordance to the old and new rotation indexes.

    * Parameters:
        * @param pIndexRotationOld the rotation index prior to rotation.
        * @param pIndexRotationNew the rotation index post rotation (i.e. the current rotation index).
        * @param pGrid the grid on which the block is displayed.

    * @returns True if the piece was successfully offset into a new position; false if otherwise. 
    */
    OffSet(pIndexRotationOld : number, pIndexRotationNew : number, pGrid : Grid) : boolean
    {
        // The offset vector for lIndexRotationOld, l_index_rotation_new, and the relative offset, respectively.
        let l_offset_old, l_offset_new, l_offset_relative;
        
        // The offset data used to determine the values of the above offsets.
        let l_offset_data;
        
        if (this.#fType === "O")
        { l_offset_data = Block.#sOffsetDataO; }
        else if (this.#fType === "I")
        { l_offset_data = Block.#sOffsetDataI; }
        else
        { l_offset_data = Block.#sOffsetDataJLSTZ; }

        let l_index_offset = 0;

        for(const offsetDataI of l_offset_data)
        {
             // Get the offset vector for indexOffset associated with lIndexRotationOld and l_index_rotation_new, respectively.
             l_offset_old = offsetDataI[pIndexRotationOld];
             l_offset_new = offsetDataI[pIndexRotationNew];
             
             // Calculate the relative offset between the old and new rotation indexes.
             l_offset_relative = l_offset_old.Minus(l_offset_new);
             
             if (this.move(l_offset_relative, pGrid, false))
             {
                //  console.log("============================================================");
                //  console.log("Offset Data Index: " + l_index_offset);
                //  console.log("Roation Indexes: " + aIndexRotationOld + " to " + aIndexRotationNew);
                //  console.log("Offset Vector: " + l_offset_relative);
                 return true;
             }

            if (l_index_offset == 5)
            {
                // console.log("============================================================");
                // console.log("5 didn't work");
                // console.log("Offset Data Index: " + l_index_offset);
                // console.log("Roation Indexes: " + aIndexRotationOld + " to " + aIndexRotationNew);
                // console.log("Offset Vector: " + l_offset_relative);
            }

            ++l_index_offset;
        }
        
        return false;
    }
    
    /* Auxiliary of Move
     * If this.#fPositions[aIndexPos] can be moved according to aMovement, true is returned; otherwise, false.
      
     * Parameters:
         > aIndexPos: the index of the coordinate in this.#fPositions that is to be moved.
         > aMovement: the way in which to move the coordinate.
         > aGrid: the grid on which the block is displayed.
         
      * Return Value:
         * This method returns true if the coordinate can be moved; false if otherwise.  
         
    */
    canMoveTilePosition(pIndexPos : number, pMovement : Vector2D, pGrid : Grid)
    {
        const lPositionPostMove = this.#fPositions[pIndexPos].Plus(pMovement);

        return pGrid.canBeMovedTo(lPositionPostMove);
    }


// Static Methods (2) ==================================================================================================

    static stringToBlockType(pStr : string) : BlockType
    {
        if (!pStr || !Block.sTypeSet.has(pStr[0]))
            return "I";

        return pStr as BlockType;
    }

    static stringToBlockTypes(pStr : string) : BlockType[]
    {
        if (!pStr)
            return [];

        return pStr.split('').map((pBlockType : string) => { return pBlockType as BlockType; });
    }

    /**
    * @returns A random BlockType.
    */
    static getRandomType(pBlocks?: string) : BlockType
    {
        const lBlockTypes = !pBlocks ? Block.sTypeArray : Block.stringToBlockTypes(pBlocks);

        return lBlockTypes[utils.getRandomInt(0, Block.sTypeArray.length - 1)];
    }

    /**
    * @returns A set of random block types.
    */
    static getRandomTypes(pNumTypes : number, pBlocks?: string) : BlockType[]
    {
        const lBlockTypes = !pBlocks ? Block.sTypeArray : Block.stringToBlockTypes(pBlocks);

        const lBlockTypesRandom : BlockType[] = [];

        for (let i = 0; i < pNumTypes; ++i)
        {
            lBlockTypesRandom.push(lBlockTypes[utils.getRandomInt(0, lBlockTypes.length - 1)]);
        }

        return lBlockTypesRandom;
    }

    /**
    * @returns A random block
    */
    static getRandomBlock(pBlocks?: string) : Block
    {
        return new Block(Block.getRandomType(pBlocks));
    }

    /**
    * Paremeters:
        @param pNumBlocks The number of blocks to return.

    * @returns An array of random blocks
    */
    static getRandomBlocks(pNumBlocks : number, pBlocks?: string) : Block[]
    {
        return Block.getRandomTypes(pNumBlocks, pBlocks).map<Block>((pBlockType : BlockType) => { return new Block(pBlockType); })
    }

    /**
    * @returns A random block colour.
    */
    static getRandomColour() : string
    {
        const lBlockTypeRandom : BlockType = Block.getRandomType();

        return Block.sColoursMap.get(lBlockTypeRandom) ?? "#00000000";
    }

    /**
    * @returns A set of random block colours of length pNumColours where each colours is unique.
    */
    static getRandomColours(pNumColours : number) : string[]
    {
        if (pNumColours <= 0)
            pNumColours = 1;
        else if (pNumColours > 7)
            pNumColours = 7;

        const lTypeArray : BlockType[] = [ "I", "J", "L", "O", "S", "T", "Z" ];

        utils.randomiseArray(lTypeArray);

        const lColours : string[] = [];

        for (let i = 0; i < pNumColours; ++i)
        {
            lColours.push(this.sColoursMap.get(lTypeArray[i]) || "transparent");
        }

        return lColours;
    }

}

export default Block;

export type { BlockType }