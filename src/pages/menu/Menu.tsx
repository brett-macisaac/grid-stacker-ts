import React, { useState, useEffect, useContext, useRef, useMemo, useCallback, memo, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

import { ButtonStd, StylesButtonStd, TextStd, PageContainerStd, StylesPageContainerStd, utils, PopUpProps, NavButtonProps, useTheme, useWindowSize } from "../../standard_ui/standard_ui";
import { useUser } from '../../contexts/UserContext';
import { Account, HeaderLogo, SettingsIcon } from "../nav_buttons";
import { User, MetaStats } from "../../types";
import ApiRequestor from '../../ApiRequestor';
import { stylePageConMenuWithNavButton, styleBtnNextPageBottom, styleConBtnNextPage, stylePageTitle, styleConInner, styleContainer, styleCountLabel } from "../../utils/styles"
const gHeaderButtonsLeft : NavButtonProps[] = [ Account ];
const gHeaderButtonsRight : NavButtonProps[] = [ SettingsIcon ];

import { fontSizeN, spacingN } from "../../utils/utils_ui";

import Block from '../../classes/Block';
import ButtonBlocks from '../../components/button_blocks/ButtonBlocks';
import CountLabel, { StylesCountLabel } from '../../components/count_label/CountLabel';
import Container, { StylesContainer } from '../../components/container/Container';
import TextBlocks from '../../components/text_blocks/TextBlocks';
import { lclStrgKeyPopUpBlackList } from '../../standard_ui/components/pop_up_std/PopUpStd';
import { lclStrgKeyMetaStats } from '../../utils/constants';
import MetaStatsManager from '../../classes/MetaStatsManager';

function Menu() 
{
    // Acquire user.
    const { user } = useUser();

    // Acquire theme.
    const { theme } = useTheme();

    const cxWindowSize = useWindowSize();

    const navigate = useNavigate();

    const [ stMetaStatsLocal, setMetaStatsLocal ] = useState<MetaStats>(
        MetaStatsManager.getMetaStatsLocal()
    );

    const [ stGridTextColour, setGridTextColour ] = useState<string>(Block.getRandomColour());

    const [ stMetaStatsGlobal, setMetaStatsGlobal ] = useState<MetaStats | undefined>(undefined);

    const [ stOptionsPopUpMsg, setOptionsPopUpMsg] = useState<PopUpProps | undefined>(undefined);

    const [ stIsLoadingGlobalStats, setIsLoadingGlobalStats ] = useState<boolean>(false);

    const formatNumber = useCallback(
        (pNum : number) =>
        {
            return utils.intToCommaSeparatedString(pNum);
        },
        []
    );

    const lOnPressBtnPlay = useCallback(
        () =>
        {
            // The list of pop-ups that are set to never show again.
            const lPopUpBlacklist : string[] = utils.getFromLocalStorage(lclStrgKeyPopUpBlackList) || [];

            // Show the pop-up if the user isn't signed-in or the pop-up is set to never show again.
            if (!user && !lPopUpBlacklist.includes(gPopUpIdNotSignedIn))
            {
                setOptionsPopUpMsg(
                    {
                        title: "Not Signed In",
                        message: "You aren't signed in, meaning that your high-scores won't be recorded globally. Do you wish to continue?",
                        buttons: [
                            { text: "Continue as Guest", onPress: () => { navigate("/gameSettings") } },
                            { text: "Sign In", onPress: () => { navigate("/signIn") } },
                            { text: "Create Account", onPress: () => { navigate("/signUp") } },
                        ],
                        id: gPopUpIdNotSignedIn,
                        showNeverShowAgainCheckbox: true
                    }
                );
                return;
            }

            navigate("/gameSettings");
        },
        []
    );

    useEffect(
        () =>
        {
            console.log("Menu -> useEffect");

            const setMetaStats = async () =>
            {
                setIsLoadingGlobalStats(true);

                const lMetaStats = await MetaStatsManager.getMetaStatsGlobal(true);

                setIsLoadingGlobalStats(false);

                if (lMetaStats)
                    setMetaStatsGlobal(lMetaStats);
            }

            setMetaStats();
        },
        []
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
            // return { 
            //     backgroundColor: theme.std.header.background,
            //     padding: spacingN(),
            //     borderLeft: !cxWindowSize.isPortraitOrBigScreen ? `1px solid ${theme.std.header.border}` : "none",
            //     borderTop: cxWindowSize.isPortraitOrBigScreen ? `1px solid ${theme.std.header.border}` : "none",
            //     justifyContent: "center", alignItems: "center"
            //     // borderBottom: "1px solid white"
            // };
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
            // buttonNavBarText = "PLAY"
            // buttonNavBarHandler = { handlePlay }
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
                    prText = "GRID STACKER" prSizeText = { 40 } 
                    prColourBackground = { theme.cst.gridCell.empty } 
                    prStyle = { lStyleTitle } 
                />

                {/* Stats */}
                <div style = { styles.content }>
                    <Container prStyles = { styleContainer } prTitle = "Local Stats" >
                        <CountLabel prText = "Games Played" prCount = { formatNumber(stMetaStatsLocal.totalGames) } prStyles = { styleCountLabel } />

                        <CountLabel prText = "Points Scored" prCount = { formatNumber(stMetaStatsLocal.totalScore) } prStyles = { styleCountLabel } />

                        <CountLabel prText = "Lines Cleared" prCount = { formatNumber(stMetaStatsLocal.totalLines) } prStyles = { styleCountLabel } />
                    </Container>

                    <Container prStyles = { styleContainer } prTitle = { "Global Stats" } prIsLoading = { stIsLoadingGlobalStats }>
                        <CountLabel prText = "Games Played" prCount = { stMetaStatsGlobal ? formatNumber(stMetaStatsGlobal.totalGames) : "-" } prStyles = { styleCountLabel } />
        
                        <CountLabel prText = "Points Scored" prCount = { stMetaStatsGlobal ? formatNumber(stMetaStatsGlobal.totalScore) : "-" } prStyles = { styleCountLabel } />
        
                        <CountLabel prText = "Lines Cleared" prCount = { stMetaStatsGlobal ? formatNumber(stMetaStatsGlobal.totalLines) : "-"} prStyles = { styleCountLabel } />
                    </Container>

                    {/* <TextBlocks 
                        prText = "!@#$%^&*(){}[]''<>?/\|`~,.+=-:;" prSizeText = { 50 } 
                        prColourBackground = { theme.emptyGridCell } 
                        prStyle = {{ ...styles.title, justifyContent: "center", backgroundColor: theme.emptyGridCell, padding: 10 }} 
                    /> */}

                    {/* <TextBlocks 
                        prText = "GS" prSizeText = { 300 } 
                        prColourBackground = { theme.emptyGridCell } 
                        prColourPattern = { [ utilsAppSpecific.getRandomBlockColour(), utilsAppSpecific.getRandomBlockColour() ] }
                        prStyle = {{ ...styles.title, justifyContent: "center", alignItems: "center", backgroundColor: theme.emptyGridCell, width: 600, height: 600, flexShrink: 0 }} 
                    /> */}
                </div>

            </div>

            {/* Next Page Button */}
            <div style = { lStyleConBtnPlay }>
                <ButtonBlocks 
                    prText = "PLAY"
                    prOnPress = { lOnPressBtnPlay }
                    prIsHorizontal = { cxWindowSize.isPortraitOrBigScreen }
                    prStyle = { lStyleBtnPlay }
                />
            </div>

        </PageContainerStd>
    );
}

const styles : { [ key: string ] : CSSProperties } = 
{
    // conInner:
    // {
    //     padding: spacingN(),
    //     flexGrow: 1,
    //     flexDirection: "column",
    //     alignItems: "center",
    //     overflowX: "hidden",
    //     overflowY: "scroll",
    //     rowGap: spacingN(),
    // },
    content:
    {
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: spacingN(2),
        rowGap: spacingN(1),
        justifyContent: "center",
        alignItems: "center"
    },
};

// The ID of the pop-up that appears when not signed-in.
const gPopUpIdNotSignedIn = "notSignedInMenu";

export default Menu;