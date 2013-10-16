var gamepadSupport = {
    ANALOGUE_BUTTON_THRESHOLD: 0.5,
    available: false,
    gamepads: [],
    prevRawGamepadTypes: [],
    prevTimestamps: [],
    init: function () {
        gamepadSupport.available = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
        return gamepadSupport.available;
    },
    tick: function () {
        gamepadSupport.pollStatus();
    },
    pollStatus: function () {
        gamepadSupport.pollGamepads();
        for (var i in gamepadSupport.gamepads) {
            var gamepad = gamepadSupport.gamepads[i];
            gamepadSupport.updateClick(i);

            // Don’t do anything if the current timestamp is the same as previous
            // one, which means that the state of the gamepad hasn’t changed.
            // This is only supported by Chrome right now, so the first check
            // makes sure we’re not doing anything if the timestamps are empty
            // or undefined.
            if (gamepad.timestamp && (gamepad.timestamp == gamepadSupport.prevTimestamps[i])) {
                continue;
            }
            gamepadSupport.prevTimestamps[i] = gamepad.timestamp;
            gamepadSupport.updateState(i);
        }
    },
    pollGamepads: function () {
        var rawGamepads = (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) || navigator.webkitGamepads;

        if (rawGamepads) {
            // We don’t want to use rawGamepads coming straight from the browser,
            // since it can have “holes” (e.g. if you plug two gamepads, and then
            // unplug the first one, the remaining one will be at index [1]).
            gamepadSupport.gamepads = [];

            // We only refresh the display when we detect some gamepads are new
            // or removed; we do it by comparing raw gamepad table entries to
            // “undefined.”
            var gamepadsChanged = false;

            for (var i = 0; i < rawGamepads.length; i++) {
                if (typeof rawGamepads[i] != gamepadSupport.prevRawGamepadTypes[i]) {
                    gamepadsChanged = true;
                    gamepadSupport.prevRawGamepadTypes[i] = typeof rawGamepads[i];
                }

                if (rawGamepads[i]) {
                    gamepadSupport.gamepads.push(rawGamepads[i]);
                }
            }
        }
    },
    updateState: function (gamepadId) {
        var gamepad = gamepadSupport.gamepads[gamepadId];
        if (gamepad.id == 'Xbox 360 Controller (XInput STANDARD GAMEPAD)') {
            // Prev State
            // Buttons
            gamepadSupport.xboxControllerStatePrev.BTN_X = gamepadSupport.xboxControllerState.BTN_X;
            gamepadSupport.xboxControllerStatePrev.BTN_Y = gamepadSupport.xboxControllerState.BTN_Y;
            gamepadSupport.xboxControllerStatePrev.BTN_A = gamepadSupport.xboxControllerState.BTN_A;
            gamepadSupport.xboxControllerStatePrev.BTN_B = gamepadSupport.xboxControllerState.BTN_B;
            gamepadSupport.xboxControllerStatePrev.BTN_UP = gamepadSupport.xboxControllerState.BTN_UP;
            gamepadSupport.xboxControllerStatePrev.BTN_DOWN = gamepadSupport.xboxControllerState.BTN_DOWN;
            gamepadSupport.xboxControllerStatePrev.BTN_LEFT = gamepadSupport.xboxControllerState.BTN_LEFT;
            gamepadSupport.xboxControllerStatePrev.BTN_RIGHT = gamepadSupport.xboxControllerState.BTN_RIGHT;
            gamepadSupport.xboxControllerStatePrev.SHOULDER_LEFT = gamepadSupport.xboxControllerState.SHOULDER_LEFT;
            gamepadSupport.xboxControllerStatePrev.SHOULDER_RIGHT = gamepadSupport.xboxControllerState.SHOULDER_RIGHT;
            gamepadSupport.xboxControllerStatePrev.BTN_SELECT = gamepadSupport.xboxControllerState.BTN_SELECT;
            gamepadSupport.xboxControllerStatePrev.BTN_START = gamepadSupport.xboxControllerState.BTN_START
            gamepadSupport.xboxControllerStatePrev.STICK_LEFT_BTN = gamepadSupport.xboxControllerState.STICK_LEFT_BTN;
            gamepadSupport.xboxControllerStatePrev.STICK_RIGHT_BTN = gamepadSupport.xboxControllerState.STICK_RIGHT_BTN;

            // Triggers
            gamepadSupport.xboxControllerStatePrev.TRIGGER_LEFT = gamepadSupport.xboxControllerState.TRIGGER_LEFT;
            gamepadSupport.xboxControllerStatePrev.TRIGGER_RIGHT = gamepadSupport.xboxControllerState.TRIGGER_RIGHT;

            // Sticks
            gamepadSupport.xboxControllerStatePrev.STICK_LEFT_X = gamepadSupport.xboxControllerState.STICK_LEFT_X;
            gamepadSupport.xboxControllerStatePrev.STICK_LEFT_Y = gamepadSupport.xboxControllerState.STICK_LEFT_Y;
            gamepadSupport.xboxControllerStatePrev.STICK_RIGHT_X = gamepadSupport.xboxControllerState.STICK_RIGHT_X;
            gamepadSupport.xboxControllerStatePrev.STICK_RIGHT_Y = gamepadSupport.xboxControllerState.STICK_RIGHT_Y;

            // Curr State
            // Buttons
            gamepadSupport.xboxControllerState.BTN_X = (gamepad.buttons[2] > gamepadSupport.ANALOGUE_BUTTON_THRESHOLD);
            gamepadSupport.xboxControllerState.BTN_Y = (gamepad.buttons[3] > gamepadSupport.ANALOGUE_BUTTON_THRESHOLD);
            gamepadSupport.xboxControllerState.BTN_A = (gamepad.buttons[0] > gamepadSupport.ANALOGUE_BUTTON_THRESHOLD);
            gamepadSupport.xboxControllerState.BTN_B = (gamepad.buttons[1] > gamepadSupport.ANALOGUE_BUTTON_THRESHOLD);
            gamepadSupport.xboxControllerState.BTN_UP = (gamepad.buttons[12] > gamepadSupport.ANALOGUE_BUTTON_THRESHOLD);
            gamepadSupport.xboxControllerState.BTN_DOWN = (gamepad.buttons[13] > gamepadSupport.ANALOGUE_BUTTON_THRESHOLD);
            gamepadSupport.xboxControllerState.BTN_LEFT = (gamepad.buttons[14] > gamepadSupport.ANALOGUE_BUTTON_THRESHOLD);
            gamepadSupport.xboxControllerState.BTN_RIGHT = (gamepad.buttons[15] > gamepadSupport.ANALOGUE_BUTTON_THRESHOLD);
            gamepadSupport.xboxControllerState.SHOULDER_LEFT = (gamepad.buttons[4] > gamepadSupport.ANALOGUE_BUTTON_THRESHOLD);
            gamepadSupport.xboxControllerState.SHOULDER_RIGHT = (gamepad.buttons[5] > gamepadSupport.ANALOGUE_BUTTON_THRESHOLD);
            gamepadSupport.xboxControllerState.BTN_SELECT = (gamepad.buttons[8] > gamepadSupport.ANALOGUE_BUTTON_THRESHOLD);
            gamepadSupport.xboxControllerState.BTN_START = (gamepad.buttons[9] > gamepadSupport.ANALOGUE_BUTTON_THRESHOLD);
            gamepadSupport.xboxControllerState.STICK_LEFT_BTN = (gamepad.buttons[10] > gamepadSupport.ANALOGUE_BUTTON_THRESHOLD);
            gamepadSupport.xboxControllerState.STICK_RIGHT_BTN = (gamepad.buttons[11] > gamepadSupport.ANALOGUE_BUTTON_THRESHOLD);

            // Triggers
            gamepadSupport.xboxControllerState.TRIGGER_LEFT = gamepad.buttons[6];
            gamepadSupport.xboxControllerState.TRIGGER_RIGHT = gamepad.buttons[7];

            // Sticks
            gamepadSupport.xboxControllerState.STICK_LEFT_X = gamepad.axes[0];
            gamepadSupport.xboxControllerState.STICK_LEFT_Y = gamepad.axes[1];
            gamepadSupport.xboxControllerState.STICK_RIGHT_X = gamepad.axes[2];
            gamepadSupport.xboxControllerState.STICK_RIGHT_Y = gamepad.axes[3];
        }
    },
    updateClick: function (gamepadId) {

        var gamepad = gamepadSupport.gamepads[gamepadId];
        if (gamepad.id == 'Xbox 360 Controller (XInput STANDARD GAMEPAD)') {
            if (gamepadSupport.xboxControllerState.BTN_A && !gamepadSupport.xboxControllerStateLocked.BTN_A)
                gamepadSupport.xboxControllerStateLocked.BTN_A = true;
            if (!gamepadSupport.xboxControllerState.BTN_A) {
                if (gamepadSupport.xboxControllerStateLocked.BTN_A) 
                    gamepadSupport.xboxControllerStateClick.BTN_A = true;
                else 
                    gamepadSupport.xboxControllerStateClick.BTN_A = false;
                
                gamepadSupport.xboxControllerStateLocked.BTN_A = false;
            }
            if (gamepadSupport.xboxControllerState.BTN_B && !gamepadSupport.xboxControllerStateLocked.BTN_B)
                gamepadSupport.xboxControllerStateLocked.BTN_B = true;
            if (!gamepadSupport.xboxControllerState.BTN_B) {
                if (gamepadSupport.xboxControllerStateLocked.BTN_B) 
                    gamepadSupport.xboxControllerStateClick.BTN_B = true;
                else 
                    gamepadSupport.xboxControllerStateClick.BTN_B = false;
                
                gamepadSupport.xboxControllerStateLocked.BTN_B = false;
            }
            if (gamepadSupport.xboxControllerState.BTN_X && !gamepadSupport.xboxControllerStateLocked.BTN_X)
                gamepadSupport.xboxControllerStateLocked.BTN_X = true;
            if (!gamepadSupport.xboxControllerState.BTN_X) {
                if (gamepadSupport.xboxControllerStateLocked.BTN_X) 
                    gamepadSupport.xboxControllerStateClick.BTN_X = true;
                else 
                    gamepadSupport.xboxControllerStateClick.BTN_X = false;
                
                gamepadSupport.xboxControllerStateLocked.BTN_X = false;
            }
            if (gamepadSupport.xboxControllerState.BTN_Y && !gamepadSupport.xboxControllerStateLocked.BTN_Y)
                gamepadSupport.xboxControllerStateLocked.BTN_Y = true;
            if (!gamepadSupport.xboxControllerState.BTN_Y) {
                if (gamepadSupport.xboxControllerStateLocked.BTN_Y) 
                    gamepadSupport.xboxControllerStateClick.BTN_Y = true;
                else 
                    gamepadSupport.xboxControllerStateClick.BTN_Y = false;
                
                gamepadSupport.xboxControllerStateLocked.BTN_Y = false;
            }
            if (gamepadSupport.xboxControllerState.BTN_UP && !gamepadSupport.xboxControllerStateLocked.BTN_UP)
                gamepadSupport.xboxControllerStateLocked.BTN_UP = true;
            if (!gamepadSupport.xboxControllerState.BTN_UP) {
                if (gamepadSupport.xboxControllerStateLocked.BTN_UP) 
                    gamepadSupport.xboxControllerStateClick.BTN_UP = true;
                else 
                    gamepadSupport.xboxControllerStateClick.BTN_UP = false;
                
                gamepadSupport.xboxControllerStateLocked.BTN_UP = false;
            }
            if (gamepadSupport.xboxControllerState.BTN_DOWN && !gamepadSupport.xboxControllerStateLocked.BTN_DOWN)
                gamepadSupport.xboxControllerStateLocked.BTN_DOWN = true;
            if (!gamepadSupport.xboxControllerState.BTN_DOWN) {
                if (gamepadSupport.xboxControllerStateLocked.BTN_DOWN) 
                    gamepadSupport.xboxControllerStateClick.BTN_DOWN = true;
                else 
                    gamepadSupport.xboxControllerStateClick.BTN_DOWN = false;
                
                gamepadSupport.xboxControllerStateLocked.BTN_DOWN = false;
            }
            if (gamepadSupport.xboxControllerState.BTN_LEFT && !gamepadSupport.xboxControllerStateLocked.BTN_LEFT)
                gamepadSupport.xboxControllerStateLocked.BTN_LEFT = true;
            if (!gamepadSupport.xboxControllerState.BTN_LEFT) {
                if (gamepadSupport.xboxControllerStateLocked.BTN_LEFT) 
                    gamepadSupport.xboxControllerStateClick.BTN_LEFT = true;
                else 
                    gamepadSupport.xboxControllerStateClick.BTN_LEFT = false;
                
                gamepadSupport.xboxControllerStateLocked.BTN_LEFT = false;
            }
            if (gamepadSupport.xboxControllerState.BTN_RIGHT && !gamepadSupport.xboxControllerStateLocked.BTN_RIGHT)
                gamepadSupport.xboxControllerStateLocked.BTN_RIGHT = true;
            if (!gamepadSupport.xboxControllerState.BTN_RIGHT) {
                if (gamepadSupport.xboxControllerStateLocked.BTN_RIGHT) 
                    gamepadSupport.xboxControllerStateClick.BTN_RIGHT = true;
                else 
                    gamepadSupport.xboxControllerStateClick.BTN_RIGHT = false;
                
                gamepadSupport.xboxControllerStateLocked.BTN_RIGHT = false;
            }

            
            if (gamepadSupport.xboxControllerState.BTN_START && !gamepadSupport.xboxControllerStateLocked.BTN_START)
                gamepadSupport.xboxControllerStateLocked.BTN_START = true;
            if (!gamepadSupport.xboxControllerState.BTN_START) {
                if (gamepadSupport.xboxControllerStateLocked.BTN_START) 
                    gamepadSupport.xboxControllerStateClick.BTN_START = true;
                else 
                    gamepadSupport.xboxControllerStateClick.BTN_START = false;
                
                gamepadSupport.xboxControllerStateLocked.BTN_START = false;
            }
            if (gamepadSupport.xboxControllerState.BTN_SELECT && !gamepadSupport.xboxControllerStateLocked.BTN_SELECT)
                gamepadSupport.xboxControllerStateLocked.BTN_SELECT = true;
            if (!gamepadSupport.xboxControllerState.BTN_SELECT) {
                if (gamepadSupport.xboxControllerStateLocked.BTN_SELECT) 
                    gamepadSupport.xboxControllerStateClick.BTN_SELECT = true;
                else 
                    gamepadSupport.xboxControllerStateClick.BTN_SELECT = false;
                
                gamepadSupport.xboxControllerStateLocked.BTN_SELECT = false;
            }

            if (gamepadSupport.xboxControllerState.SHOULDER_LEFT && !gamepadSupport.xboxControllerStateLocked.SHOULDER_LEFT)
                gamepadSupport.xboxControllerStateLocked.SHOULDER_LEFT = true;
            if (!gamepadSupport.xboxControllerState.SHOULDER_LEFT) {
                if (gamepadSupport.xboxControllerStateLocked.SHOULDER_LEFT) 
                    gamepadSupport.xboxControllerStateClick.SHOULDER_LEFT = true;
                else 
                    gamepadSupport.xboxControllerStateClick.SHOULDER_LEFT = false;
                
                gamepadSupport.xboxControllerStateLocked.SHOULDER_LEFT = false;
            }
            if (gamepadSupport.xboxControllerState.SHOULDER_RIGHT && !gamepadSupport.xboxControllerStateLocked.SHOULDER_RIGHT)
                gamepadSupport.xboxControllerStateLocked.SHOULDER_RIGHT = true;
            if (!gamepadSupport.xboxControllerState.SHOULDER_RIGHT) {
                if (gamepadSupport.xboxControllerStateLocked.SHOULDER_RIGHT) 
                    gamepadSupport.xboxControllerStateClick.SHOULDER_RIGHT = true;
                else 
                    gamepadSupport.xboxControllerStateClick.SHOULDER_RIGHT = false;
                
                gamepadSupport.xboxControllerStateLocked.SHOULDER_RIGHT = false;
            }
            if (gamepadSupport.xboxControllerState.STICK_LEFT_BTN && !gamepadSupport.xboxControllerStateLocked.STICK_LEFT_BTN)
                gamepadSupport.xboxControllerStateLocked.STICK_LEFT_BTN = true;
            if (!gamepadSupport.xboxControllerState.STICK_LEFT_BTN) {
                if (gamepadSupport.xboxControllerStateLocked.STICK_LEFT_BTN) 
                    gamepadSupport.xboxControllerStateClick.STICK_LEFT_BTN = true;
                else 
                    gamepadSupport.xboxControllerStateClick.STICK_LEFT_BTN = false;
                
                gamepadSupport.xboxControllerStateLocked.STICK_LEFT_BTN = false;
            }
            if (gamepadSupport.xboxControllerState.STICK_RIGHT_BTN && !gamepadSupport.xboxControllerStateLocked.STICK_RIGHT_BTN)
                gamepadSupport.xboxControllerStateLocked.STICK_RIGHT_BTN = true;
            if (!gamepadSupport.xboxControllerState.STICK_RIGHT_BTN) {
                if (gamepadSupport.xboxControllerStateLocked.STICK_RIGHT_BTN) 
                    gamepadSupport.xboxControllerStateClick.STICK_RIGHT_BTN = true;
                else 
                    gamepadSupport.xboxControllerStateClick.STICK_RIGHT_BTN = false;
                
                gamepadSupport.xboxControllerStateLocked.STICK_RIGHT_BTN = false;
            }
        }
    },
    xboxControllerState: {
        BTN_X: false,
        BTN_Y: false,
        BTN_A: false,
        BTN_B: false,
        BTN_DOWN: false,
        BTN_UP: false,
        BTN_LEFT: false,
        BTN_RIGHT: false,
        SHOULDER_LEFT: false,
        SHOULDER_RIGHT: false,
        TRIGGER_LEFT: 0,
        TRIGGER_RIGHT: 0,
        STICK_LEFT_X: 0,
        STICK_LEFT_Y: 0,
        STICK_LEFT_BTN: false,
        STICK_RIGHT_X: 0,
        STICK_RIGHT_Y: 0,
        STICK_RIGHT_BTN: false,
        BTN_START: false,
        BTN_SELECT: false
    },
    xboxControllerStatePrev: {
        BTN_X: false,
        BTN_Y: false,
        BTN_A: false,
        BTN_B: false,
        BTN_DOWN: false,
        BTN_UP: false,
        BTN_LEFT: false,
        BTN_RIGHT: false,
        SHOULDER_LEFT: false,
        SHOULDER_RIGHT: false,
        TRIGGER_LEFT: 0,
        TRIGGER_RIGHT: 0,
        STICK_LEFT_X: 0,
        STICK_LEFT_Y: 0,
        STICK_LEFT_BTN: false,
        STICK_RIGHT_X: 0,
        STICK_RIGHT_Y: 0,
        STICK_RIGHT_BTN: false,
        BTN_START: false,
        BTN_SELECT: false
    },
    xboxControllerStateClick: {
        BTN_X: false,
        BTN_Y: false,
        BTN_A: false,
        BTN_B: false,
        BTN_DOWN: false,
        BTN_UP: false,
        BTN_LEFT: false,
        BTN_RIGHT: false,
        SHOULDER_LEFT: false,
        SHOULDER_RIGHT: false,
        STICK_LEFT_BTN: false,
        STICK_RIGHT_BTN: false,
        BTN_START: false,
        BTN_SELECT: false
    },
    xboxControllerStateLocked: {
        BTN_X: false,
        BTN_Y: false,
        BTN_A: false,
        BTN_B: false,
        BTN_DOWN: false,
        BTN_UP: false,
        BTN_LEFT: false,
        BTN_RIGHT: false,
        SHOULDER_LEFT: false,
        SHOULDER_RIGHT: false,
        STICK_LEFT_BTN: false,
        STICK_RIGHT_BTN: false,
        BTN_START: false,
        BTN_SELECT: false
    }
};