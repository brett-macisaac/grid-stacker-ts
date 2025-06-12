import React, { useMemo, memo, CSSProperties } from "react";

import { TextStd, useTheme } from '../../standard_ui/standard_ui';

interface StyleTableStd
{
    con?: CSSProperties;
    column?: CSSProperties;
    cellHeader?: CSSProperties;
    cellContent?: CSSProperties;
};

interface TableData
{
    orderColumns: string[];
    header: Map<string, string>;
    content:
    {
        orderRows: string[],
        rows: Map<string, Map<string, string>>
    }
};

interface PropsTableStd 
{
    prData: TableData;
    prBorders?: boolean[];
    prBorderColour?: string;
    prBorderSize?: number;
    prBorderRadiusOuter?: number; 
    prStyle?: StyleTableStd;
};

/*
* A standard table component.

* Props:
    > prRowHeader: the header row (an array of strings).
    > prRowsContent: the content rows (an array of an array of strings). Each row should be have the same length as prRowHeader.
    > prData: an object which contains all of the table's data and the order of the columns.
        e.g. 
        {
            orderColumns: [ "colA", "colC", "colB" ],
            header: { colA: "A", colC: "C", colB: "B" },
            content:
            {
                orderRows: [ "rowA", "rowC", "rowB" ],
                rows:
                {
                    rowA: { colA: "1", colC: "2", colB: "3" }
                    rowC: { colA: "2", colC: "3", colB: "4" }
                    rowB: { colA: "5", colC: "6", colB: "7" }
                }
            }
        }
*/

