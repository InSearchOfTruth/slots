let canvas = document.createElement('canvas');
let canvasWrapper = document.getElementById('canvas-wrapper')
let autospin = document.getElementById('autospin-switch')
let gameStart = document.getElementById('game-start')
let requestAnimationFrame =  window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             window.oRequestAnimationFrame ||
             window.msRequestAnimationFrame ||
             function (callback) {
                     window.setTimeout(callback, 1000 / 60);
             };

window.requestAnimationFrame = requestAnimationFrame;

//Общие игровые параметры
let gameParams = {
    slots: {
        plum:{
            'src'   : 'assets/img/lots/слива.png',
            'type'  : 'plum'
        },
        apple:{
            'src'   : 'assets/img/lots/яблоко.png',
            'type'  : 'apple'
        },
        pear:{
            'src'   : 'assets/img/lots/груша.png',
            'type'  : 'pear'
        },
        grapes:{
            'src'   : 'assets/img/lots/виноград.png',
            'type'  : 'grapes'
        },
        cherry:{
            'src'   : 'assets/img/lots/вишня.png',
            'type'  : 'cherry'
        },
        watermelon:{
            'src'   : 'assets/img/lots/арбуз.png',
            'type'  : 'watermelon'
        },
        pineapple:{
            'src'   : 'assets/img/lots/ананас.png',
            'type'  : 'pineapple'
        },
        lemon:{
            'src'   : 'assets/img/lots/лимон.png',
            'type'  : 'lemon'
        },
        coconut:{
            'src'   : 'assets/img/lots/кокос.png',
            'type'  : 'coconut'
        }
    },
    slotHeight: 104,
    slotWidth:  130,
    gameColumns: 3,
    gameDelay: 3000

}
canvas.setAttribute('width', gameParams.slotWidth*gameParams.gameColumns)
canvas.setAttribute('height', gameParams.slotHeight*3)
canvasWrapper.appendChild(canvas)
canvasContext = canvas.getContext('2d')
// подгружаем изображение
function loadImage(path,width,height,y,type){
    let image = document.createElement('img');
    let result = {
        dom: image,
        width: width,
        height: height,
        loaded: false,
        y: (gameParams.slotHeight*2)-y,
        type: type
    }
    image.onload = function(){
        result.loaded = true;
    }
    image.src = path;
    return result;
}
///////////////////////////////////////////////
let gameColumn = function(slots,number){
    this.slots = slots
    this.number = number
}
gameColumn.prototype = {
    actions: function(speed){
        this.move(speed)
    },
    move: function(speed){
        let column = this.slots
        for(slot of column){
            //console.log(slot.y+speed, speed, slot.y+speed+slot.height)
            slot.y = slot.y+speed
            
            if(slot.y> slot.height*3){
                let dist = slot.y - slot.height*3
                slot.y = (slot.height*3)-(slot.height*9)+dist
            }
        }
    },
    stop: function(){
        let column = this.slots
        //console.log(this)
        gameColumnStopRotation(column)
    }
}
let gameColumnStopRotation = function(column){
    let slotsY = []
    for(slot of column){
        slotsY.push(slot.y)
    }
    let maxY = Math.max.apply(null,slotsY)
    let startPosition = (gameParams.slotHeight*2)
    let distanceToPosition = maxY -  startPosition
    for(slot of column){
        //console.log(slot,slot.y,slot.y/slot.height)
        slot.y = Math.floor(slot.y/slot.height)*slot.height
        
    }
}
let gameSlotsCombine = function(slots){
    let gameSlotsArr = []
    for(let key in slots){
        gameSlotsArr.push(slots[key])
    }
    //gameSlotsArr.sort(compareRandom)
    return gameSlotsArr
}
let gameSlots = gameSlotsCombine(gameParams.slots)
let createGameField = function(slots){
    let gameField = []
    let numb = 0
    
    for(let i=0; i<gameParams.gameColumns; i++){
        let slotY = 0
        let slotColumnArr = [];
        slots.sort(compareRandom)
        for(let key in slots){
            let slot = loadImage(slots[key].src,gameParams.slotWidth,gameParams.slotHeight,slotY,slots[key].type)
            slotColumnArr.push(slot)
            slotY= slotY+gameParams.slotHeight
        }  
        slotColumnArr.sort(compareRandom)
        slotColumn = new gameColumn(slotColumnArr,numb)
        numb++
        gameField.push(slotColumn)

    }
    
    return gameField
    
}
let gameField = createGameField(gameSlots)

function compareRandom(a, b) {
    return Math.random() - 0.5;     
}
let drawGameField = function(gameField){
    canvasContext.clearRect(0,0,2000,2000)
    let columnX = 0
   for(column in gameField){
       for(let slot of gameField[column].slots){
            canvasContext.drawImage(slot.dom,columnX,slot.y,slot.width,slot.height)
       }
       columnX = columnX + gameParams.slotWidth
   }
}
drawGameField(gameField)


///////////////////////////////////////////


let rotateGameField = function(gameFields,dy){
    
    for(let key in gameFields){
        let speed = dy
        gameFields[key].actions(dy)
    }
   
    return gameFields
}

window.onload = function(){
    drawGameField(gameField)
}

gameStart.onclick = function(){
    gameRotate()
}

let rotate = false
let gameRotate = function(){
    if(!rotate){
        //gameField = createGameField(gameSlots)
        rotate = true
        let timeDelay = gameParams.gameDelay
        let speedRotate = 20
        for(let i = 0; i<gameField.length; i++){
            
            columnTimeDelay = ((timeDelay/gameField.length)*(i+1))-10
            gameField[i].actions = function(){this.move(speedRotate+i*2)}
            setTimeout(function(){
                gameField[i].actions = function(){}
                gameField[i].stop()
            },columnTimeDelay)
            
        }
        
        gameLoop()
        setTimeout(function(){
            
            checkWin()
        },timeDelay+100)
    }
    
    
}
let checkWin = function(){
    let slotsType = []
    for(let i = 0; i<gameField.length; i++){
        for(slot of gameField[i].slots){
            if(slot.y == slot.height){
                //console.log(slot.type)
                slotsType.push(slot.type)
            }
        }
    }
    let equalTypes 
    function compareTypes(el){
        return el === slotsType[0]
    }

    for(let k=0; k<1; k++){
        
        equalTypes = slotsType.every(compareTypes)
    }
   if(equalTypes){
       alert('you win')
       rotate = false
   }else{
        rotate = false
   }
}
let gameLoop = function(){
    if(!rotate) return
    gameField = rotateGameField(gameField)
    drawGameField(gameField)
    requestAnimationFrame(gameLoop)
}


let autospinStart = function(){
    if(autospin.checked){
        gameRotate()
        setTimeout(function(){
            autospinStart()
        },gameParams.gameDelay+500)
    }
}

