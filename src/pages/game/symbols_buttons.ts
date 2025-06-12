import GridSymbol from '../../classes/GridSymbol';

type GameButtonSymbols = {
    
};

const gridSymbols = {
    left: new GridSymbol('left'),
    right: new GridSymbol('right'),
    leftMax: new GridSymbol('leftMax'),
    rightMax: new GridSymbol('rightMax'),
    down: new GridSymbol('down'),
    downMax: new GridSymbol('downMax'),
    clockwise: new GridSymbol('clockwise'),
    anticlockwise: new GridSymbol('anticlockwise'),
    rotate180: new GridSymbol('rotate180'),
    hold: new GridSymbol('hold')
}

export default gridSymbols