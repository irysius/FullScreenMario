/* Upkeep.js */
// Contains functions associated with the upkeep

var prevLeft = false;
var prevRight = false;
var prevCrouch = false;
var prevJump = false;
var prevSprint = false;

function upkeep() {
  if(window.paused) return;
  // window.nextupk = requestAnimationFrame(upkeep);
  window.nextupk = setTimeout(upkeep, timer);

  if (gamepadSupport.available){
      gamepadSupport.tick();
      var xleft = gamepadSupport.xboxControllerState.BTN_LEFT || gamepadSupport.xboxControllerState.STICK_LEFT_X < -0.5;
      var xright = gamepadSupport.xboxControllerState.BTN_RIGHT || gamepadSupport.xboxControllerState.STICK_LEFT_X > 0.5;
      //var xjump = gamepadSupport.xboxControllerState.BTN_B || gamepadSupport.xboxControllerState.BTN_X;
      var xjump = gamepadSupport.xboxControllerState.BTN_A;
      var xcrouch = gamepadSupport.xboxControllerState.TRIGGER_LEFT > 0.5 || gamepadSupport.xboxControllerState.STICK_LEFT_Y > 0.5 || gamepadSupport.xboxControllerState.BTN_DOWN;
      //var xsprint = gamepadSupport.xboxControllerState.TRIGGER_RIGHT > 0.5 || gamepadSupport.xboxControllerState.BTN_A;
      var xsprint = gamepadSupport.xboxControllerState.TRIGGER_RIGHT > 0.5 || gamepadSupport.xboxControllerState.BTN_B;
      // something weird about the update loop is preventing me from pausing correctly.
      //var xpause = gamepadSupport.xboxControllerState.BTN_START;

      if (xjump && !prevJump){
          prevJump = true;
          keydown(38);
      }
      if (!xjump && prevJump){
          prevJump = false;
          keyup(38);
      }

      if (xcrouch && !prevCrouch){
          prevCrouch = true;
          keydown(40);
      }
      if (!xcrouch && prevCrouch){
          prevCrouch = false;
          keyup(40);
      }

      
      if (xleft && !prevLeft) {
          prevLeft = true;
          keydown(37);
      }
      if (!xleft && prevLeft) {
          prevLeft = false;
          keyup(37);
      }

      if (xright && !prevRight) {
          prevRight = true;
          keydown(39);
      }
      if (!xright && prevRight) {
          prevRight = false;
          keyup(39);
      }


      if (xsprint && !prevSprint) {
          prevSprint = true;
          keydown(16);
      }
      if (!xsprint && prevSprint) {
          prevSprint = false;
          keyup(16);
      }

      //if (xpause && !prevPause){
      //    prevPause = true;
      //    console.log('pause down');
      //    keydown(80);
      //}
      //if (!xpause && prevPause){
      //    prevPause = false;
      //    console.log('pause up');
      //    keyup(80);
      //}
  }
  
  // Adjust for differences in performance
  adjustFPS();
  
  // Quadrants upkeep
  determineAllQuadrants();
  
  // Solids upkeep
  maintainSolids();
  
  // Character upkeep
  maintainCharacters();
  
  // Mario specific
  maintainMario();
  
  // Texts upkeep, if there are any
  if(texts.length) maintainTexts();
  
  // Events upkeep
  handleEvents();
  
  refillCanvas();
}

function adjustFPS() {
  window.time_now = now();
  var time_diff = time_now - time_prev,
      fps_actual = roundDigit(1000 / time_diff, .001);
  
  window.fps = roundDigit((.7 * fps) + (.3 * fps_actual), .01);
  window.realtime = fps_target / fps;
  
  window.time_prev = time_now;
}

function pause(big) {
  if(paused && !window.nextupk) return;
  cancelAnimationFrame(nextupk);
  pauseAllSounds();
  paused = true;
  if(big) play("Pause.wav");
}

function unpause() {
  if(!paused) return;
  window.nextupk = requestAnimationFrame(upkeep);
  paused = false;
  resumeAllSounds();
}


// Solids by themselves don't really do much
function maintainSolids(update) {
  for(var i = 0, solid; i < solids.length; ++i) {
    solid = solids[i];
    if(solid.alive) {
      if(solid.movement) solid.movement(solid);
    }
    if(!solid.alive || solid.right < quads.delx)
      deleteThing(solid, solids, i);
  }
}

