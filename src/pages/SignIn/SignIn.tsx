import React, { useState, useEffect, useContext, useMemo, useCallback, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

import { ButtonStd, StylesButtonStd, SliderStd, TextStd, TextInputStd, PageContainerStd, StylesPageContainerStd, utils, PopUpProps, popUpOk, NavButtonProps, useTheme, useWindowSize, StylesSliderStd, IconFunc } from "../../standard_ui/standard_ui";

import Container, { StylesContainer } from '../../components/container/Container';
import ButtonNextPage from '../../components/button_next_page/ButtonNextPage';
import { usePrefs } from '../../contexts/PreferenceContext';
import { Account, Back, HeaderLogo, SettingsIcon } from "../nav_buttons";

import TextBlocks from '../../components/text_blocks/TextBlocks';
import CheckBoxStd, { StylesCheckBoxStd } from '../../components/check_box/CheckBoxStd';
import { spacingN } from '../../utils/utils_ui';
import { stylePageTitle, styleBtnNextPage, stylePageConGeneral, styleButtonGeneral } from '../../utils/styles';
import { useUser } from '../../contexts/UserContext';
import ApiRequestor, { isResponseError, ResponseError, ResponseUser } from '../../ApiRequestor';
import { maxLengthUsername, maxLengthPassword } from '../../utils/constants';

const gHeaderButtonsLeft : NavButtonProps[] = [ Back ];
const gHeaderButtonsRight : NavButtonProps[] = [ SettingsIcon ];

function SignIn() 
{
    // Acquire global theme.
    const { theme } = useTheme();

    const cxUser = useUser();

    const [ stUsername, setUsername ] = useState("");

    const [ stPassword, setPassword ] = useState("");

    const [ stOptionsPopUpMsg, setOptionsPopUpMsg] = useState<PopUpProps | undefined>(undefined);

    const [ stIsLoading, setIsLoading ] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleSignIn = useCallback(
        async () =>
        {
            if (!stUsername || !stPassword)
            { setOptionsPopUpMsg(popUpOk("Missing Input", "Please enter a username and password." )); return; }

            setIsLoading(true);

            const lResponseSignIn : ResponseError | ResponseUser | undefined = await ApiRequestor.signIn(stUsername, stPassword);

            setIsLoading(false);

            if (!lResponseSignIn)
            { setOptionsPopUpMsg(popUpOk("Connection Error", "Unable to connect to the server. Are you connected to the internet?" )); return; }
            else if (isResponseError(lResponseSignIn))
            { setOptionsPopUpMsg(popUpOk(lResponseSignIn.error.title, lResponseSignIn.error.message)); return; }

            cxUser.update(lResponseSignIn);

            navigate("/account");
        },
        [ stUsername, stPassword, cxUser ]
    );

    const lStyleTitle = useMemo<CSSProperties>(
        () =>
        {
            return stylePageTitle(theme);
        },
        [ theme ]
    );

    return ( 
        <PageContainerStd
            prLogo = { HeaderLogo }
            prHeaderButtonsLeft = { gHeaderButtonsLeft }
            prHeaderButtonsRight = { gHeaderButtonsRight }
            prPopUpProps = { stOptionsPopUpMsg }
            prStyles = { stylePageConGeneral }
            prIsLoading = { stIsLoading }
        >

            <TextBlocks 
                prText = "SIGN IN" prSizeText = { 40 } 
                prColourBackground = { theme.cst.gridCell.empty } 
                prStyle = { lStyleTitle } 
            />

            {/* <TextStandard 
                text = "Enter your username and password below to sign in." isItalic
                style = { styles.text } 
            /> */}

            <div style = { styles.conContent }>

                <div style = { styles.conText }>
                    <TextInputStd 
                        prText = { stUsername } 
                        prPlaceholder = { "Username" } 
                        // prStyles = { globalStyles.textBox }
                        prMaxLength = { maxLengthUsername } 
                        prOnChangeText = { (pNewText) => setUsername(pNewText) }
                    />

                    <TextInputStd 
                        prText = { stPassword } 
                        prPlaceholder = { "Password" } 
                        // prStyles = { globalStyles.textBox }
                        prMaxLength = { maxLengthPassword } 
                        prOnChangeText = { (pNewText) => setPassword(pNewText) }
                        prSecureTextEntry
                    />

                    <ButtonStd 
                        prText = "Sign In" prIsBold
                        prOnPress = { handleSignIn } 
                        prStyles = { styleButtonGeneral }
                    />
                </div>

                <div style = { styles.conCreateAccount }>

                    <TextStd 
                        prText = "Don't have an account? Click the button below."
                        prIsItalic
                        prStyle = { styles.text } 
                    />

                    <ButtonStd 
                        prText = "Create Account" prIsBold
                        prOnPress = { () => navigate("/signUp", { state: { username: stUsername, password: stPassword } }) } 
                        prStyles = { styleButtonGeneral }
                    />
                </div>

            </div>

        </PageContainerStd>
    );
}

const styles : { [ key: string ]: CSSProperties }=
{
    text:
    {
        textAlign: "center",
    },
    conContent:
    {
        flex: 1,
        rowGap: spacingN(3),
        justifyContent: "center",
        alignItems: "center",
        width: "100%", maxWidth: 400,
        paddingTop: spacingN(2.5)
    },
    conText: 
    {
        width: "100%",
        alignItems: "center",
        rowGap: spacingN(1),
    },
    conCreateAccount:
    {
        width: "100%",
        alignItems: "center",
        rowGap: spacingN(-1),
        alignSelf: "end",
        flex: 1,
        justifyContent: "end"
    }
};

export default SignIn;