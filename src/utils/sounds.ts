import typeWriter1 from "@/assets/sounds/typewriter_1.mp3";
import typeWriter2 from "@/assets/sounds/typewriter_2.mp3";
import typeWriter3 from "@/assets/sounds/typewriter_3.mp3";
import typeWriter4 from "@/assets/sounds/typewriter_4.mp3";
import typeWriter5 from "@/assets/sounds/typewriter_5.mp3";
import arcadeBeep from "@/assets/sounds/arcade_beep.wav";
import drill1 from "@/assets/sounds/drill_1.mp3";
import drill2 from "@/assets/sounds/drill_2.mp3";
import drill3 from "@/assets/sounds/drill_3.mp3";
import metalImpact from "@/assets/sounds/metal_impact.wav";
import coins from "@/assets/sounds/coins.mp3";
import keyboardMech1 from "@/assets/sounds/keyboard_mech_1.mp3";
import keyboardMech2 from "@/assets/sounds/keyboard_mech_2.mp3";
import keyboardMech3 from "@/assets/sounds/keyboard_mech_3.mp3";
import keyboardMech4 from "@/assets/sounds/keyboard_mech_4.mp3";
import keyboardMech5 from "@/assets/sounds/keyboard_mech_5.mp3";
import keyboardMech6 from "@/assets/sounds/keyboard_mech_6.mp3";
import keyboardMech7 from "@/assets/sounds/keyboard_mech_7.mp3";
import keyboardMech8 from "@/assets/sounds/keyboard_mech_8.mp3";
import keyboardMech9 from "@/assets/sounds/keyboard_mech_9.mp3";
import keyboardMech10 from "@/assets/sounds/keyboard_mech_10.mp3";
import keyboardMech11 from "@/assets/sounds/keyboard_mech_11.mp3";
import keyboardMech12 from "@/assets/sounds/keyboard_mech_12.mp3";
import keyboardMech13 from "@/assets/sounds/keyboard_mech_13.mp3";
import keyboardMech14 from "@/assets/sounds/keyboard_mech_14.mp3";
import keyboardMech15 from "@/assets/sounds/keyboard_mech_15.mp3";
import keyboardMech16 from "@/assets/sounds/keyboard_mech_16.mp3";

import { BlockSounds, isBlockAction, isBlockSoundsRandom } from "@/types";
import utils from "@/standard_ui/utils";

const soundsAll = {
    typeWriter1: { name: "Type Writer 1", file: typeWriter1 },
    typeWriter2: { name: "Type Writer 2", file: typeWriter2 },
    typeWriter3: { name: "Type Writer 3", file: typeWriter3 },
    typeWriter4: { name: "Type Writer 4", file: typeWriter4 },
    typeWriter5: { name: "Type Writer 5", file: typeWriter5 },
    arcadeBeep: { name: "Arcade Beep", file: arcadeBeep },
    drill1: { name: "Drill 1", file: drill1 },
    drill2: { name: "Drill 2", file: drill2 },
    drill3: { name: "Drill 3", file: drill3 },
    metalImpact: { name: "Metal Impact", file: metalImpact },
    coins: { name: "Coins", file: coins },
    keyboardMech1: { name: "Keyboard Mech 1", file: keyboardMech1 },
    keyboardMech2: { name: "Keyboard Mech 2", file: keyboardMech2 },
    keyboardMech3: { name: "Keyboard Mech 3", file: keyboardMech3 },
    keyboardMech4: { name: "Keyboard Mech 4", file: keyboardMech4 },
    keyboardMech5: { name: "Keyboard Mech 5", file: keyboardMech5 },
    keyboardMech6: { name: "Keyboard Mech 6", file: keyboardMech6 },
    keyboardMech7: { name: "Keyboard Mech 7", file: keyboardMech7 },
    keyboardMech8: { name: "Keyboard Mech 8", file: keyboardMech8 },
    keyboardMech9: { name: "Keyboard Mech 9", file: keyboardMech9 },
    keyboardMech10: { name: "Keyboard Mech 10", file: keyboardMech10 },
    keyboardMech11: { name: "Keyboard Mech 11", file: keyboardMech11 },
    keyboardMech12: { name: "Keyboard Mech 12", file: keyboardMech12 },
    keyboardMech13: { name: "Keyboard Mech 13", file: keyboardMech13 },
    keyboardMech14: { name: "Keyboard Mech 14", file: keyboardMech14 },
    keyboardMech15: { name: "Keyboard Mech 15", file: keyboardMech15 },
    keyboardMech16: { name: "Keyboard Mech 16", file: keyboardMech16 }
};

