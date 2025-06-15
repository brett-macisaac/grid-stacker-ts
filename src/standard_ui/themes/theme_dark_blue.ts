import { Theme } from "./theme_types"

const darkBlue : Theme =
{
    // The theme's name.
    name: "Ocean",

    isDark: true,

    std:
    {
        text:
        {
            color: "#FFFFFF"
        },

        button: 
        {
            background: "#060627",
            border: "#B8B8FC",
            font: "#FFFFFF",

            backgroundInactive: "#353535",
            borderInactive: "#8B8B8B",
            fontInactive: "#8B8B8B",

            overlayInactive: "#35353567"
        },

        buttonNextPage: 
        {
            background: "#060627",
            border: "#B8B8FC",
            font: "#FFFFFF",
            icon: "#B8B8FC",
            iconBackgroundColor: "transparent"
        },

        buttonTheme: 
        {
            content: "#2F2F69",
            header: "#060627",
            navBar: "#060627",
            border: "#B8B8FC",
        },

        checkBox: 
        {
            background: "#060627",
            border: "#B8B8FC",
            font: "#ffffff",
            fontCheck: "#060627",
            backgroundBoxSel: "#060627",
            backgroundBoxUnsel: "#B8B8FC",

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
            background: "#060627",
            backgroundItems: "#060627",
            border: "#B8B8FC",
            font: "#ffffff",
            fontPlaceholder: "#ffffff",
            iconArrow: "#B8B8FC",

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
            border: "#B8B8FC",
        },

        countLabel:
        {
            background: "#060627",
            border: "#B8B8FC",
            font: "#ffffff",
            fontValue: "#ffffff",
            backgroundValue: "#060627",
            borderLeftColorValue: "#B8B8FC",
        },

        textInput:
        {
            background: "transparent",
            font: "#FFFFFF",
            border: "#B8B8FC",
            eyeIcon: "#B8B8FC",

            backgroundInactive: "#383737", 
            fontInactive: "#8B8B8B",
            borderInactive: "#8B8B8B",
            eyeIconInactive: "#8B8B8B",

            overlayInactive: "#15151567"
        },

        header: 
        {
            background: "#060627",
            border: "#B8B8FC",
            logoColours: [ "#B8B8FC" ],
            button: 
            {
                font: "#B8B8FC",
                icon: "#B8B8FC"
            }
        },

        navBar: 
        {
            background: "#060627",
            border: "#B8B8FC",
            button: 
            {
                fontActive: "#B8B8FC",
                fontInactive: "#B8B8FC66",
                iconActive: "#B8B8FC",
                iconInactive: "#B8B8FC66",
            }
        },

        pageContainer:
        {
            background: "#2F2F69",
        },

        popUp:
        {
            backgroundTransparent: "#06062799",
            background: "#2F2F69",
            border: "#B8B8FC",
            font: "#FFFFFF",

            buttonBackgroundColor: "#060627",
            buttonBorderColor: "#B8B8FC",
            buttonFontColor: "#FFFFFF",
        },

        slider:
        {
            borderCon: "#B8B8FC",
            backgroundProgress: "#060627",
            borderProgress: "#B8B8FC",
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
            background: "#2F2F69",
            backgroundHeaderCell: "#060627",
            backgroundContentCell: "#060627",
            border: "#B8B8FC",//"#2F2F69",
            fontHeaderCell: "#FFFFFF",
            fontContentCell: "#FFFFFF"
        },

        loadArea:
        {
            background: "#2F2F69",
            backgroundTranslucent: "#06062799",
            loadIcon: "#B8B8FC",
        },
    },

    cst: 
    {
        gridCell:
        {
            empty: "#060627",
            font: "#FFFFFF"
        },

        grid:
        {
            background: "#2F2F69"
        },

        container:
        {
            background: "#2F2F69",
            header: "#060627",
            border: "#B8B8FC",
            font: "#FFFFFF"
        },

        countLabel:
        {
            backgroundTitle: "#060627",
            backgroundCount: "#060627",
            fontTitle: "#FFFFFF",
            fontCount: "#FFFFFF",
            border: "#B8B8FC",
            // borderTitle: "#FFFFFF",
            // borderCount: "#FFFFFF"
        },

        game: 
        {
            borderNextBlock: "#9B8509"
        }
    }
};

export { darkBlue as default };