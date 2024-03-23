let level1 = 1;

//scaling factors
let scalingFactorTile = 0.2;
let scalingFactorSprite = 0.17;
let scalingFactorKey = 0.11;
let scalingFactorChest = 0.18;
let scalingFactorBambooShoot = 0.4;

let scaledDownWhiteTileHeight = 0;
let scaledDownWhiteTileWidth = 0;
let firstAndLastTileData = [];
let gap = 10;
const screenWidth = document.getElementById('leftCanvas').offsetWidth - 1;
const screenHeight = document.getElementById('leftCanvas').offsetHeight - 1;

const canvas = document.getElementById('gameCanvas');
let canvasWidth = canvas.offsetWidth;
let canvasHeight = canvas.offsetHeight;
let testV = screenWidth > screenHeight ? screenHeight : screenWidth;

const renderer = PIXI.autoDetectRenderer({
  view: canvas,
  transparent: true
  // backgroundColor: 0xc8e6f0,
});

renderer.resize(testV, window.innerHeight);

console.log(renderer.view.height);
const stage = new PIXI.Container();

// textures
let tileWhite = undefined;
let tileGray = undefined;
let tileBlue = undefined
let tileMud = undefined;
let bambooShoot = undefined;
let baguBackView = undefined;
let baguFrontView = undefined;
let baguLeftView = undefined;
let baguRightView = undefined;
// key and chest
let keySprite = undefined;
let chestSprite = undefined;
// objects
let playerObject = undefined;
let goalObject = undefined;
let keyObject = undefined;
let keyObject2 = undefined;
let keyObject3 = undefined;
let chestObject = undefined;

// data
let levelsData = [];
let levelMainData = [];
let tilesData = {};
let spriteData = {};
let obstacleData = [];
let keyPositionData = [];
let multipleKeysArray = [];
let baguData = []

let currentPlayerRotationData = {
  rotation: undefined
}

let tileXOffset = undefined;
let tileYOffset = undefined;

const fetchData = async () => {
  await fetch('./assets/levels/levels.json')
    .then(async (resp) => {
      const ret = await resp.json();
      return ret;
    })
    .then((data) => {
      levelsData = data;
    });
  await fetch('./utils/tiles.json')
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      tilesData = data;
    });
  await fetch('./assets/levels/example.json')
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      levelMainData = data;
    });
  await fetch('./utils/spriteData.json')
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      spriteData = data;
    });
  await fetch('./utils/baguData.json')
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      baguData = data;
    });
};

const handleAngle = (angle) => {
  if (angle == -90 || angle == 270) {
    angle = 270;
  } else if (angle == -180 || angle == 180) {
    angle = 180;
  } else if (angle == -270 || angle == 90) {
    angle = 90;
  } else if (angle == 0 || angle == 360 || angle == -360) {
    angle = 0;
  }
  return angle;
};

const determineObstacleTile = (i, j) => {
  let incomingIndex = JSON.stringify([i, j]);
  let flag = false;
  obstacleData.forEach((element) => {
    let obstacleIndex = JSON.stringify(element);
    if (incomingIndex == obstacleIndex) {
      flag = true;
    }
  });
  return flag;
};

const open = () => {
  if (levelType == 'condition' || levelType == 'condition_obstacle') {
    let dx = Math.abs(playerObject.x - goalObject.x);
    let dy = Math.abs(playerObject.y - goalObject.y);

    if (isKeyTaken && dx < 30 && dy < 30) {
      stage.removeChild(goalObject);
      isOpen = true;
    } else {
      isOpen = false;
    }
  } else if (levelType == 'condition_level_with_multipleKeys') {
    let dx = Math.abs(playerObject.x - goalObject.x);
    let dy = Math.abs(playerObject.y - goalObject.y);

    if (isKeyTaken && dx < 30 && dy < 30) {
      stage.removeChild(goalObject);
      isOpen = true;
    } else {
      isOpen = false;
    }
  }
};

