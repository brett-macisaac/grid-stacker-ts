import React, { useMemo, memo, CSSProperties } from "react";

import { TextStd, useTheme } from '../../standard_ui/standard_ui';

type StylesCountLabel =
{
    conOuter?: React.CSSProperties;
    conCount?: React.CSSProperties;
    textTitle?: React.CSSProperties;
    textCount?: React.CSSProperties;
};

interface PropsCountLabel
{
    prText: string;
    prCount: number | string;
    prStyles?: StylesCountLabel;
}
const CountLabel = memo(

    function CountLabel({ prText, prCount, prStyles } : PropsCountLabel)
    {
        // Acquire global theme.
        const { theme } = useTheme();

        // const lSizeFont = utilsGlobalStyles.fontSizeN(size);

        const lStyleConOuter = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    ...styles.conOuter,
                    columnGap: "1em",//lSizeFont, 
                    backgroundColor: theme.cst.countLabel.backgroundTitle, borderColor: theme.cst.countLabel.border,
                    ...prStyles?.conOuter, 
                };
            },
            [ prStyles, theme ]
        );

        const lStyleConCount = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    ...styles.conCount, backgroundColor: theme.cst.countLabel.backgroundCount, 
                    borderLeftColor: theme.cst.countLabel.border, paddingRight: "0.6em", paddingLeft: "0.6em", 
                    minWidth: "3em",
                    ...prStyles?.conCount
                };
            },
            [ prStyles, theme ]
        );

        const lStyleTextTitle = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    color: theme.cst.countLabel.fontTitle,
                    marginLeft: "1em",
                    ...prStyles?.textTitle
                };
            },
            [ prStyles, theme ]
        );

        const lStyleTextCount = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    color: theme.cst.countLabel.fontCount,
                    ...prStyles?.textCount
                };
            },
            [ prStyles, theme ]
        );


        return (
            <div style = { lStyleConOuter }
            >

                {/* <div style = {{ marginLeft: lSizeFont }}>
                    <TextStd prText = { prText } prIsBold prStyle = { prStyles?.textTitle } />
                </div> */}
                <TextStd prText = { prText } prIsBold prStyle = { lStyleTextTitle } />

                <div style = { lStyleConCount }
                >
                    {/* todo: remove outer container if possible */}
                    <TextStd prText = { prCount } prIsBold prStyle = { lStyleTextCount } />
                </div>

            </div>
        );
    }

);

const styles : { [key: string] : CSSProperties } =
{
    conOuter:
    {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        borderBottom: "1px solid",
    },

    conCount:
    {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "0.5em",//0.6 * utilsGlobalStyles.fontSizeN(1),
        paddingBottom: "0.5em",//0.6 * utilsGlobalStyles.fontSizeN(1),
        borderLeft: "1px solid",
        flexShrink: 0
    },

};

export default CountLabel;

export type { StylesCountLabel };