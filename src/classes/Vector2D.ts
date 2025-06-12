/*
* A two-dimensional vector class.
*/
class Vector2D
{

// Fields (2) ==========================================================================================================

    /*
    * The vector's x-coordinate.
    */
    #fX : number;

    /*
    * The vector's y-coordinate.
    */
    #fY : number;

// Static Fields -------------------------------------------------------------------------------------------------------

    /* Static Instances
    * These are static instances of the class that are useful for a variety of situations.
    */
    static sDown = new Vector2D(0, -1);
    static sUp = new Vector2D(0, 1);
    static sLeft = new Vector2D(-1, 0);
    static sRight = new Vector2D(1, 0);


// Constructors (2) ====================================================================================================
    
    /*
     * Parameters:
         > aX: The vector's x-coordinate.
         > aY: The vector's y-coordinate.
    */
    constructor(pX : number = 0, pY : number = 0)
    {
        this.#fX = pX;
        this.#fY = pY;
    }

    copy() : Vector2D
    {
        return new Vector2D(this.#fX, this.#fY);
    }


// Methods (11) ========================================================================================================

    /*
     * This method returns the vector's magnitude. 
    */
    Magnitude() : number
    {
        return Math.sqrt(Math.pow(this.#fX, 2.0) + Math.pow(this.#fY, 2.0));
    }

    /*
     * This method calculates and returns the dot product of this vector and the one supplied. 
    */
    DotProduct(pRHS : Vector2D)
    {
        return this.#fX * pRHS.#fX + this.#fY * pRHS.#fY;
    }

    // += operator
    plusEquals(pRHS : Vector2D)
    {
        this.#fX += pRHS.#fX;
        
        this.#fY += pRHS.#fY;
    }

    // -= operator.
    MinusEquals(pRHS : Vector2D)
    {
        this.#fX -= pRHS.#fX;
        
        this.#fY -= pRHS.#fY;
    }

    // + operator.
    Plus(pRHS : Vector2D) : Vector2D
    {
        const lSum = new Vector2D();
        
        lSum.x = this.#fX + pRHS.x;
        lSum.y = this.#fY + pRHS.y;
        
        return lSum;
    }
    
    // - operator.
    Minus(pRHS : Vector2D)
    {
        const lDifference = new Vector2D();
        
        lDifference.#fX = this.#fX - pRHS.#fX;
        lDifference.#fY = this.#fY - pRHS.#fY;
        
        return lDifference;
    }
    
    /*
     * This method returns the vector's string representation.
    */
    toString() : string
    {
        return `(${this.#fX}, ${this.#fY})`;
    }
    
    
// Accessors (2) -------------------------------------------------------------------------------------------------------
    
    /* Accesor of #fX
    */
    get x()
    {
        return this.#fX;
    }
    
    /* Accesor of #fY
    */
    get y()
    {
        return this.#fY;
    }
    
    
// Mutators (2) --------------------------------------------------------------------------------------------------------
    
    /* Mutator of #fX
    */
    set x(aX)
    {
        this.#fX = aX;
    }
    
    /* Mutator of #fY
    */
    set y(aY)
    {
        this.#fY = aY;
    }

}

export default Vector2D;