const use = () => {
  let dx = Math.abs(playerObject.x - keyObject.x);
  if (levelType == 'condition' || levelType == 'condition_obstacle') {
    let dy = Math.abs(playerObject.y - keyObject.y);
    // console.log(dx + ' : ' + dy);

    if (dx < 30 && dy < 30) {
      isKeyTaken = true;
      stage.removeChild(keyObject);
    }
  }
  if (levelType == 'condition_level_with_multipleKeys') {
    j =
      (playerObject.x - (tileXOffset + scaledDownWhiteTileWidth / 2)) /
      (scaledDownWhiteTileWidth + gap * scalingFactorTile);
    i =
      (playerObject.y - (tileYOffset + scaledDownWhiteTileHeight / 2)) /
      (scaledDownWhiteTileHeight + gap * scalingFactorTile);

    let dxK = Math.abs(playerObject.x - keyObject.x);
    let dyK = Math.abs(playerObject.y - keyObject.y);
    let dxK2 = Math.abs(playerObject.x - keyObject2.x);
    let dyK2 = Math.abs(playerObject.y - keyObject2.y);

    if (
      dxK < 30 &&
      dyK < 30 &&
      stage.children.indexOf(keyObject) !== -1 &&
      keyPositionData[0][0] == levelMainData[level - 1].keyPosition[0] &&
      keyPositionData[0][1] == levelMainData[level - 1].keyPosition[1]
    ) {
      if (multipleKeysArray.length != 0) {
        setTimeout(clearAll(), 500);
        Highlight();
        setTimeout(() => {
          endFunction();
        }, 1000);
      } else {
        multipleKeysArray.push('key1');
        stage.removeChild(keyObject);
      }
    } else if (
      dxK2 < 30 &&
      dyK2 < 30 &&
      stage.children.indexOf(keyObject2) !== -1 &&
      keyPositionData[1][0] == levelMainData[level - 1].keyPosition2[0] &&
      keyPositionData[1][1] == levelMainData[level - 1].keyPosition2[1]
    ) {
      if (multipleKeysArray.length != 1) {
        setTimeout(clearAll(), 500);
        Highlight();
        setTimeout(() => {
          endFunction();
        }, 1000);
      } else {
        multipleKeysArray.push('key2');
        stage.removeChild(keyObject2);
      }
    }
    if (levelMainData[level - 1].keyCount == 3) {
      let dxK3 = Math.abs(playerObject.x - keyObject3.x);
      let dyK3 = Math.abs(playerObject.y - keyObject3.y);
      if (
        dxK3 < 30 &&
        dyK3 < 30 &&
        stage.children.indexOf(keyObject3) !== -1 &&
        keyPositionData[2][0] == levelMainData[level - 1].keyPosition3[0] &&
        keyPositionData[2][1] == levelMainData[level - 1].keyPosition3[1]
      ) {
        if (multipleKeysArray.length != 2) {
          setTimeout(clearAll(), 500);
          Highlight();
          setTimeout(() => {
            endFunction();
          }, 1000);
        } else {
          multipleKeysArray.push('key3');
          stage.removeChild(keyObject3);
        }
      }
    }
    if (
      levelMainData[level - 1].keyCount == 3 &&
      multipleKeysArray.length == 3
    ) {
      isKeyTaken = true;
    } else if (
      levelMainData[level - 1].keyCount == 2 &&
      multipleKeysArray.length == 2
    ) {
      isKeyTaken = true;
    } else {
      isKeyTaken = false;
    }
  }
};

