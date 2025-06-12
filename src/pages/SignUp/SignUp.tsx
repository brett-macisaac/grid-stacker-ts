import React, { useState, useEffect, useContext, useMemo, useCallback, CSSProperties } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { ButtonStd, StylesButtonStd, SliderStd, TextStd, TextInputStd, PageContainerStd, StylesPageContainerStd, utils, PopUpProps, popUpOk, NavButtonProps, useTheme, useWindowSize, StylesSliderStd, IconFunc } from "../../standard_ui/standard_ui";
import Container, { StylesContainer } from '../../components/container/Container';
import ButtonNextPage from '../../components/button_next_page/ButtonNextPage';
import { usePrefs } from '../../contexts/PreferenceContext';
import { Account, Back, SettingsIcon, HeaderLogo } from "../nav_buttons";

import TextBlocks from '../../components/text_blocks/TextBlocks';
import CheckBoxStd, { StylesCheckBoxStd } from '../../components/check_box/CheckBoxStd';
import { spacingN } from '../../utils/utils_ui';
import { stylePageTitle, styleBtnNextPage, stylePageConGeneral, styleButtonGeneral } from '../../utils/styles';
import { useUser } from '../../contexts/UserContext';
import ApiRequestor, { isResponseError, ResponseError, ResponseUser } from '../../ApiRequestor';
import { maxLengthPassword, maxLengthUsername } from '../../utils/constants';

const gHeaderButtonsLeft : NavButtonProps[] = [ Back ];
const gHeaderButtonsRight : NavButtonProps[] = [ Account ];

function SignUp() 
{
    const navigate = useNavigate();

    const location = useLocation()

    // Acquire global theme.
    const { theme } = useTheme();

    const cxUser = useUser();

    const [ stUsername, setUsername ] = useState(location.state && "username" in location.state && typeof location.state.username === "string" ? location.state.username : "");

    const [ stPassword, setPassword ] = useState(location.state && "password" in location.state && typeof location.state.password === "string" ? location.state.password : "");

    const [ stPasswordConfirm, setPasswordConfirm ] = useState("");

    const [ stOptionsPopUpMsg, setOptionsPopUpMsg ] = useState<PopUpProps | undefined>(undefined);

    const [ stIsLoading, setIsLoading ] = useState<boolean>(false);

    const handleSignUp = async () =>
    {
        if (!stUsername || !stPassword)
        { setOptionsPopUpMsg(popUpOk("Missing Input", "Please enter a username and password." )); return; }

        if (stPassword.length < gMinLengthPassword)
        { setOptionsPopUpMsg(popUpOk("Invalid Password", "Your password must be at least 8 characters long." )); return; }

        if (!stPasswordConfirm)
        { setOptionsPopUpMsg(popUpOk("Missing Input", "Please renter your password to confirm." )); return; }

        if (stPassword != stPasswordConfirm)
        { setOptionsPopUpMsg(popUpOk("Password Mismatch", "Your password doesn't match with the re-entered password.")); return; }

        setIsLoading(true);

        const lResponseSignUp : ResponseError | ResponseUser | undefined = await ApiRequestor.signIn(stUsername, stPassword, true);

        setIsLoading(false);

        if (!lResponseSignUp)
        { setOptionsPopUpMsg(popUpOk("Connection Error", "Unable to connect to the server. Are you connected to the internet?" )); return; }
        else if (isResponseError(lResponseSignUp))
        { setOptionsPopUpMsg(popUpOk(lResponseSignUp.error.title, lResponseSignUp.error.message)); return; }

        cxUser.update(lResponseSignUp);

        navigate("/account");
    };

    const lStyleTitle = useMemo<CSSProperties>(
        () =>
        {
            return stylePageTitle(theme);
        },
        [ theme ]
    );

    const lOnChangeTextUsername = useCallback(
        (pNewText : string) => { setUsername(pNewText); },
        []
    );

    const lOnChangeTextPassword = useCallback(
        (pNewText : string) => { setPassword(pNewText); },
        []
    );

    const lOnChangeTextPasswordConfirm = useCallback(
        (pNewText : string) => { setPasswordConfirm(pNewText); },
        []
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
                prText = { "SIGN UP" } prSizeText = { 40 } 
                prColourBackground = { theme.cst.gridCell.empty } 
                prStyle = { lStyleTitle } 
            />
            {/* 
            <TextStd 
                prText = "Enter a username and password below to create your account." 
                style = { styles.text } 
            /> */}

            <div style = { styles.conInner }>

                <TextInputStd 
                    prText = { stUsername } 
                    prPlaceholder = { "Username" } 
                    // prStyles = { globalStyles.textBox }
                    prMaxLength = { maxLengthUsername } 
                    prOnChangeText = { lOnChangeTextUsername }
                />

                <TextInputStd 
                    prText = { stPassword } 
                    prPlaceholder = { "Password" } 
                    // prStyles = { globalStyles.textBox }
                    prMaxLength = { maxLengthPassword } 
                    prOnChangeText = { lOnChangeTextPassword }
                    prSecureTextEntry
                />

                <TextInputStd 
                    prText = { stPasswordConfirm } 
                    prPlaceholder = { "Re-enter Password" } 
                    // prStyles = { globalStyles.textBox }
                    prMaxLength = { maxLengthPassword } 
                    prOnChangeText = { lOnChangeTextPasswordConfirm }
                    prSecureTextEntry
                />

                <ButtonStd 
                    prText = "Create Account" prIsBold
                    prOnPress = { handleSignUp } 
                    prStyles = { styleButtonGeneral }
                />

            </div>

        </PageContainerStd>
    );
}

const styles : { [ key: string ]: CSSProperties } =
{
    conInner:
    {
        // flex: 1,
        width: "100%",
        // justifyContent: "center",
        // alignItems: "center",
        paddingTop: spacingN(2.5),
        rowGap: spacingN(1),
        maxWidth: 400
    },
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
    },
    text:
    {
        textAlign: "center",
    },
};

const gMinLengthPassword = 8;

export default SignUp;