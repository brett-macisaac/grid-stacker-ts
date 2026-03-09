import { useMemo, useCallback, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

import Home from '@mui/icons-material/Home';

import { spacingN, TextStd, PageContainerStd, NavButtonProps, useTheme, IconFunc } from "@/standard_ui/standard_ui";
import ButtonNextPage from '@/components/button_next_page/ButtonNextPage';
import { Back, HeaderLogo } from "@/pages/nav_buttons";

import TextBlocks from '@/components/text_blocks/TextBlocks';
import { stylePageTitle, styleBtnNextPage, stylePageConGeneral } from '@/utils/styles';

const gHeaderButtonsLeft : NavButtonProps[] = [ Back ];

function InvalidPage() 
{
    // Acquire global theme.
    const { theme } = useTheme();

    const navigate = useNavigate();

    const lStyleTitle = useMemo<CSSProperties>(
        () =>
        {
            return stylePageTitle(theme);
        },
        [ theme ]
    );

    const lOnPressMenu = useCallback(
        () => { navigate("/"); }, []
    );

    return ( 
        <PageContainerStd
            prLogo = { HeaderLogo }
            prHeaderButtonsLeft = { gHeaderButtonsLeft }
            // prHeaderButtonsRight = { gHeaderButtonsRight }
            prStyles = { stylePageConGeneral }
        >

            <TextBlocks 
                prText = "INVALID PAGE" prSizeText = { 40 } 
                prColourBackground = { theme.cst.gridCell.empty } 
                prStyle = { lStyleTitle } 
            />

            <TextStd prText = "This page doesn't exist. Click the button below to go to the menu." />

            <ButtonNextPage 
                prText = "Menu" 
                // sizeText = { 1 }
                prIsBold prStyles = { styleBtnNextPage }
                prIcon = { iconMenu }
                prOnPress = { lOnPressMenu }
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

const iconMenu : IconFunc = (pSize : number, pColour : string) =>
{
    return <Home sx = {{ fill: pColour, fontSize: pSize }} /> 
};

export default InvalidPage;