import React, { useState, useEffect, useContext, useCallback, useMemo, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

import { ButtonStd, StylesButtonStd, SliderStd, TextStd, TextInputStd, PageContainerStd, StylesPageContainerStd, utils, 
         PopUpProps, popUpOk, NavButtonProps, useTheme, useWindowSize, StylesSliderStd } from "../../standard_ui/standard_ui";
import { useUser } from '../../contexts/UserContext';
import { usePrefs } from '../../contexts/PreferenceContext';
import { Account, Back, HeaderLogo, SettingsIcon } from "../nav_buttons";
import { User, MetaStats, GameStats } from "../../types";
import ApiRequestor from '../../ApiRequestor';
import { stylePageConMenuWithNavButton, styleBtnNextPageBottom, styleConBtnNextPage, stylePageTitle, styleConInner } from "../../utils/styles"
import TextBlocks from '../../components/text_blocks/TextBlocks';
import { spacingN } from '../../utils/utils_ui';
import ButtonBlocks from '../../components/button_blocks/ButtonBlocks';
const gHeaderButtonsLeft : NavButtonProps[] = [ Back ];
const gHeaderButtonsRight : NavButtonProps[] = [ SettingsIcon ];

// import globalProps, { utilsGlobalStyles } from '../../styles.js';
// import optionsHeaderButtons from '../../components/options_header_buttons.jsx';

// import ButtonStandard from '../../components/button_standard/ButtonStandard.jsx';
// import PageContainer from '../../components/page_container/PageContainer.jsx';
// import Grid from '../../classes/Grid.js';
// import Block from '../../classes/Block.js';
// import GridDisplayer from '../../components/grid_displayer/GridDisplayer.js';
// import GridChar from '../../classes/GridChar.js';
// import ButtonBlocks from '../../components/button_blocks/ButtonBlocks.js';
// import TextBlocks from '../../components/text_blocks/TextBlocks.js';
// import utils from '../../utils/utils.js';
// import consts from '../../utils/constants.js';
// import ThemeContext from "../../contexts/ThemeContext.js";
// import PreferenceContext from '../../contexts/PreferenceContext.js';
// import TextStandard from '../../components/text_standard/TextStandard';
// import TextInputStandard from '../../components/text_input_standard/TextInputStandard.jsx';
// import { PopUpOk } from '../../components/pop_up_standard/PopUpStandard.jsx'
// import headerButtons from '../../components/header_buttons/HeaderButtons';

/*
* A local storage key for all of the (guest) usernames that have been used in the past.
*/
const gLclStrgKeyPreviousPlayers = "PreviousGuestUsernames";

function GuestUsername() 
{
    // Acquire theme.
    const { theme } = useTheme();

    // Acquire preferences.
    const cxPrefs = usePrefs();

    const cxWindowSize = useWindowSize();

    const [ stOptionsPopUpMsg, setOptionsPopUpMsg ] = useState<PopUpProps | undefined>(undefined);

    const [ stUsername, setUsername ] = useState<string>(cxPrefs.prefs.usernameGuest);

    const [ stPrevPlayers, setPrevPlayers ] = useState<string[]>(utils.getFromLocalStorage(gLclStrgKeyPreviousPlayers) || []);

    const navigate = useNavigate();

    useEffect(
        () =>
        {
        },
        []
    );

    const lHandleTextInput = useCallback(
        (pNewUserName : string) =>
        {
            setUsername(pNewUserName);
        },
        []
    );

    const lHandlePlay = useCallback(
        () =>
        {
            if (stUsername == "")
            {
                setOptionsPopUpMsg(popUpOk("No Username", "You must enter a guest username to play."));
                return;
            }
            else if (stUsername.replace(/\s+/g, '').length == 0)
            {
                setOptionsPopUpMsg(popUpOk("Invalid Username", "Your username must have at least one non-space character."));
                return;
            }

            cxPrefs.update(undefined, undefined, stUsername);

            const lIsNewUser = !stPrevPlayers.includes(stUsername);

            if (lIsNewUser)
            {
                utils.setInLocalStorage(gLclStrgKeyPreviousPlayers, [ ...stPrevPlayers, stUsername ]);
            }
            
            navigate("/game");
        },
        [ stUsername, stPrevPlayers ]
    );

    const lStyleCon = useMemo<StylesPageContainerStd>(
        () =>
        {
            return stylePageConMenuWithNavButton(cxWindowSize.isPortraitOrBigScreen);
        },
        [ cxWindowSize ]
    );

    const lStyleTitle = useMemo<CSSProperties>(
        () =>
        {
            return stylePageTitle(theme);
        },
        [ theme ]
    );

    const lStyleConBtnPlay = useMemo<CSSProperties>(
        () =>
        {
            return styleConBtnNextPage(cxWindowSize.isPortraitOrBigScreen, theme);
        },
        [ theme, cxWindowSize ]
    );

    const lStyleBtnPlay = useMemo<StylesButtonStd>(
        () =>
        {
            return styleBtnNextPageBottom(cxWindowSize.isPortraitOrBigScreen);
        },
        [ cxWindowSize ]
    );

    return ( 
        <PageContainerStd
            prLogo = { HeaderLogo }
            prHeaderButtonsLeft = { gHeaderButtonsLeft }
            prHeaderButtonsRight = { gHeaderButtonsRight }
            prStyles = { lStyleCon }
            prPopUpProps = { stOptionsPopUpMsg }
        >
            {/* Page Content */}
            <div style = { styleConInner } className = "hideScrollBar">

                {/* Title */}
                <TextBlocks 
                    prText = "GUEST USERNAME" prSizeText = { 40 } 
                    prColourBackground = { theme.cst.gridCell.empty } 
                    prStyle = { lStyleTitle } 
                />

                <TextStd 
                    prText = "You aren't signed-in, meaning you'll have to play with a guest username." 
                    prStyle = { styles.lblGeneralText } prIsItalic
                />

                <TextInputStd 
                    prPlaceholder = "Username"
                    prText = { stUsername } 
                    prOnChangeText = { lHandleTextInput } 
                    prMaxLength = { 20 } 
                />

                {
                    (stPrevPlayers.length != 0 && !(stPrevPlayers.length == 1 && stPrevPlayers[0] == stUsername)) && (
                        <div style = { styles.conPrevPlayers }>

                            <TextStd 
                                prText = "Or, select a previous username from below:" 
                                prStyle = { styles.lblGeneralText } prIsItalic prIsBold
                            />

                            {
                                stPrevPlayers.map(
                                    (pUsername : string, pIndex) =>
                                    {
                                        return (
                                            <ButtonStd 
                                                key = { pIndex } 
                                                prText = { pUsername } 
                                                prOnPress = { lHandleTextInput } 
                                                prItemOnPress = { pUsername }
                                                prIsBold
                                                // prStyles = { styles.btnPrevPlayer }
                                            />
                                        )
                                    }
                                )
                            }

                        </div>
                    )
                }

            </div>

            {/* Next Page Button */}
            <div style = { lStyleConBtnPlay }>
                <ButtonBlocks 
                    prText = "PLAY"
                    prOnPress = { lHandlePlay }
                    prIsHorizontal = { cxWindowSize.isPortraitOrBigScreen }
                    prStyle = { lStyleBtnPlay }
                />
            </div>

        </PageContainerStd>
    );
}

const styles : { [key : string]: CSSProperties } = 
{
    lblGeneralText:
    {
        textAlign: "center",
        maxWidth: 600
    },
    conPrevPlayers:
    {
        rowGap: spacingN(-1)
    },
};

export default GuestUsername;