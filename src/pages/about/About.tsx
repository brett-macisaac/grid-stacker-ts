import React, { useState, useEffect, useContext, useMemo, useCallback, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Brightness4 from '@mui/icons-material/Brightness4';
import SportsEsports from '@mui/icons-material/SportsEsports';
import Info from '@mui/icons-material/Info'; 

import { ButtonStd, StylesButtonStd, SliderStd, TextStd, PageContainerStd, StylesPageContainerStd, utils, PopUpProps, NavButtonProps, useTheme, useWindowSize, StylesSliderStd, IconFunc } from "../../standard_ui/standard_ui";
import Container, { StylesContainer } from '../../components/container/Container';
import ButtonNextPage from '../../components/button_next_page/ButtonNextPage';
import { usePrefs } from '../../contexts/PreferenceContext';
import { Account, Back, HeaderLogo } from "../nav_buttons";

import TextBlocks from '../../components/text_blocks/TextBlocks';
import CheckBoxStd, { StylesCheckBoxStd } from '../../components/check_box/CheckBoxStd';
import { fontSizeN, spacingN } from '../../utils/utils_ui';
import { stylePageTitle, styleBtnNextPage, stylePageConGeneral } from '../../utils/styles';

const gHeaderButtonsLeft : NavButtonProps[] = [ Back ];

function About() 
{
    const navigate = useNavigate();

    // Acquire global theme.
    const { theme } = useTheme();

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
            prStyles = { stylePageConGeneral }
        >
            <TextBlocks 
                prText = "ABOUT" prSizeText = { 40 } 
                prColourBackground = { theme.cst.gridCell.empty } 
                prStyle = { lStyleTitle } 
            />

            <Container prStyles = { gConText } prTitle = 'What is Grid Stacker?'>

                {/* <TextStd 
                    prText = "What is Grid Stacker?"
                    prIsBold
                    prStyle = { styles.title1 }
                /> */}
                <TextStd 
                    prText = {
`Grid Stacker is a web-based game that takes inspiration from other 'falling-blocks' games like Tetris and similar 
alternatives.`
                    }
                    prStyle = { styles.paragraph }
//                    removeLineBreaks
                />
                <TextStd 
                    prText = {
`Unlike many other games in the genre, particularly newer incarnations, in Grid Stacker there is but one goal: to stack 
the blocks and score as many points until you lose. No special modes, simply stack until you die.`
                    }
                    // prStyle = { styles.paragraph }
//                    removeLineBreaks
                />

            </Container>

            <Container prStyles = { gConText } prTitle = 'Why was Grid Stacker created?'>
                {/* <TextStd 
                    prText = "Why was Grid Stacker Created?"
                    prIsBold
                    prStyle = { styles.title1 }
                /> */}
                <TextStd 
                    prText = {
`After trying to find a simple, no-frills 'falling-blocks' game, I was disappointed by many of the current offerings. 
I was frustrated with all of the additional modes, the absurd amount of ads, the clunky controls, the pay-to-win  
structures, the lack of customisation, etc.`
                    }
                    prStyle = { styles.paragraph }
//                    removeLineBreaks
                />
                <TextStd 
                    prText = {
`Thus, I decided to develop my own game. A game that lets you do exactly what you want: stack blocks on a grid and score
 points until you lose.`
                    }
                    // prStyle = { styles.paragraph }
//                    removeLineBreaks
                />
            </Container>

            <Container prStyles = { gConText } prTitle = 'How is Grid Stacker different?'>
                {/* <TextStd 
                    prText = "How is Grid Stacker Different?"
                    prIsBold
                    prStyle = { styles.title1 }
                /> */}
                <TextStd 
                    prText = {
`While Grid Stacker obviously shares similarities with its predecessors, the game places greater emphasis on 
customisation and flexibility, resulting in several noteworthy features that set it apart.`
                    }
                    prStyle = { styles.paragraph }
//                    removeLineBreaks
                />

                <TextStd 
                    prText = "Cross-Platform" prIsBold
                    prStyle = { styles.title2 }
                />
                <TextStd 
                    prText = {
`Whether you're on a computer, tablet, or smartphone, Grid Stacker will look appealing and remain playable.
The game should also work as intended on any modern browser.`
                    }
                    prStyle = { styles.paragraph }
//                    removeLineBreaks
                />
                <TextStd 
                    prText = {
`If you're on a mobile device, the game's UI will adjust depending on whether your phone is in landscape or portrait view.`
                    }
                    prStyle = { styles.paragraph }
//                    removeLineBreaks
                />
                <TextStd 
                    prText = {
`The on-screen controls are available no matter which device you are playing on; however, intuitive keyboard controls 
give you access to all controls, allowing for a comfortable and effective experience when playing on a computer.`
                    }
                    prStyle = { styles.paragraph }
//                    removeLineBreaks
                />

                <TextStd 
                    prText = "Changeable Grid Size" prIsBold
                    prStyle = { styles.title2 }
                />
                <TextStd 
                    prText = {
`You get to decide how big the grid is, with over 100 unique grid sizes. No longer are you forced 
to play on a 10x20 grid.`
                    }
                    prStyle = { styles.paragraph }
//                    removeLineBreaks
                />

                <TextStd 
                    prText = "Changeable Blocks" prIsBold
                    prStyle = { styles.title2 }
                />
                <TextStd 
                    prText = {
`In addition to changing the grid size, you can also choose which blocks can spawn in, which results 
in over 16,000 unique game modes.`
                    }
                    prStyle = { styles.paragraph }
//                    removeLineBreaks
                />

                <TextStd 
                    prText = "Block Spawn System" prIsBold
                    prStyle = { styles.title2 }
                />
                <TextStd 
                    prText = {
`With most games in this genre the blocks spawn above the grid, out-of-sight from the user, and proceed to 'fall' onto 
the grid. With Grid Stacker, the blocks spawn directly onto the grid within the top-three rows if there's available 
space. This alternative system makes playing on smaller grid sizes significantly more manageable. If the next block is 
able to spawn, its outline is displayed on the grid to show the user where to expect it and to notify them that the next
block can in fact spawn.`
                    }
                    prStyle = { styles.paragraph }
                />

                <TextStd 
                    prText = "Block Rotation System" prIsBold
                    prStyle = { styles.title2 }
                />
                <TextStd 
                    prText = {
`The rotation system used in Grid Stacker is a modified form of the standard SRS (Super Rotation System) used by many 
games in the genre. The rotation system has been modified slightly to make playing on smaller grid sizes easier.`
                    }
                    prStyle = { styles.paragraph }
                />

                <TextStd 
                    prText = "Multiplier Scoring System" prIsBold
                    prStyle = { styles.title2 }
                />
                <TextStd 
                    prText = {
`As with other games in the genre, points are scored by forming full horizontal lines, which are then 'cleared'. The 
main difference with Grid Stacker is the score multiplier system. `
                    }
                    prStyle = { styles.paragraph }
                />
                <TextStd 
                    prText = {
`As with other games, your multiplier will increase gradually as you clear more lines. However, the primary way you can
increase your multiplier is by executing multi-line clears, which is where you clear more than 1 line simultaneously.`
                    }
                    prStyle = { styles.paragraph }
                />
                <TextStd 
                    prText = {
`Executing a multi-line clear will increase your multiplier; however, if you only clear a single line, your multiplier 
decreases significantly. This incentises strategic block placement not only to survive, but to continually increase your
score by ever-increasing amounts.`
                    }
                    prStyle = { styles.paragraph }
                />
                <TextStd 
                    prText = {
`The more multi-line clears you perform consecutively, the more your multiplier will increase with each successive 
multi-line clear. However, there are different types of multi-line clears: you can clear either 2, 3, or 4 lines at a 
time, which can be referred to as 2-line clears, 3-line clears, and 4-line clears, respectively.`
                    }
                    prStyle = { styles.paragraph }
                />
                <TextStd 
                    prText = {
`The game keeps track of your 2-line, 3-line, and 4-line clear streaks. For example, if you perform a 2-line clear, you now 
have a 2-line streak of 1. If you then do a 3-line clear, your 2-line streak becomes two (because 3 is greater than 2) 
and your 3-line streak becomes one. Likewise, if you then do a 4-line clear, your 2-line streak becomes three, your 
3-line streak becomes two, and your 4-line streak becomes one. If you then do another 3-line clear, your 2-line and 
3-line streaks will both increase by one, but your 4-line streak will get reset to 0, because you've broken the streak. 
If you then do a 1-line clear, you will likewise lose both your 2-line and 3-line streaks, because a 1-line clear is 
lower than both. These three multi-line streaks determine how much your multiplier increases when you perform your next 
multi-line clear.`
                    }
                    prStyle = { styles.paragraph }
                />

                <TextStd 
                    prText = "Themes" prIsBold
                    prStyle = { styles.title2 }
                />
                <TextStd 
                    prText = {
`The colour of the UI can be changed to suit your preference.`
                    }
                    prStyle = { styles.paragraph }
//                    removeLineBreaks
                />

                <TextStd 
                    prText = "Installable" prIsBold
                    prStyle = { styles.title2 }
                />
                <TextStd 
                    prText = {
`Grid Stacker is a PWA (Progressive Web App), meaning that it can be installed to your device and played offline.`
                    }
                    // prStyle = { styles.paragraph }
                />

            </Container>

            <Container prStyles = { gConText } prTitle = 'Who created Grid Stacker?'>
                {/* <TextStd 
                    prText = "Who Created Grid Stacker?"
                    prIsBold
                    prStyle = { styles.title1 }
                /> */}
                <TextStd 
                    prText = {
`I'm Brett MacIsaac, a junior software engineer based in Melbourne, Australia.`
                    }
                    prStyle = { styles.paragraph }
                />
                <TextStd 
                    prText = {
`Email: brett.macisaac@outlook.com`
                    }
                    // prStyle = { styles.paragraph }
                />
            </Container>

        </PageContainerStd>
    );
}

const gConText : StylesContainer =
{
    conInner: {
        width: "100%",
        maxWidth: 650,
        // rowGap: spacingN(-3),
        padding: spacingN(-1)
    },
    text: {
        fontSize: fontSizeN(1.5)
    }
};

const styles : { [ key: string ]: CSSProperties } =
{
    title1:
    {
        textAlign: "center",
        fontSize: fontSizeN(2),
        marginBottom: spacingN(-1)
        //marginTop: spacingN(-3),
    },
    title2:
    {
        marginTop: spacingN(-1),
        fontSize: fontSizeN(1),
        marginBottom: spacingN(-2)
    },
    paragraph:
    {
        marginBottom: spacingN(-1),
    },
};

export default About;