const blockSoundsBeep : BlockSounds = {
    name: "Beep",
    sounds: [ 
        soundsAll.arcadeBeep 
    ]
};

const blockSoundsTypewriter : BlockSounds = {
    name: "Typewriter",
    sounds: [
        soundsAll.typeWriter1,
        soundsAll.typeWriter2,
        soundsAll.typeWriter3,
        soundsAll.typeWriter4,
        soundsAll.typeWriter5
    ]
};
const blockSoundsMechKeyboard : BlockSounds = {
    name: "Mechanical Keyboard",
    sounds: [
        // soundsAll.keyboardMech1,
        soundsAll.keyboardMech2,
        soundsAll.keyboardMech3,
        // soundsAll.keyboardMech4,
        // soundsAll.keyboardMech5,
        // soundsAll.keyboardMech6,
        soundsAll.keyboardMech7,
        // soundsAll.keyboardMech8,
        // soundsAll.keyboardMech9,
        soundsAll.keyboardMech10,
        soundsAll.keyboardMech11,
        // soundsAll.keyboardMech12,
        soundsAll.keyboardMech13,
        soundsAll.keyboardMech14,
        soundsAll.keyboardMech15,
        soundsAll.keyboardMech16
    ]
};

const blockSoundsCoins : BlockSounds = {
    name: "Coins",
    sounds: [
         soundsAll.coins
    ]
};

const blockSoundsMetal : BlockSounds = {
    name: "Metal",
    sounds: [
        soundsAll.metalImpact
    ]
};

const blockSoundsArcade : BlockSounds = {
    name: "Arcade",
    blockActionToSound: {

        right: { name: "Arcade Beep", file: arcadeBeep },
        left: { name: "Arcade Beep", file: arcadeBeep },
        down: { name: "Arcade Beep", file: arcadeBeep },
        clockwise: { name: "Drill 1", file: drill1 },
        antiClockwise: { name: "Drill 2", file: drill2 },
        oneEighty: { name: "Drill 3", file: drill3 },
        impactBlocks: { name: "Metal Impact", file: metalImpact },
        impactWall: { name: "Metal Impact", file: metalImpact },
        clearBlock: { name: "Arcade Beep", file: arcadeBeep },
        switchBlock: { name: "Drill 3", file: drill3 }
    }
};

const blockSoundsDefault : BlockSounds = blockSoundsMechKeyboard;

const blockSoundsPredefined : BlockSounds[] = [
    blockSoundsBeep,
    blockSoundsTypewriter, 
    blockSoundsMechKeyboard,
    blockSoundsCoins,
    blockSoundsMetal,
    blockSoundsArcade,
];

// Object that can be used to get the sound file corresponding to a block action.
interface BlockSoundBox
{
    /**
     * Returns the sound file corresponding to a block action.
     * 
     * @param pBlockAction The block action.
     * 
     * @return The sound file corresponding to the block action. If no sound is found for the block action, a default 
     * sound file is returned.
     */
    getSound(pBlockAction: string) : string;
}

function factoryBlockSoundBox(pSounds : BlockSounds) : BlockSoundBox
{
    if (isBlockSoundsRandom(pSounds))
    {
        return {
            getSound(_pBlockAction: string) : string
            {
                return pSounds.sounds[utils.getRandomInt(0, pSounds.sounds.length - 1)].file;
            }
        };
    }
    else
    {
        return {
            getSound(pBlockAction: string) : string
            {
                if (!isBlockAction(pBlockAction))
                {
                    console.warn(`factoryBlockSoundBox: Invalid block action "${pBlockAction}". Returning default sound.`);
                    return arcadeBeep;
                }
                else if (!pSounds.blockActionToSound[pBlockAction])
                {
                    console.warn(`factoryBlockSoundBox: No sound found for block action "${pBlockAction}". Returning default sound.`);
                    return arcadeBeep;
                }

                return pSounds.blockActionToSound[pBlockAction].file;
            }
        };
    }
}

export { 

    soundsAll, blockSoundsDefault, blockSoundsPredefined,

    factoryBlockSoundBox 
};

export type { BlockSoundBox };