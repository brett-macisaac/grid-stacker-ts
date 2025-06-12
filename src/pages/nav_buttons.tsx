import { NavButtonProps, IconFuncMultiColour } from "../standard_ui/types";

import HeaderLogo from "../components/header_logo/HeaderLogo";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import HomeIcon from '@mui/icons-material/Home';
import Settings from '@mui/icons-material/Settings';
import Person from '@mui/icons-material/Person';

const lGoBack : NavButtonProps = 
{
    icon: (pSize : number, pColour : string) =>
    {
        return <ArrowBackIosNewIcon sx = {{ color: pColour, fontSize: pSize }} />
    },
};

const lGoBackConfirm : NavButtonProps = 
{
    icon: (pSize : number, pColour : string) =>
    {
        return <ArrowBackIosNewIcon sx = {{ color: pColour, fontSize: pSize }} />
    },
    showConfirmPopUp: true,
    // titleConfirmPopUp: "Are You Sure?",
    // messageConfirmPopUp: "If you leave this page you may lose data that you've entered."
};

const lHome : NavButtonProps = 
{
    icon: (pSize : number, pColour : string) =>
    {
        return <HomeIcon sx = {{ color: pColour, fontSize: pSize }} />
    },
    text: "Home",
    destination: "pageNavBarA"
};

const lSettings : NavButtonProps = 
{
    icon: (pSize : number, pColour : string) =>
    {
        return <Settings sx = {{ color: pColour, fontSize: pSize }} />
    },
    // text: "Map",
    destination: "/settings"
};

const lAccount : NavButtonProps = 
{
    icon: (pSize : number, pColour : string) =>
    {
        return <Person sx = {{ color: pColour, fontSize: pSize }} />
    },
    destination: "/account"
    // text: "Map",
    // destination: "pageNavBarC"
};

const lHeaderLogo : IconFuncMultiColour = (pSize: number, pColours : string[], pIsVertical : boolean = true) =>
{
    return (
        <HeaderLogo 
            prSizeText = { pSize }
            prIsTextHorizontal = { pIsVertical }
        /> 
    );
};

export { 
    lGoBack as Back, 
    lGoBackConfirm as BackConfirm, 
    lHome as Home,
    lSettings as SettingsIcon,
    lAccount as Account,
    lHeaderLogo as HeaderLogo
}