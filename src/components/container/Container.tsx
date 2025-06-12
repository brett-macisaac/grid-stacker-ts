
import React, { useMemo, memo, CSSProperties } from 'react';

import { TextStd, useTheme, LoadAreaStd } from '../../standard_ui/standard_ui';

type StylesContainer = {
    conOuter?: React.CSSProperties;
    conInner?: React.CSSProperties;
    text?: React.CSSProperties;
};

interface PropsContainer
{
    prTitle?: string;
    prStyles?: StylesContainer;
    prIsLoading?: boolean;
    children?: React.ReactNode; 
}

/* 
* This is the parent component of every page, meaning that it should wrap every page of the application.
* Expected Behaviour: if the supplied children elements do not fill the entire vertical space between the header and 
  footer, the container is expected to take 100% of this space. This is ideal because one may want to center the content
  vertically, such as on a log-in screen, where the input fields are typically centered.
* Note: padding is applied both vertically and horizontally by default, but this can be overridden by the style prop.

* Props:
    > children: any children components.
    > navigation: the navigation object.
    > nameHeaderLeft: the name of the button to be displayed on the left portion of the header. This should correspond
      to a value of Header.buttonNames.
    > nameHeaderRight: the name of the button to be displayed on the right portion of the header. This should 
      correspond to a value of Header.buttonNames.
    > style: an optional styling object for the container of the content.
*/
const Container = memo(

    function Container({ prTitle, prStyles, prIsLoading = false, children, } : PropsContainer)
    {
        // Acquire global theme.
        const { theme } = useTheme();

        const lStyleOuter = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    ...styles.container, 
                    backgroundColor: theme.cst.container.background, borderColor: theme.cst.container.border, 
                    ...prStyles?.conOuter,
                    position: "relative",
                    //width: globalProps.widthCon,
                };
            },
            [ theme, prStyles ]
        );

        const lStyleInner = useMemo<CSSProperties>(
            () =>
            {
                return { ...styles.conInner, ...prStyles?.conInner, };
            },
            [ prStyles ]
        );

        const lStyleText = useMemo<CSSProperties>(
            () =>
            {
                return { 
                    ...styles.title, 
                    backgroundColor: theme.cst.container.header,
                    color: theme.cst.container.font, 
                    ...prStyles?.text 
                };
            },
            [ prStyles, theme ]
        );

        return ( 
            <div 
                style = { lStyleOuter }
            >
                {/* Header/title */}
                {
                    prTitle && (
                        <TextStd 
                            prText = { prTitle } prIsBold
                            prStyle = { lStyleText }
                        />
                    )
                }

                {/* Content */}
                <div style = { lStyleInner }>
                    { children }
                </div>

                <LoadAreaStd 
                    prIsActive = { prIsLoading }
                    prIsTranslucent = { true }
                />

            </div>
        );
    }

);

const styles : { [key: string] : CSSProperties } =
{
    container:
    {
        flexShrink: 0,
        flexDirection: "column",
        // width: globalProps.widthCon,
        // borderRadius: 2 * globalProps.borderRadiusStandard,
        borderRadius: 15,
        border: "1px solid",
        overflow: "hidden"
    },
    conInner:
    {
        // padding: utilsGlobalStyles.spacingVertN(-1),
        flexShrink: 0,
        padding: 10,
        flexDirection: "column",
    },
    title:
    {
        width: "100%",
        fontSize: 17,
        padding: "0.8em 1em",
        borderBottom: "1px solid"
    }
};


export default Container;

export type { StylesContainer };