const forward = () => {
  if (firstAndLastTileData.length != 0) {
    const cond1 = playerObject.x < firstAndLastTileData[0].firstTile.x;
    // console.log('cond 1 : ' + cond1);
    const cond2 = playerObject.y < firstAndLastTileData[0].firstTile.y;
    const cond3 =
      playerObject.x >
      firstAndLastTileData[1].lastTile.x + scaledDownWhiteTileWidth;
    const cond4 =
      playerObject.y >
      firstAndLastTileData[1].lastTile.y + scaledDownWhiteTileHeight;
    if (cond1 || cond2 || cond3 || cond4) {
      // console.log('player out of range');
      clearAll();
      document.getElementById('walking').pause();
      document.getElementById('failed').play();
      document.getElementById('walking').play();
      modal();
      return;
    }
  }

  // angle is negated by sutracting from zero
  let angle = 0 - (currentPlayerRotationData.rotation * 180) / Math.PI;
  // console.log('angle : ' + angle);
  angle = handleAngle(angle);
  if (angle == 0) {
    playerObject.y += scaledDownWhiteTileHeight + gap * scalingFactorTile;
  } else if (angle == 90) {
    playerObject.x += scaledDownWhiteTileWidth + gap * scalingFactorTile;
  } else if (angle == 180) {
    playerObject.y -= scaledDownWhiteTileHeight + gap * scalingFactorTile;
  } else if (angle == 270) {
    playerObject.x -= scaledDownWhiteTileWidth + gap * scalingFactorTile;
  }
  if (levelType == 'walking_obstacle' || levelType == 'condition_obstacle') {
    j =
      (playerObject.x - (tileXOffset + scaledDownWhiteTileWidth / 2)) /
      (scaledDownWhiteTileWidth + gap * scalingFactorTile);
    i =
      (playerObject.y - (tileYOffset + scaledDownWhiteTileHeight / 2)) /
      (scaledDownWhiteTileHeight + gap * scalingFactorTile);
    if (determineObstacleTile(i, j)) {
      setTimeout(clearAll(), 500);
      Highlight();
      setTimeout(() => {
        endFunction();
      }, 1000);
    }
  }
};

//function for left turn
const left = () => {
  let angle = 0 - (currentPlayerRotationData.rotation * 180) / Math.PI;
  angle = handleAngle(angle + 90);
  currentPlayerRotationData.rotation = (-angle * Math.PI) / 180;
playerObject.texture = checkBaguRotationAndReturnTexture(angle)
};

//function for right turn
const right = () => {
  let angle = 0 - (currentPlayerRotationData.rotation * 180) / Math.PI;
  angle = handleAngle(angle - 90);
  currentPlayerRotationData.rotation = (-angle * Math.PI) / 180;
  playerObject.texture = checkBaguRotationAndReturnTexture(angle)
};

const addToStage = (obj) => {
  stage.addChild(obj);
};

const switchTile = (t) => {
  if (t == tileWhite) {
    return tileGray;
  } else {
    return tileWhite;
  }
};

const checkBaguRotationAndReturnTexture = (rotation) => {
  if(rotation == 90) {
    return baguRightView
  } else if (rotation == 180) {
    return baguBackView
  } else if (rotation == 270) {
    return baguLeftView
  } else {
    return baguFrontView
  }
}