const TableStd = memo(

    function TableStd({ prData, prBorders = [ true, true, true, true ], prBorderColour, prBorderSize = 2, prBorderRadiusOuter = 0, prStyle } : PropsTableStd)
    {
        // Acquire global theme.
        const { theme } = useTheme();

        // The header row.
        // let lRowHeader : string[] = [];
        // if (prData)
        // {
        //     for (const lColumn of prData.orderColumns)
        //     {
        //         lRowHeader.push(prData.header.get(lColumn) ?? "-");
        //     }
        // }

        const lRowHeader = useMemo<string[]>(
            () =>
            {
                let lRowHeader : string[] = [];
                if (prData)
                {
                    for (const lColumn of prData.orderColumns)
                    {
                        lRowHeader.push(prData.header.get(lColumn) ?? "-");
                    }
                }

                return lRowHeader;
            },
            [ prData ]
        );

        // The dimensions of the table.
        // let lNumColumns : number = prData.orderColumns.length;
        let lNumRows : number = prData.content.rows.size;

        const lRows = useMemo<string[][]>(
            () =>
            {
                const lRows : string[][] = [];
                for (const lRow of prData.content.orderRows)
                {
                    const lRowTemp : string[] = [];
                    for (const lColumn of prData.orderColumns)
                    {
                        lRowTemp.push(prData.content.rows.get(lRow)?.get(lColumn) || "-");
                    }

                    lRows.push(lRowTemp);
                }

                return lRows;
            },
            [ prData ]
        );

        // The content rows.
        // const lRows : string[][] = [];
        // for (const lRow of prData.content.orderRows)
        // {
        //     const lRowTemp : string[] = [];
        //     for (const lColumn of prData.orderColumns)
        //     {
        //         lRowTemp.push(prData.content.rows.get(lRow)?.get(lColumn) || "-");
        //     }

        //     lRows.push(lRowTemp);
        // }

        const lStyleCon = useMemo<CSSProperties>(
            () =>
            {
                const lBorder : string = `${prBorderSize}px solid ${prBorderColour ? prBorderColour : theme.std.table.border}`

                return { 
                    backgroundColor: theme.std.table.background,
                    ...styles.table, 
                    columnGap: prBorderSize,
                    borderTop: prBorders.length > 0 && prBorders[0] ? lBorder : "none",
                    borderRight: prBorders.length > 1 && prBorders[1] ? lBorder : "none",
                    borderBottom: prBorders.length > 2 && prBorders[2] ? lBorder : "none",
                    borderLeft: prBorders.length > 3 && prBorders[3] ? lBorder : "none",
                    borderRadius: prBorderRadiusOuter,
                    ...prStyle?.con,
                }
            },
            [ theme, prBorderSize, prBorderColour, prStyle, prBorders, prBorderRadiusOuter ]
        );

        const lStyleColumn = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    ...styles.column, 
                    rowGap: prBorderSize,
                    ...prStyle?.column, 
                    // borderRadius: 10,
                    // overflow: "hidden"
                    //borderRight: (pIndexCol == lNumColumns - 1) ? lBorder : undefined 
                }
            },
            [ prBorderSize, prStyle ]
        );

        const lStyleCellHeader = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    ...styles.cell, ...styles.cellHeader, ...prStyle?.cellHeader, 
                    backgroundColor: theme.std.table.backgroundHeaderCell
                }
            },
            [ prStyle, theme ]
        );

        const lStyleCellHeaderFirst = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    ...lStyleCellHeader, borderTopLeftRadius: prBorderRadiusOuter,
                }
            },
            [ lStyleCellHeader, prBorderRadiusOuter ]
        );

        const lStyleCellHeaderLast = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    ...lStyleCellHeader, borderTopRightRadius: prBorderRadiusOuter
                }
            },
            [ lStyleCellHeader, prBorderRadiusOuter ]
        );

        const lStyleCellContent = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    ...styles.cell, ...styles.cellHeader, ...prStyle?.cellHeader, 
                    backgroundColor: theme.std.table.backgroundContentCell
                    // borderRight: lBorderRight, borderLeft: lBorderLeft, 
                    // borderTop: prBorders[0] ? lBorder : undefined
                }
            },
            [ prStyle ]
        );

        const lStyleCellContentBottomLeft = useMemo<CSSProperties>(
            () =>
            {
                return {  ...lStyleCellContent, borderBottomLeftRadius: prBorderRadiusOuter }
            },
            [ lStyleCellContent, prBorderRadiusOuter ]
        );

        const lStyleCellContentBottomRight = useMemo<CSSProperties>(
            () =>
            {
                return {  ...lStyleCellContent, borderBottomRightRadius: prBorderRadiusOuter }
            },
            [ lStyleCellContent, prBorderRadiusOuter ]
        );

        return (
            <div
                className = "hideScrollBar tableStandard"
                style = { lStyleCon }
            >
                {
                    lRowHeader.map(
                        (pHeading, pIndexCol) =>
                        {
                            // const lBorderRight = ((pIndexCol != lNumColumns - 1) || prBorders[1]) ? lBorder : "none";
                            // const lBorderLeft = (pIndexCol == 0 && prBorders[3]) ? lBorder : "none";

                            const lIsFirstColumn : boolean = pIndexCol == 0;
                            const lIsLastColumn : boolean = pIndexCol == lRowHeader.length - 1;

                            return (
                                <div 
                                    key = { pIndexCol }
                                    style = { lStyleColumn }
                                >
                                    <TextStd 
                                        prText = { pHeading } prIsBold
                                        prStyle = { lIsFirstColumn ? lStyleCellHeaderFirst : lIsLastColumn ? lStyleCellHeaderLast : lStyleCellHeader }
                                    />
                                    {
                                        Array(lNumRows).fill(undefined).map(
                                            (pIDC, pIndexRow) =>
                                            {
                                                let lText = lRows[pIndexRow][pIndexCol];

                                                if (!lText)
                                                    lText = "-";

                                                const lIsBottomLeft : boolean = lIsFirstColumn && pIndexRow == lNumRows - 1;
                                                const lIsBottomRight : boolean = lIsLastColumn && pIndexRow == lNumRows - 1;

                                                return (
                                                    <TextStd 
                                                        key = { pIndexRow }
                                                        prText = { lText }
                                                        prStyle = { lIsBottomLeft ? lStyleCellContentBottomLeft : lIsBottomRight ? lStyleCellContentBottomRight : lStyleCellContent } 
                                                    />
                                                );
                                            }
                                        )
                                    }
                                </div>
                            )
                        }
                    )
                }

            </div>
        );
    }

);

const styles : { [key : string]: CSSProperties }=
{
    table:
    {
        flexDirection: "row",
        //justifyContent: "center",
        overflowX: "scroll",
        flexShrink: 0
    },
    column:
    {
        flexShrink: 0,
        flexDirection: "column",
        //paddingLeft: 5, 
        //paddingRight: 5, 
    },
    cell:
    {
        padding: 5,
        lineHeight: 1,
        // borderRadius: 10
    },
    cellHeader:
    {
        //padding: 10,
        textAlign: "center",
    },
    cellContent:
    {
        //padding: 5,
        //textAlign: "center"
    }
};

/*
* Returns the height of a table that corresponds to the given parameters.

* Parameters:
    >
*/
function defaultTableHeight(pNumRows : number, pSizeText : number, pBorders : boolean[] = [true, true, true, true ], 
                            pBorderSize : number = 2, pPaddingCell : number = 5)
{
    let lHeightPadding = pNumRows * 2 * pPaddingCell;

    let lHeightBorders : number = pBorderSize * (pNumRows - 1);
    if (pBorders.length > 0 && pBorders[0])
        lHeightBorders += pBorderSize;
    if (pBorders.length > 2 && pBorders[2])
        lHeightBorders += pBorderSize;

    let lHeightText = pNumRows * pSizeText;

    return lHeightPadding + lHeightBorders + lHeightText;
}

export { TableStd as default, defaultTableHeight };

export type { TableData, StyleTableStd };