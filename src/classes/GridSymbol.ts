import Grid from "./Grid";
import Block, { BlockType } from "./Block";

type GridSymbolName = "left" | "right" | "leftMax" | "rightMax" | "down" | "downMax" | "clockwise" | "anticlockwise" | 
                      "rotate180" | "hold" | "swap";

class GridSymbol
{
    #fGrid : Grid;

    #fName : GridSymbolName;

    #fColour : string;

    #fColourRandom : string;

    static sSymbolDefs7x7 : Map<GridSymbolName, number[]> = new Map(
        [
            [
                'left', 
                [ 
                    0, 0, 0, 1, 1, 1, 0,
                    0, 0, 1, 1, 1, 0, 0,
                    0, 1, 1, 1, 0, 0, 0,
                    1, 1, 1, 0, 0, 0, 0,
                    0, 1, 1, 1, 0, 0, 0,
                    0, 0, 1, 1, 1, 0, 0,
                    0, 0, 0, 1, 1, 1, 0,
                ]
            ],
            [
                'right', 
                [ 
                    0, 1, 1, 1, 0, 0, 0,
                    0, 0, 1, 1, 1, 0, 0,
                    0, 0, 0, 1, 1, 1, 0,
                    0, 0, 0, 0, 1, 1, 1,
                    0, 0, 0, 1, 1, 1, 0,
                    0, 0, 1, 1, 1, 0, 0,
                    0, 1, 1, 1, 0, 0, 0,
                ]
            ],
            [
                'leftMax', 
                [ 
                    0, 0, 0, 1, 0, 1, 0,
                    0, 0, 1, 0, 1, 0, 0,
                    0, 1, 0, 1, 0, 0, 0,
                    1, 0, 1, 0, 0, 0, 0,
                    0, 1, 0, 1, 0, 0, 0,
                    0, 0, 1, 0, 1, 0, 0,
                    0, 0, 0, 1, 0, 1, 0,
                ]
            ],
            [
                'rightMax', 
                [ 
                    0, 1, 0, 1, 0, 0, 0,
                    0, 0, 1, 0, 1, 0, 0,
                    0, 0, 0, 1, 0, 1, 0,
                    0, 0, 0, 0, 1, 0, 1,
                    0, 0, 0, 1, 0, 1, 0,
                    0, 0, 1, 0, 1, 0, 0,
                    0, 1, 0, 1, 0, 0, 0,
                ]
            ],
            [
                'down', 
                [ 
                    0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 1,
                    1, 1, 0, 0, 0, 1, 1,
                    1, 1, 1, 0, 1, 1, 1,
                    0, 1, 1, 1, 1, 1, 0,
                    0, 0, 1, 1, 1, 0, 0,
                    0, 0, 0, 1, 0, 0, 0,
                ]
            ],
            [
                'downMax', 
                [ 
                    0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 1,
                    0, 1, 0, 0, 0, 1, 0,
                    1, 0, 1, 0, 1, 0, 1,
                    0, 1, 0, 1, 0, 1, 0,
                    0, 0, 1, 0, 1, 0, 0,
                    0, 0, 0, 1, 0, 0, 0,
                ]
            ],
            [
                'clockwise', 
                [ 
                    0, 0, 0, 1, 0, 0, 0,
                    0, 0, 0, 0, 1, 0, 0,
                    0, 1, 1, 1, 1, 1, 0,
                    1, 0, 0, 0, 1, 0, 1,
                    1, 0, 0, 1, 0, 0, 1,
                    1, 0, 0, 0, 0, 0, 1,
                    0, 1, 1, 1, 1, 1, 0,
                ]
            ],
            [
                'anticlockwise', 
                [ 
                    0, 0, 0, 1, 0, 0, 0,
                    0, 0, 1, 0, 0, 0, 0,
                    0, 1, 1, 1, 1, 1, 0,
                    1, 0, 1, 0, 0, 0, 1,
                    1, 0, 0, 1, 0, 0, 1,
                    1, 0, 0, 0, 0, 0, 1,
                    0, 1, 1, 1, 1, 1, 0,
                ]
            ],
            [
                'rotate180', 
                [ 
                    0, 0, 1, 0, 0, 0, 0,
                    0, 0, 1, 1, 1, 0, 0,
                    0, 0, 0, 0, 0, 0, 0,
                    1, 0, 1, 0, 1, 0, 1,
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 1, 1, 1, 0, 0,
                    0, 0, 0, 0, 1, 0, 0,
                ]
            ],
            [
                'hold', 
                [ 
                    1, 0, 1, 0, 1, 0, 1,
                    0, 0, 0, 0, 0, 0, 0,
                    1, 0, 1, 0, 0, 0, 1,
                    0, 0, 1, 1, 1, 0, 0,
                    1, 0, 0, 0, 0, 0, 1,
                    0, 0, 0, 0, 0, 0, 0,
                    1, 0, 1, 0, 1, 0, 1,
                ]
            ],
            [
                'swap', 
                [ 
                    0, 0, 1, 0, 0, 0, 0,
                    0, 1, 0, 1, 0, 0, 0,
                    1, 0, 0, 0, 1, 0, 0,
                    0, 0, 0, 0, 0, 0, 0,
                    0, 0, 1, 0, 0, 0, 1,
                    0, 0, 0, 1, 0, 1, 0,
                    0, 0, 0, 0, 1, 0, 0,
                ]
            ],
        ]
    )


// Constructors (1) ====================================================================================================

    constructor(pSymbolName : GridSymbolName = "left", pColour?: string)
    {
        this.#fGrid = new Grid(7, 7);

        this.#fColourRandom = Block.getRandomColour();

        this.#fColour = pColour || this.#fColourRandom;

        this.#fName = pSymbolName;

        const lSymbolDef : number[] | undefined = GridSymbol.sSymbolDefs7x7.get(pSymbolName);

        if (lSymbolDef)
        {
            for (let i = 0; i < lSymbolDef.length; ++i)
            {
                if (lSymbolDef[i] == 1)
                {
                    this.#fGrid.grid[i].backgroundColour = this.#fColour;
                }
            }
        }
    }

    get randomColour()
    {
        return this.#fColourRandom;
    }

    get grid()
    {
        return this.#fGrid;
    }

    get name()
    {
        return this.#fName;
    }

    get colour()
    {
        return this.#fColour;
    }

    setColourRandom()
    {
        this.setColour(this.#fColourRandom);
    }

    setColour(pColour : string)
    {
        this.#fColour = pColour;

        for (let i = 0; i < this.#fGrid.grid.length; ++i)
        {
            if (this.#fGrid.grid[i]) // != undefined
            {
                this.#fGrid.grid[i].backgroundColour = pColour;
            }
        }
    }
}

export default GridSymbol;