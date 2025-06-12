import { CSSProperties } from "react";

import { StylesButtonStd, StylesHeaderStd, StylesPageContainerStd } from "../standard_ui/standard_ui";
import { StylesContainer } from "../components/container/Container";
import { StylesCountLabel } from "../components/count_label/CountLabel";
import { spacingN, fontSizeN } from "./utils_ui";
import { Theme } from "../standard_ui/themes/theme_types";
import { StylesButtonNextPage } from "../components/button_next_page/ButtonNextPage";

function styleHeader(pIsHorizontal: boolean) : StylesHeaderStd
{
    return {
        con: {
            // borderRadius: spacingN(),
            borderBottomLeftRadius: pIsHorizontal ? spacingN() : 0,
            borderBottomRightRadius: spacingN(),
            borderTopRightRadius: !pIsHorizontal ? spacingN() : 0,
        }
    }
}

function stylePageConMenuWithNavButton(pIsPortrait : boolean) : StylesPageContainerStd
{
    return {
        con:
        {
            padding: 0,
            flexDirection: pIsPortrait ? "column" : "row"
        },
        header: styleHeader
    };
}

function styleBtnNextPageBottom(pIsPortrait : boolean) : StylesButtonStd
{
    return { 
        con:
        {
            height: !pIsPortrait ? "100%" : "auto", 
            width: pIsPortrait ? "100%" : "auto",
            maxWidth: pIsPortrait ? 500 : "none",
            maxHeight: !pIsPortrait ? 500 : "none",
            padding: spacingN(-1)
        }
    };
}

function styleConBtnNextPage(pIsPortrait : boolean, pTheme : Theme) : CSSProperties
{
    return { 
        backgroundColor: pTheme.std.header.background,
        padding: spacingN(),
        borderLeft: !pIsPortrait ? `1px solid ${pTheme.std.header.border}` : "none",
        borderTop: pIsPortrait ? `1px solid ${pTheme.std.header.border}` : "none",
        justifyContent: "center", alignItems: "center",

        borderBottomLeftRadius: !pIsPortrait ? spacingN() : 0,
        borderTopLeftRadius: spacingN(),
        borderTopRightRadius: pIsPortrait ? spacingN() : 0,
    };
}

function stylePageTitle(pTheme : Theme) : CSSProperties
{
    return { 
        justifyContent: "center", 
        padding: spacingN(),
        backgroundColor: pTheme.std.header.background,
        borderRadius: spacingN()
        // borderBottom: "1px solid white"
    };
};

const stylePageConGeneral : StylesPageContainerStd = 
{
    con: {
        rowGap: spacingN(),
        padding: spacingN(),
        alignItems: "center",
    },
    header: styleHeader
};

const styleConInner : CSSProperties =
{
    padding: spacingN(),
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "center",
    overflowX: "hidden",
    overflowY: "scroll",
    rowGap: spacingN(),
};

const styleContainer : StylesContainer =
{
    conOuter:
    {
        maxWidth: 500,
        width: "100%",
        borderRadius: spacingN()
    },
    conInner:
    {
        padding: spacingN(-1),
        rowGap: spacingN(-1),
        // width: "100%",
    },
    text: 
    {
        fontSize: fontSizeN(1),
        padding: "0.75em"
    }
};

const styleCountLabel : StylesCountLabel = {
    conOuter:
    {
        border: "none",
        borderRadius: spacingN(-2)
    },
    conCount:
    {
        borderTopRightRadius: spacingN(-2),
        borderBottomRightRadius: spacingN(-2),
    },
    textTitle:
    {
        fontSize: fontSizeN(0)
    },
    textCount:
    {
        fontSize: fontSizeN(-1),
        paddingTop: fontSizeN() / 2,
        paddingBottom: fontSizeN() / 2
    }
};

const styleBtnNextPage : StylesButtonNextPage = {
    con:
    {
        borderRadius: spacingN(-1),
        maxWidth: 500
    }
};

const styleButtonGeneral : StylesButtonStd = {
    con: { width: "100%", padding: spacingN(-1) },
    text: { fontSize: fontSizeN(1) }
};

export { stylePageConMenuWithNavButton, styleBtnNextPageBottom, styleConBtnNextPage, stylePageTitle,
         styleConInner, styleContainer, styleCountLabel, styleBtnNextPage, stylePageConGeneral, styleButtonGeneral };
