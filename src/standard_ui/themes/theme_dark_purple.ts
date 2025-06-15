import { Theme } from "./theme_types"

const darkPurple : Theme =
{
    // The theme's name.
    name: "Plum",

    isDark: true,

    std:
    {
        text:
        {
            color: "#FFFFFF"
        },

        button: 
        {
            background: "#170627",
            border: "#DDB8FC",
            font: "#FFFFFF",

            backgroundInactive: "#353535",
            borderInactive: "#8B8B8B",
            fontInactive: "#8B8B8B",

            overlayInactive: "#35353567"
        },

        buttonNextPage: 
        {
            background: "#170627",
            border: "#DDB8FC",
            font: "#FFFFFF",
            icon: "#DDB8FC",
            iconBackgroundColor: "transparent"
        },

        buttonTheme: 
        {
            content: "#4F2F69",
            header: "#170627",
            navBar: "#170627",
            border: "#DDB8FC",
        },

        checkBox: 
        {
            background: "#170627",
            border: "#DDB8FC",
            font: "#ffffff",
            fontCheck: "#170627",
            backgroundBoxSel: "#170627",
            backgroundBoxUnsel: "#DDB8FC",

            backgroundInactive: "#353535",
            borderInactive: "#8B8B8B",
            fontInactive: "#8B8B8B",
            fontCheckInactive: "#8B8B8B",
            backgroundBoxSelInactive: "#353535",
            backgroundBoxUnselInactive: "#353535",

            overlayInactive: "#35353567"
        },

        comboBox:
        {
            background: "#170627",
            backgroundItems: "#170627",
            border: "#DDB8FC",
            font: "#ffffff",
            fontPlaceholder: "#ffffff",
            iconArrow: "#DDB8FC",

            backgroundInactive: "#353535",
            borderInactive: "#8B8B8B",
            fontInactive: "#8B8B8B",
            fontPlaceholderInactive: "#8B8B8B",
            iconArrowInactive: "#8B8B8B",

            overlayInactive: "#35353567"
        },

        container:
        {
            background: "transparent",
            border: "#DDB8FC",
        },

        countLabel:
        {
            background: "#170627",
            border: "#DDB8FC",
            font: "#ffffff",
            fontValue: "#ffffff",
            backgroundValue: "#170627",
            borderLeftColorValue: "#DDB8FC",
        },

        textInput:
        {
            background: "transparent",
            font: "#FFFFFF",
            border: "#DDB8FC",
            eyeIcon: "#DDB8FC",

            backgroundInactive: "#383737", 
            fontInactive: "#8B8B8B",
            borderInactive: "#8B8B8B",
            eyeIconInactive: "#8B8B8B",

            overlayInactive: "#15151567"
        },

        header: 
        {
            background: "#170627",
            border: "#DDB8FC",
            logoColours: [ "#DDB8FC" ],
            button: 
            {
                font: "#DDB8FC",
                icon: "#DDB8FC"
            }
        },

        navBar: 
        {
            background: "#170627",
            border: "#DDB8FC",
            button: 
            {
                fontActive: "#DDB8FC",
                fontInactive: "#DDB8FC66",
                iconActive: "#DDB8FC",
                iconInactive: "#DDB8FC66",
            }
        },

        pageContainer:
        {
            background: "#4F2F69",
        },

        popUp:
        {
            backgroundTransparent: "#17062799",
            background: "#4F2F69",
            border: "#DDB8FC",
            font: "#FFFFFF",

            buttonBackgroundColor: "#170627",
            buttonBorderColor: "#DDB8FC",
            buttonFontColor: "#FFFFFF",
        },

        slider:
        {
            borderCon: "#DDB8FC",
            backgroundProgress: "#170627",
            borderProgress: "#DDB8FC",
            font: "#ffffff",
            backgroundTrack: "transparent",

            borderConInactive: "#8B8B8B",
            backgroundProgressInactive: "#383737",
            borderProgressInactive: "#8B8B8B",
            fontInactive: "#8B8B8B",
            backgroundTrackInactive: "transparent",

            overlayInactive: "#15151567"
        },

        table:
        {
            background: "#4F2F69",
            backgroundHeaderCell: "#170627",
            backgroundContentCell: "#170627",
            border: "#DDB8FC",//"#4F2F69",
            fontHeaderCell: "#FFFFFF",
            fontContentCell: "#FFFFFF"
        },

        loadArea:
        {
            background: "#4F2F69",
            backgroundTranslucent: "#17062799",
            loadIcon: "#DDB8FC",
        },
    },

    cst: 
    {
        gridCell:
        {
            empty: "#170627",
            font: "#FFFFFF"
        },

        grid:
        {
            background: "#4F2F69"
        },

        container:
        {
            background: "#4F2F69",
            header: "#170627",
            border: "#DDB8FC",
            font: "#FFFFFF"
        },

        countLabel:
        {
            backgroundTitle: "#170627",
            backgroundCount: "#170627",
            fontTitle: "#FFFFFF",
            fontCount: "#FFFFFF",
            border: "#DDB8FC",
            // borderTitle: "#FFFFFF",
            // borderCount: "#FFFFFF"
        },

        game: 
        {
            borderNextBlock: "#9B8509"
        }
    }
};

export { darkPurple as default };