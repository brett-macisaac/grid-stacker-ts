import { memo, useMemo, useEffect, useState, useCallback, CSSProperties } from "react";
import TextBlocks from "../text_blocks/TextBlocks";
import Block from "../../classes/Block";
import {  utils } from "../../standard_ui/standard_ui";

interface PropsHeaderIcon
{
    prSizeText?: number
    prIsTextHorizontal?: boolean
};

/*
* A local storage key whose value is the pair of colours that are used for the letters.
*/
const glclStrgKeyLogoColours = "HeaderIconColours";

const HeaderLogo = memo(
    function HeaderIcon({ prSizeText = 100, prIsTextHorizontal = true } : PropsHeaderIcon)
    {
        const [ stLogoColours, setLogoColours ] = useState<string[]>(
            utils.getFromLocalStorage<string[]>(glclStrgKeyLogoColours) || [ Block.getRandomColour(), Block.getRandomColour() ]
        );

        const lOnClick = useCallback(
            () =>
            {
                const lColoursNew : string[] = [ Block.getRandomColour(), Block.getRandomColour() ];

                utils.setInLocalStorage<string[]>(glclStrgKeyLogoColours, lColoursNew);

                setLogoColours(lColoursNew);
            },
            []
        );

        return (
            <div onClick = { lOnClick } style = { gStyleCon }>
                <TextBlocks 
                    prText = "GS" prSizeText = { prSizeText } 
                    prColourBackground = { "transparent" } 
                    prColourPattern = { stLogoColours } prRandomiseColourPatternStart = { false }
                    prIsHorizontal = { prIsTextHorizontal } 
                />
            </div>
        );
    }
);

const gStyleCon : CSSProperties = 
{
    padding: 10
};

export default HeaderLogo;