import { useMemo, useCallback, useState, CSSProperties, useEffect } from 'react';

import { 
    spacingN, CheckBoxStd, PageContainerStd, NavButtonProps, useTheme, StylesCheckBoxStd, ComboBoxStd, StylesComboBoxStd 
} from "@/standard_ui/standard_ui";
import { ItemCombBoxStd } from '@/standard_ui/components/combo_box_std/ComboBoxStd';
import { usePrefs } from '@/contexts/PreferenceContext';
import { Account, Back, HeaderLogo } from "@/pages/nav_buttons";

import TextBlocks from '@/components/text_blocks/TextBlocks';
// import CheckBoxStd, { StylesCheckBoxStd } from '../../components/check_box/CheckBoxStd';
import { stylePageTitle, stylePageConGeneral } from '@/utils/styles';
import { blockSoundsPredefined } from '@/utils/sounds';
import { BlockSounds } from '@/types';
import { set } from 'lodash';

const gHeaderButtonsLeft : NavButtonProps[] = [ Back ];

function SettingsSound() 
{
    // Acquire global theme.
    const { theme } = useTheme();

    // Acquire preferences.
    const cxPrefs = usePrefs();

    const [ stIndexBlockSounds, setIndexBlockSounds ] = useState<number>(0);
    const [ stItemsBlockSounds, setItemsBlockSounds ] = useState<ItemCombBoxStd<BlockSounds>[]>(
        blockSoundsPredefined.map(
            blockSounds => ({ text: blockSounds.name, value: blockSounds }))
    );

    useEffect(
        () =>
        {
            // Intialise with the predefined block sounds.
            const lItemsBlockSounds : ItemCombBoxStd<BlockSounds>[] = blockSoundsPredefined.map(
                blockSounds => ({ text: blockSounds.name, value: blockSounds })
            );

            // todo: add custom sounds to lItemsBlockSounds (once that feature is implemented).

            // Set initial value of stIndexBlockSounds.
            const lIndexInitial : number = lItemsBlockSounds.findIndex(item => item.value.name === cxPrefs.prefs.sounds.name);
            setIndexBlockSounds(lIndexInitial >= 0 ? lIndexInitial : 0);

            // Initialise stItemsBlockSounds and stIndexBlockSounds.
            setItemsBlockSounds(lItemsBlockSounds);
        },
        [ cxPrefs ]
    );

    const lStyleChkSoundEffects = useMemo<StylesCheckBoxStd>(
        () =>
        {
            return {
                con: { padding: spacingN(-1), width: "100%", maxWidth: 500 }
            }
        },
        []
    );

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

    const lOnPressUpdateSFX = useCallback(
        () => 
        { 
            cxPrefs.update({ soundOn: !cxPrefs.prefs.soundOn }); 
        }, 
        [ cxPrefs ]
    );

    const lOnPressUpdateDirection = useCallback(
        (pIndexItem : number) =>
        {
            const lBlockSounds = blockSoundsPredefined[pIndexItem];

            if (!lBlockSounds)
                return;

            setIndexBlockSounds(pIndexItem);

            cxPrefs.update({ sounds: lBlockSounds });
        },
        [ cxPrefs ]
    );

    return ( 
        <PageContainerStd
            prLogo = { HeaderLogo }
            prHeaderButtonsLeft = { gHeaderButtonsLeft }
            // prHeaderButtonsRight = { gHeaderButtonsRight }
            prStyles = { stylePageConGeneral }
        >

            <TextBlocks 
                prText = "GAME SOUNDS" prSizeText = { 40 } 
                prColourBackground = { theme.cst.gridCell.empty } 
                prStyle = { lStyleTitle } 
            />

            <CheckBoxStd 
                prText = "Play Sound Effects" 
                prIsChecked = { cxPrefs.prefs.soundOn } 
                prOnPress = { lOnPressUpdateSFX } 
                prStyle = { lStyleChkSoundEffects }
            />

            <ComboBoxStd
                prTextPlaceholder = "Select Direction"
                prItems = { stItemsBlockSounds }
                prIndexSelected = { stIndexBlockSounds }
                prOnPress = { lOnPressUpdateDirection }
                prLength = { 260 }
                prMaxLengthItemBox = { 220 }
                prStyles = { lStyleComboBox }
            />

        </PageContainerStd>
    );
}

const styles : { [ key: string ]: CSSProperties } =
{
    conButtonTheme:
    {
        alignItems: "center",
        // justifyContent: "center"
    },
    conSFX:
    {
        width: "100%",
        maxWidth: 500,
        rowGap: spacingN(-1),
        padding: spacingN()
    },
    text:
    {
        textAlign: "center",
    },
};

export default SettingsSound;