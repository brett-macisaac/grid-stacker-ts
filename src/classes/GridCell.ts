class GridCell
{
    #fBackgroundColour : string | undefined;

    #fBorderColour : string | undefined;

    constructor(pBackgroundColour?: string, pBorderColour?: string)
    {
        this.#fBackgroundColour = pBackgroundColour;

        this.#fBorderColour = pBorderColour;
    }

    copy() : GridCell
    {
        return new GridCell(this.#fBackgroundColour, this.#fBorderColour);
    }

    clear() : void
    {
        this.#fBackgroundColour = undefined;

        this.#fBorderColour = undefined;
    }

    set backgroundColour(pBackgroundColour: string | undefined)
    {
        this.#fBackgroundColour = pBackgroundColour;
    }

    set borderColour(pBorderColour: string | undefined)
    {
        this.#fBorderColour = pBorderColour;
    }

    get backgroundColour()
    {
        return this.#fBackgroundColour;
    }

    get borderColour()
    {
        return this.#fBorderColour;
    }
};

export default GridCell;