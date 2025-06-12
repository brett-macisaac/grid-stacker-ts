import { CSSProperties, useMemo, memo } from 'react';

import { useTheme } from "../../standard_ui/standard_ui.js";

interface PropsGridCell
{
    prSize: number;
    prText: string | undefined;
    prColour: string;
    prColourBorder?: string;
}

const GridCellDisplayer = memo(

    function GridCellDisplayer({ prSize, prText, prColour, prColourBorder } : PropsGridCell)
    {
        // Acquire global theme.
        const { theme } = useTheme();

        const lStyle = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    width: prSize, height: prSize, 
                    backgroundColor: prColour, 
                    borderRadius: prSize * 0.3, 
                    border: prColourBorder ? `1px solid ${prColourBorder}` : "none",
                    color: theme.cst.gridCell.font,
                    flexShrink: 0
                };
            },
            [ prSize, prColour, theme, prColourBorder ]
        );

        return (
            <div 
                style = { lStyle }
            >
                { prText }
            </div>
        );
    }
)

export default GridCellDisplayer;