import { useMemo, useCallback, CSSProperties, useState, useEffect } from 'react';

import { ComboBoxStd, PageContainerStd, NavButtonProps, useTheme, StylesComboBoxStd, spacingN } from "@/standard_ui/standard_ui";
import { ItemCombBoxStd } from '@/standard_ui/components/combo_box_std/ComboBoxStd';
import { usePrefs } from '@/contexts/PreferenceContext';
import { Back, HeaderLogo } from "@/pages/nav_buttons";

import TextBlocks from '@/components/text_blocks/TextBlocks';
import { stylePageTitle, stylePageConGeneral } from '@/utils/styles';
import { BlockDirection } from "@/types";

const gHeaderButtonsLeft : NavButtonProps[] = [ Back ];

// const gBlockDirections : BlockDirection[] = [ "fall", "rise", "alternate" ];
const gBlockDirectionItems : ItemCombBoxStd<BlockDirection>[] = [
    { text: "Fall", value: "fall", note: "Blocks fall from the top of the grid (classic)." },
    { text: "Rise", value: "rise", note: "Blocks rise from the bottom of the grid." },
    { text: "Alternate", value: "alternate", note: "Blocks alternate between falling and rising, switching whenever the grid is empty." }
];

function SettingsGameplay() 
{
    // Acquire global theme.
    const { theme } = useTheme();

    const [ stIndexSelected, setIndexSelected ] = useState<number>(0);

    useEffect(
        () =>
        {
            const lIndexInitial : number = gBlockDirectionItems.findIndex(item => item.value === cxPrefs.prefs.blockDirection);
            setIndexSelected(lIndexInitial >= 0 ? lIndexInitial : 0);
        },
        []
    );

    // Acquire preferences.
    const cxPrefs = usePrefs();

    const lStyleTitle = useMemo<CSSProperties>(
        () =>
        {
            return stylePageTitle(theme);
        },
        [ theme ]
    );

    const lStyleComboBox = useMemo<StylesComboBoxStd>(
        () =>
        {
            return {
                con: { padding: spacingN(-1), width: "100%", maxWidth: 320 },
                conItems: { width: "100%" },
                text: { textAlign: "center" }
            };
        },
        []
    );

    const lOnPressUpdateDirection = useCallback(
        (pIndexItem : number) =>
        {
            const lDirection = gBlockDirectionItems[pIndexItem]?.value;

            if (!lDirection)
                return;

            setIndexSelected(pIndexItem);

            cxPrefs.update({ blockDirection: lDirection });
        },
        [ cxPrefs ]
    );

    return ( 
        <PageContainerStd
            prLogo = { HeaderLogo }
            prHeaderButtonsLeft = { gHeaderButtonsLeft }
            prStyles = { stylePageConGeneral }
        >

            <TextBlocks 
                prText = "GAMEPLAY" prSizeText = { 40 } 
                prColourBackground = { theme.cst.gridCell.empty } 
                prStyle = { lStyleTitle } 
            />

            <ComboBoxStd
                prTextPlaceholder = "Select Direction"
                prItems = { gBlockDirectionItems }
                prIndexSelected = { stIndexSelected }
                prOnPress = { lOnPressUpdateDirection }
                prLength = { 260 }
                prMaxLengthItemBox = { 220 }
                prStyles = { lStyleComboBox }
            />

        </PageContainerStd>
    );
}

export default SettingsGameplay;