function maintainCharacters(update) {
  var delx = gamescreen.right + quads.rightdiff,
      character, i;
  for(i = 0; i < characters.length; ++i) {
    character = characters[i];
    // Gravity
    if(!character.resting) {
      if(!character.nofall) character.yvel += character.gravity || map.gravity;
      character.yvel = min(character.yvel, map.maxyvel);
    } else character.yvel = 0;
    
    // Position updating and collision detection
    updatePosition(character);
    determineThingQuadrants(character);
    character.under = character.undermid = false;
    determineThingCollisions(character);
    
    // Resting tests
    if(character.resting) {
      if(!characterOnResting(character, character.resting)) {
        character.resting = false; // Necessary for moving platforms :(
      } else {
        /*character.jumping = */character.yvel = false;
        setBottom(character, character.resting.top);
      }
    }
    
    // Movement or deletion
    // To do: rethink this...
    //// Good for performance if gamescreen.bottom - gamescreen.top is saved in screen and updated on shift
    // To do: is map.shifting needed?
    if(character.alive) {
      if(character.type != "mario" && !map.shifting && 
          (character.numquads == 0 || character.left > delx) && !character.outerok) {
          // (character.top > gamescreen.bottom - gamescreen.top || character.left < + quads.width * -1)) {
        deleteThing(character, characters, i);
      }
      else {
        if(!character.nomove && character.movement)
          character.movement(character);
        // if(update) updateDisplay(character);
      }
    }
    else if(!map.shifting) deleteThing(character, characters, i);
    
  }
}

function maintainMario(update) {
  if(!mario.alive) return;
  
  // Mario is falling
  if(mario.yvel > 0) {
    if(!map.underwater) mario.keys.jump = 0;
    // Jumping?
    if(!mario.jumping) {
      // Paddling? (from falling off a solid)
      if(map.underwater) {
        if(!mario.paddling) {
          switchClass(mario, "paddling", "paddling");
          mario.padding = true;
        }
      }
      else {
        addClass(mario, "jumping");
        mario.jumping = true;
      }
    }
    // Mario has fallen too far
    if(!mario.piping && !mario.dying && mario.top > gamescreen.deathheight) {
      // If the map has an exit loc (cloud world), transport there
      if(map.exitloc) {
        // Random maps will pretend he died
        if(map.random) {
          goToTransport(["Random", "Overworld", "Down"]);
          marioDropsIn();
          return;
        }
        // Otherwise just shift to the location
        return shiftToLocation(map.exitloc);
      }
      // Otherwise, since Mario is below the gamescreen, kill him dead
      clearMarioStats();
      killMario(mario, 2);
    }
  }
  
  // Mario is moving to the right
  if(mario.xvel > 0) {
    if(mario.right > gamescreen.middlex) {
      // If Mario is to the right of the gamescreen's middle, move the gamescreen
      if(mario.right > gamescreen.right - gamescreen.left)
        mario.xvel = min(0, mario.xvel);
    }
  }
  // Mario is moving to the left
  else if(mario.left < 0) {
    // Stop Mario from going to the left.
    mario.xvel = max(0, mario.xvel);
  }
  
  // Mario is hitting something (stop jumping)
  if(mario.under) mario.jumpcount = 0;
  
  // Scrolloffset is how far over the middle mario's right is
  // It's multiplied by 0 or 1 for map.canscroll
  window.scrolloffset = (map.canscroll/* || (map.random && !map.noscroll)*/) * (mario.right - gamescreen.middlex);
  if(scrolloffset > 0 && !map.shifting) {
    scrollWindow(lastscroll = round(min(mario.scrollspeed, scrolloffset)));
  }
  else lastscroll = 0;
}

// Deletion checking is done by an interval set in shiftToLocation
// This simply does velocity
function maintainTexts() {
  var element, me, i;
  for(i = texts.length - 1; i >= 0; --i) {
    me = texts[i];
    element = me.element || me;
    if(me.xvel) elementShiftLeft(element, me.xvel);
    if(me.yvel) elementShiftTop(element, me.yvel);
  }
}