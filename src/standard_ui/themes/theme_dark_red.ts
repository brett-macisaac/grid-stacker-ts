import { Theme } from "./theme_types"

const darkRed : Theme =
{
    // The theme's name.
    name: "Scarlet",

    isDark: true,

    std:
    {
        text:
        {
            color: "#FFFFFF"
        },

        button: 
        {
            background: "#270606",
            border: "#FCB8B8",
            font: "#FFFFFF",

            backgroundInactive: "#353535",
            borderInactive: "#8B8B8B",
            fontInactive: "#8B8B8B",

            overlayInactive: "#35353567"
        },

        buttonNextPage: 
        {
            background: "#270606",
            border: "#FCB8B8",
            font: "#FFFFFF",
            icon: "#FCB8B8",
            iconBackgroundColor: "transparent"
        },

        buttonTheme: 
        {
            content: "#692F2F",
            header: "#270606",
            navBar: "#270606",
            border: "#FCB8B8",
        },

        checkBox: 
        {
            background: "#270606",
            border: "#FCB8B8",
            font: "#ffffff",
            fontCheck: "#270606",
            backgroundBoxSel: "#270606",
            backgroundBoxUnsel: "#FCB8B8",

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
            background: "#270606",
            backgroundItems: "#270606",
            border: "#FCB8B8",
            font: "#ffffff",
            fontPlaceholder: "#ffffff",
            iconArrow: "#FCB8B8",

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
            border: "#FCB8B8",
        },

        countLabel:
        {
            background: "#270606",
            border: "#FCB8B8",
            font: "#ffffff",
            fontValue: "#ffffff",
            backgroundValue: "#270606",
            borderLeftColorValue: "#FCB8B8",
        },

        textInput:
        {
            background: "transparent",
            font: "#FFFFFF",
            border: "#FCB8B8",
            eyeIcon: "#FCB8B8",

            backgroundInactive: "#383737", 
            fontInactive: "#8B8B8B",
            borderInactive: "#8B8B8B",
            eyeIconInactive: "#8B8B8B",

            overlayInactive: "#15151567"
        },

        header: 
        {
            background: "#270606",
            border: "#FCB8B8",
            logoColours: [ "#FCB8B8" ],
            button: 
            {
                font: "#FCB8B8",
                icon: "#FCB8B8"
            }
        },

        navBar: 
        {
            background: "#270606",
            border: "#FCB8B8",
            button: 
            {
                fontActive: "#FCB8B8",
                fontInactive: "#FCB8B866",
                iconActive: "#FCB8B8",
                iconInactive: "#FCB8B866",
            }
        },

        pageContainer:
        {
            background: "#692F2F",
        },

        popUp:
        {
            backgroundTransparent: "#27060699",
            background: "#692F2F",
            border: "#FCB8B8",
            font: "#FFFFFF",

            buttonBackgroundColor: "#270606",
            buttonBorderColor: "#FCB8B8",
            buttonFontColor: "#FFFFFF",
        },

        slider:
        {
            borderCon: "#FCB8B8",
            backgroundProgress: "#270606",
            borderProgress: "#FCB8B8",
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
            background: "#692F2F",
            backgroundHeaderCell: "#270606",
            backgroundContentCell: "#270606",
            border: "#FCB8B8",//"#692F2F",
            fontHeaderCell: "#FFFFFF",
            fontContentCell: "#FFFFFF"
        },

        loadArea:
        {
            background: "#692F2F",
            backgroundTranslucent: "#27060699",
            loadIcon: "#FCB8B8",
        },
    },

    cst: 
    {
        gridCell:
        {
            empty: "#270606",
            font: "#FFFFFF"
        },

        grid:
        {
            background: "#692F2F"
        },

        container:
        {
            background: "#692F2F",
            header: "#270606",
            border: "#FCB8B8",
            font: "#FFFFFF"
        },

        countLabel:
        {
            backgroundTitle: "#270606",
            backgroundCount: "#270606",
            fontTitle: "#FFFFFF",
            fontCount: "#FFFFFF",
            border: "#FCB8B8",
            // borderTitle: "#FFFFFF",
            // borderCount: "#FFFFFF"
        },

        game: 
        {
            borderNextBlock: "#9B8509"
        }
    }
};

export { darkRed as default };