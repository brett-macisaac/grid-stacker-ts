import React, { useContext, CSSProperties, useMemo, memo } from "react";

import Done from '@mui/icons-material/Done';

import { TextStd, useTheme } from '../../standard_ui/standard_ui';
import { fontSizeN, spacingN } from '../../utils/utils_ui';
import { SxProps } from "@mui/material/styles";

type StylesCheckBoxStd =
{
    con?: CSSProperties
};

interface PropsCheckBoxStd 
{
    prText: string;
    prIsChecked: boolean;
    prOnPress: () => any;
    prStyle?: StylesCheckBoxStd;
    prIsActive?: boolean;
};

const CheckBoxStd = memo(

    function CheckBoxStd({ prText, prIsChecked, prOnPress, prStyle, prIsActive = true }: PropsCheckBoxStd)
    {
        // Acquire global theme.
        const { theme } = useTheme();

        const lStyleCon = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    ...styles.conOuter, 
                    backgroundColor: "transparent", 
                    border: `1px solid ${prIsActive ? theme.std.checkBox.border : theme.std.checkBox.borderInactive}`, 
                    ...prStyle?.con 
                };
            },
            [ theme, prStyle, prIsActive ]
        );

        const lStyleConCheck = useMemo<CSSProperties>(
            () =>
            {
                let lBgColour : string = prIsChecked ? theme.std.checkBox.backgroundBoxSel : theme.std.checkBox.backgroundBoxUnsel
                // let lBgColour : string = prIsActive ? 
                //     prIsChecked ? theme.std.checkBox.backgroundBoxSel : theme.std.checkBox.backgroundBoxUnsel :
                //     prIsChecked ? theme.std.checkBox.backgroundBoxSelInactive : theme.std.checkBox.backgroundBoxUnselInactive;

                return { 
                    ...styles.check, 
                    backgroundColor: lBgColour
                };
            },
            [ theme, prIsActive, prIsChecked ]
        );

        const lStyleCheck = useMemo<SxProps>(
            () =>
            {
                return { fill: prIsActive ? theme.std.checkBox.border : theme.std.checkBox.borderInactive, fontSize: 2 * fontSizeN() };
            },
            [ theme, prIsActive ]
        );

        return (
            <div style = { lStyleCon } onClick = { prOnPress }>

                <div className = "hideScrollBar" style = { styles.conText }>
                    <TextStd prText = { prText } prIsBold = { true } />
                </div>

                <div style = { lStyleConCheck }>
                    {
                        prIsChecked && (
                            <Done 
                                sx = { lStyleCheck }
                            />
                        )
                    }
                </div>

            </div>
        );
    }

)

const styles : { [ key: string ]: CSSProperties }=
{
    conOuter:
    {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // backgroundColor: "#000",
        paddingTop: 0.4 * fontSizeN(),
        paddingBottom: 0.4 * fontSizeN(),
        paddingLeft: 0.75 * fontSizeN(),
        paddingRight: 0.75 * fontSizeN(),
        borderRadius: spacingN(-1),
    },

    conText:
    {
        marginRight: fontSizeN(),
        overflowX: "scroll",
    },

    check:
    {
        flexShrink: 0,
        width: 2.3 * fontSizeN(),
        height: 2.3 * fontSizeN(),
        borderRadius: (2.3 * fontSizeN()) / 2,
        alignItems: "center",
        justifyContent: "center"
    }

};

export default CheckBoxStd;

export type { StylesCheckBoxStd };