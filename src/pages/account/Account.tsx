import React, { useState, useEffect, useContext, useMemo, useCallback, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

import { ButtonStd, StylesButtonStd, SliderStd, TextStd, PageContainerStd, StylesPageContainerStd, utils, PopUpProps, NavButtonProps, useTheme, useWindowSize, StylesSliderStd, IconFunc } from "../../standard_ui/standard_ui";
import Container, { StylesContainer } from '../../components/container/Container';
import ButtonNextPage from '../../components/button_next_page/ButtonNextPage';
import { usePrefs } from '../../contexts/PreferenceContext';
import { SettingsIcon, Back, HeaderLogo } from "../nav_buttons";

import TextBlocks from '../../components/text_blocks/TextBlocks';
import CheckBoxStd, { StylesCheckBoxStd } from '../../components/check_box/CheckBoxStd';
import { fontSizeN, spacingN } from '../../utils/utils_ui';
import { stylePageTitle, styleBtnNextPage, stylePageConGeneral, styleButtonGeneral } from '../../utils/styles';

import { useUser } from '../../contexts/UserContext';

const gHeaderButtonsLeft : NavButtonProps[] = [ Back ];
const gHeaderButtonsRight : NavButtonProps[] = [ SettingsIcon ];

function Account() 
{
    const navigate = useNavigate();

    // Acquire global theme.
    const { theme } = useTheme();

    const cxUser = useUser();

    useEffect(
        () =>
        {
            if (!cxUser.user)
            {
                navigate("/signIn");
            }
        },
        [ cxUser ]
    );

    const lStyleTitle = useMemo<CSSProperties>(
        () =>
        {
            return stylePageTitle(theme);
        },
        [ theme ]
    );

    const handleLogOut = useCallback(
        () =>
        {
            cxUser.update(undefined);

            navigate("/");
        },
        [ cxUser ]
    );

    const lOnPressChangeAccount = useCallback(
        () => { navigate("/signIn"); }, []
    );

    const lOnPressChangePlay = useCallback(
        () => { navigate("/gameSettings"); }, []
    );

    return ( 
        <PageContainerStd
            prLogo = { HeaderLogo }
            prHeaderButtonsLeft = { gHeaderButtonsLeft }
            prHeaderButtonsRight = { gHeaderButtonsRight }
            prStyles = { stylePageConGeneral }
        >

            <TextBlocks 
                prText = { `Hi ${cxUser?.user?.username || "???"}` } prSizeText = { 24 } 
                prColourBackground = { theme.cst.gridCell.empty } 
                prStyle = { lStyleTitle } 
            />

            <div style = { lStyleConButtons }>
                <ButtonStd 
                    prText = "Log Out" prIsBold 
                    prOnPress = { handleLogOut } 
                    prStyles = { styleButtonGeneral }
                />

                <ButtonStd 
                    prText = "Change Account" prIsBold  
                    prOnPress = { lOnPressChangeAccount } 
                    prStyles = { styleButtonGeneral }
                />

                <ButtonStd 
                    prText = "Play" prIsBold 
                    prOnPress = { lOnPressChangePlay } 
                    prStyles = { styleButtonGeneral }
                />
            </div>

        </PageContainerStd>
    );
}

// const lStyleButton : StylesButtonStd = {
//     con: { width: "100%", padding: spacingN(-1) },
//     text: { fontSize: fontSizeN(1) }
// };

const lStyleConButtons : CSSProperties = {
    width: "100%", maxWidth: 400, paddingTop: spacingN(), rowGap: spacingN(1)
};

export default Account;