const matrix = (level) => {
  // resetting variables
  firstAndLastTileData = [];
  obstacleData = [];
  multipleKeysArray = [];
  keyPositionData = [];
  isKeyTaken = false;
  isOpen = false;
  // setting level type
  levelType = levelMainData[level - 1].category;

  scaledDownWhiteTileHeight =
    tilesData.frames.tileWhite.frame.h * scalingFactorTile;
  scaledDownWhiteTileWidth =
    tilesData.frames.tileWhite.frame.w * scalingFactorTile;
  const row = levelMainData[level - 1].row;
  const col = levelMainData[level - 1].column;
  const playerPosition = levelMainData[level - 1].playerPosition;
  const goalPosition = levelMainData[level - 1].goalPosition;
  let rotation = levelMainData[level - 1].playerRotation[1];

  const totalTilesWidth =
    col * ((tilesData.frames.tileWhite.frame.w + gap) * scalingFactorTile);
  const totalTilesHeight =
    row * ((tilesData.frames.tileWhite.frame.h + gap) * scalingFactorTile);
  tileXOffset = (testV - totalTilesWidth) / 2;
  tileYOffset = (window.innerHeight - totalTilesHeight) / 2;
  // tileYOffset = 0


  if (window.innerWidth < 1200 && row >= 5) {
    tileXOffset = 30;
  }

  let playerObjectX = undefined;
  let playerObjectY = undefined;
  let goalX = undefined;
  let goalY = undefined;
  let keyX = undefined;
  let keyY = undefined;
  let rowFlag = undefined;
  let conditionWithMultipleKeysTileTexture = undefined;

  if (row % 2 == 0) {
    rowFlag = true;
  } else {
    rowFlag = false;
  }

  if (levelType == 'condition_level_with_multipleKeys') {
    if (levelMainData[level - 1].keyCount == 2) {
      keyPositionData.push(levelMainData[level - 1].keyPosition);
      keyPositionData.push(levelMainData[level - 1].keyPosition2);
    } else if (levelMainData[level - 1].keyCount == 3) {
      keyPositionData.push(levelMainData[level - 1].keyPosition);
      keyPositionData.push(levelMainData[level - 1].keyPosition2);
      keyPositionData.push(levelMainData[level - 1].keyPosition3);
    }
    conditionWithMultipleKeysTileTexture = key1Texture;
  }

  let tileTexture = tileGray;
  for (i = 0; i < row; ++i) {
    if (rowFlag && i != 0) {
      tileTexture = switchTile(tileTexture);
    }
    for (j = 0; j < col; ++j) {
      tile = new PIXI.Sprite(tileTexture);
      let tmpTileTexture = switchTile(tileTexture);
      if (
        levelType == 'walking_obstacle' ||
        levelType == 'condition_obstacle'
      ) {
        obstacleData = levelMainData[level - 1].obstacle;
        if (determineObstacleTile(i, j)) {
          tile.texture = tileMud;
        }
      } else if (levelType == 'condition_level_with_multipleKeys') {
        // console.log(i + ' : ' + j);
        if (JSON.stringify(keyPositionData).includes(JSON.stringify([i, j]))) {
          let keyInCollectionPosition = JSON.stringify(keyPositionData).indexOf(
            JSON.stringify([i, j])
          );
          // console.log(JSON.stringify(keyPositionData));
          if (keyInCollectionPosition == 1) {
            tile.texture = key1Texture;
          } else if (keyInCollectionPosition == 7) {
            tile.texture = key2Texture;
          } else if (keyInCollectionPosition == 13) {
            tile.texture = key3Texture;
          }
        }
      }
      tile.scale.x = scalingFactorTile;
      tile.scale.y = scalingFactorTile;
      tile.x =
        j * (tilesData.frames.tileWhite.frame.h + gap) * scalingFactorTile +
        tileXOffset;
      tile.y =
        i * (tilesData.frames.tileWhite.frame.w + gap) * scalingFactorTile +
        tileYOffset;
      if (i == 0 && j == 0) {
        firstAndLastTileData.push({
          firstTile: {
            x: tile.x,
            y: tile.y,
          },
        });
      } else if (i == row - 1 && j == col - 1) {
        firstAndLastTileData.push({
          lastTile: {
            x: tile.x,
            y: tile.y,
          },
        });
      }
      addToStage(tile);
      tileTexture = tmpTileTexture;
      if (i == playerPosition[0] && j == playerPosition[1]) {
        // point inside the tile is determined to which the sprite should be displayed
        playerObjectX =
          j * (scaledDownWhiteTileWidth + gap * scalingFactorTile) +
          (tileXOffset + scaledDownWhiteTileWidth / 2);
        playerObjectY =
          i * (scaledDownWhiteTileHeight + gap * scalingFactorTile) +
          (tileYOffset + scaledDownWhiteTileHeight / 2);
      }
      if (levelType == 'walking' || levelType == 'walking_obstacle') {
        if (i == goalPosition[0] && j == goalPosition[1]) {
          goalX =
            j * (scaledDownWhiteTileWidth + gap * scalingFactorTile) +
            (tileXOffset + scaledDownWhiteTileWidth / 2);
          goalY =
            i * (scaledDownWhiteTileHeight + gap * scalingFactorTile) +
            (tileYOffset + scaledDownWhiteTileHeight / 2);

          // creating the player sprite object. it is generated after making the tiles, so that its rendered on top
          goalObject = new PIXI.Sprite(bambooShoot);
          goalObject.scale.x = scalingFactorBambooShoot;
          goalObject.scale.y = scalingFactorBambooShoot;
          goalObject.anchor.set(0.5);
          goalObject.x = goalX;
          goalObject.y = goalY;
        }
      } else if (
        levelType == 'condition' ||
        levelType == 'condition_obstacle'
      ) {
        const keyPosition = levelMainData[level - 1].keyPosition;
        if (i == goalPosition[0] && j == goalPosition[1]) {
          goalX =
            j * (scaledDownWhiteTileWidth + gap * scalingFactorTile) +
            (tileXOffset + scaledDownWhiteTileWidth / 2);
          goalY =
            i * (scaledDownWhiteTileHeight + gap * scalingFactorTile) +
            (tileYOffset + scaledDownWhiteTileHeight / 2);

          // creating the player sprite object. it is generated after making the tiles, so that its rendered on top
          goalObject = new PIXI.Sprite(chestSprite);
          goalObject.scale.x = scalingFactorChest;
          goalObject.scale.y = scalingFactorChest;
          goalObject.anchor.set(0.5);
          goalObject.x = goalX;
          goalObject.y = goalY;
        }

        if (i == keyPosition[0] && j == keyPosition[1]) {
          keyX =
            j * (scaledDownWhiteTileWidth + gap * scalingFactorTile) +
            (tileXOffset + scaledDownWhiteTileWidth / 2);
          keyY =
            i * (scaledDownWhiteTileHeight + gap * scalingFactorTile) +
            (tileYOffset + scaledDownWhiteTileHeight / 2);

          // creating the player sprite object. it is generated after making the tiles, so that its rendered on top
          keyObject = new PIXI.Sprite(keySprite);
          keyObject.scale.x = scalingFactorKey;
          keyObject.scale.y = scalingFactorKey;
          keyObject.anchor.set(0.5);
          keyObject.x = keyX;
          keyObject.y = keyY;
        }
      } else if (levelType == 'condition_level_with_multipleKeys') {
        const keyPosition = levelMainData[level - 1].keyPosition;
        const keyPosition2 = levelMainData[level - 1].keyPosition2;

        if (i == goalPosition[0] && j == goalPosition[1]) {
          goalX =
            j * (scaledDownWhiteTileWidth + gap * scalingFactorTile) +
            (tileXOffset + scaledDownWhiteTileWidth / 2);
          goalY =
            i * (scaledDownWhiteTileHeight + gap * scalingFactorTile) +
            (tileYOffset + scaledDownWhiteTileHeight / 2);

          // creating the player sprite object. it is generated after making the tiles, so that its rendered on top
          goalObject = new PIXI.Sprite(chestSprite);
          goalObject.scale.x = scalingFactorChest;
          goalObject.scale.y = scalingFactorChest;
          goalObject.anchor.set(0.5);
          goalObject.x = goalX;
          goalObject.y = goalY;
        }

        if (i == keyPosition[0] && j == keyPosition[1]) {
          // console.log(i + ' : ' + j);
          keyX =
            j * (scaledDownWhiteTileWidth + gap * scalingFactorTile) +
            (tileXOffset + scaledDownWhiteTileWidth / 2);
          keyY =
            i * (scaledDownWhiteTileHeight + gap * scalingFactorTile) +
            (tileYOffset + scaledDownWhiteTileHeight / 2);

          // creating the player sprite object. it is generated after making the tiles, so that its rendered on top
          keyObject = new PIXI.Sprite(keySprite);
          keyObject.scale.x = scalingFactorKey;
          keyObject.scale.y = scalingFactorKey;
          keyObject.anchor.set(0.5);
          keyObject.x = keyX;
          keyObject.y = keyY;
        } else if (i == keyPosition2[0] && j == keyPosition2[1]) {
          // console.log(i + ' : ' + j);
          keyX =
            j * (scaledDownWhiteTileWidth + gap * scalingFactorTile) +
            (tileXOffset + scaledDownWhiteTileWidth / 2);
          keyY =
            i * (scaledDownWhiteTileHeight + gap * scalingFactorTile) +
            (tileYOffset + scaledDownWhiteTileHeight / 2);

          // creating the player sprite object. it is generated after making the tiles, so that its rendered on top
          keyObject2 = new PIXI.Sprite(keySprite);
          keyObject2.scale.x = scalingFactorKey;
          keyObject2.scale.y = scalingFactorKey;
          keyObject2.anchor.set(0.5);
          keyObject2.x = keyX;
          keyObject2.y = keyY;
        }
        if (keyPositionData.length == 3) {
          const keyPosition3 = levelMainData[level - 1].keyPosition3;
          if (i == keyPosition3[0] && j == keyPosition3[1]) {
            // console.log(i + ' : ' + j);
            keyX =
              j * (scaledDownWhiteTileWidth + gap * scalingFactorTile) +
              (tileXOffset + scaledDownWhiteTileWidth / 2);
            keyY =
              i * (scaledDownWhiteTileHeight + gap * scalingFactorTile) +
              (tileYOffset + scaledDownWhiteTileHeight / 2);

            // creating the player sprite object. it is generated after making the tiles, so that its rendered on top
            keyObject3 = new PIXI.Sprite(keySprite);
            keyObject3.scale.x = scalingFactorKey;
            keyObject3.scale.y = scalingFactorKey;
            keyObject3.anchor.set(0.5);
            keyObject3.x = keyX;
            keyObject3.y = keyY;
          }
        }
      }
    }
  }

  // creating the player sprite object. it is generated after making the tiles, so that its rendered on top
  playerObject = new PIXI.Sprite(baguFrontView);
  playerObject.scale.x = scalingFactorSprite;
  playerObject.scale.y = scalingFactorSprite;
  playerObject.anchor.set(0.5);
  // rotation is negated because in pixijs rotation is in clockwise direction
  // playerObject.rotation = (-rotation * Math.PI) / 180;
  currentPlayerRotationData.rotation = (-rotation * Math.PI) / 180;
  playerObject.texture = checkBaguRotationAndReturnTexture(rotation)
  playerObject.x = playerObjectX;
  playerObject.y = playerObjectY;

  if (levelType == 'condition' || levelType == 'condition_obstacle') {
    addToStage(keyObject);
  } else if (levelType == 'condition_level_with_multipleKeys') {
    addToStage(keyObject);
    addToStage(keyObject2);
    keyPositionData.length == 3 ? addToStage(keyObject3) : null;
  }
  addToStage(goalObject);
  addToStage(playerObject);
};

const setLevel = (level) => {
  stage.removeChildren();
  // Create textures for each tile
  matrix(level);
};

const setup = async () => {
  // FETCH_LEVELS
  // fetching and setting levels
  await fetchData();
  PIXI.Loader.shared
    .add('tileSheet', './images/tiles.png')
    .add('spriteDataSheet', './images/spriteImages.png')
    .add('baguDataSheet', './images/baguImages.png')
    .add('tileBlueSheet', './images/blueTile.png')
    .load((loader, resources) => {
      let tileSheet = resources.tileSheet.texture;
      let spriteDataSheet = resources.spriteDataSheet.texture;
      let baguDataSheet = resources.baguDataSheet.texture;
      let tileBlueSheet = resources.tileBlueSheet.texture;
      // TEXTURE_CREATION
      // creating texture for white tile
      tileWhite = new PIXI.Texture(
        tileSheet,
        new PIXI.Rectangle(
          tilesData.frames.tileWhite.frame.x,
          tilesData.frames.tileWhite.frame.y,
          tilesData.frames.tileWhite.frame.w,
          tilesData.frames.tileWhite.frame.h
        )
      );
      // creating texture for black tile
      tileGray = new PIXI.Texture(
        tileBlueSheet,
        new PIXI.Rectangle(
          tilesData.frames.tileBlue.frame.x,
          tilesData.frames.tileBlue.frame.y,
          tilesData.frames.tileBlue.frame.w,
          tilesData.frames.tileBlue.frame.h
        )
      );
      // creating texture for mud tile
      tileMud = new PIXI.Texture(
        tileSheet,
        new PIXI.Rectangle(
          tilesData.frames.tileMud.frame.x,
          tilesData.frames.tileMud.frame.y,
          tilesData.frames.tileMud.frame.w,
          tilesData.frames.tileMud.frame.h
        )
      );
      // creating texture for bamboo shoot
      bambooShoot = new PIXI.Texture(
        spriteDataSheet,
        new PIXI.Rectangle(
          spriteData.frames.bambooShoot.frame.x,
          spriteData.frames.bambooShoot.frame.y,
          spriteData.frames.bambooShoot.frame.w,
          spriteData.frames.bambooShoot.frame.h
        )
      );
      // creating texture for bear
      baguBackView = new PIXI.Texture(
        baguDataSheet,
        new PIXI.Rectangle(
          baguData.frames.back.frame.x,
          baguData.frames.back.frame.y,
          baguData.frames.back.frame.w,
          baguData.frames.back.frame.h
        )
      );

      baguFrontView = new PIXI.Texture(
        baguDataSheet,
        new PIXI.Rectangle(
          baguData.frames.front.frame.x,
          baguData.frames.front.frame.y,
          baguData.frames.front.frame.w,
          baguData.frames.front.frame.h
        )
      );

      baguLeftView = new PIXI.Texture(
        baguDataSheet,
        new PIXI.Rectangle(
          baguData.frames.left.frame.x,
          baguData.frames.left.frame.y,
          baguData.frames.left.frame.w,
          baguData.frames.left.frame.h
        )
      );

      baguRightView = new PIXI.Texture(
        baguDataSheet,
        new PIXI.Rectangle(
          baguData.frames.right.frame.x,
          baguData.frames.right.frame.y,
          baguData.frames.right.frame.w,
          baguData.frames.right.frame.h
        )
      );
      
      // creating texture for key
      keySprite = new PIXI.Texture(
        spriteDataSheet,
        new PIXI.Rectangle(
          spriteData.frames.key.frame.x,
          spriteData.frames.key.frame.y,
          spriteData.frames.key.frame.w,
          spriteData.frames.key.frame.h
        )
      );
      // creating texture for bamboo shoot
      key1Texture = new PIXI.Texture(
        tileSheet,
        new PIXI.Rectangle(
          tilesData.frames.key1Texture.frame.x,
          tilesData.frames.key1Texture.frame.y,
          tilesData.frames.key1Texture.frame.w,
          tilesData.frames.key1Texture.frame.h
        )
      );
      // creating texture for bamboo shoot
      key2Texture = new PIXI.Texture(
        tileSheet,
        new PIXI.Rectangle(
          tilesData.frames.key2Texture.frame.x,
          tilesData.frames.key2Texture.frame.y,
          tilesData.frames.key2Texture.frame.w,
          tilesData.frames.key2Texture.frame.h
        )
      );
      // creating texture for bamboo shoot
      key3Texture = new PIXI.Texture(
        tileSheet,
        new PIXI.Rectangle(
          tilesData.frames.key3Texture.frame.x,
          tilesData.frames.key3Texture.frame.y,
          tilesData.frames.key3Texture.frame.w,
          tilesData.frames.key3Texture.frame.h
        )
      );
      // creating texture for chest
      chestSprite = new PIXI.Texture(
        spriteDataSheet,
        new PIXI.Rectangle(
          spriteData.frames.chest.frame.x,
          spriteData.frames.chest.frame.y,
          spriteData.frames.chest.frame.w,
          spriteData.frames.chest.frame.h
        )
      );
      const level = getCookie('level');
      setLevel(level);
    });
};

// Start the game loop
const gameLoop = () => {
  // Render the stage
  renderer.render(stage);
  // Request another animation frame
  requestAnimationFrame(gameLoop);

  if (levelComplete) {
    level = getCookie('level');
    levelComplete = false;
    setLevel(level);
  }
};

// document.addEventListener('keydown', (event) => {
//   if (event.keyCode === 37) {
//     // Move left
//     playerObject.x += 100;
//   } else if (event.keyCode === 39) {
//     // Move right
//   } else if (event.keyCode === 38) {
//     // Move up
//   } else if (event.keyCode === 40) {
//     // Move down
//   }
// });

setup();
gameLoop();
