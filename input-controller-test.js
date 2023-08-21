import {InputController} from './input-controller.js'

const ButtonKey = {
    "left": {
        keys: [65,37],
        enabled: false
    },
    "right": {
        keys: [68,39],
        enabled: false
    },
    "top": {
        keys: [87,38],
        enabled: false
    },
    "bottom": {
        keys: [83,40],
        enabled: false
    }

}

const jumpKey = {
    "jump": {
        keys: [32],
        enabled: false
    }
}


const target = document.querySelector('.cube')

const inputController = new InputController(ButtonKey, target)
inputController.bindActions(jumpKey)

let x = 50
let y = 50




const attach = document.querySelector('.actived')
attach.onclick = () => {
    inputController.attach(target, false)
    console.log('active')
}

const detach = document.querySelector('.deactived')
detach.onclick = () => {
    inputController.detach()
    console.log('deactive')
}


document.addEventListener('keydown', (e) => {
    inputController.downKey(e)
});

document.addEventListener('keyup', (e) => {
    inputController.upKey(e)
});

    

   const move = () => {
    if (inputController.isActionActive('right')) {
        x += 0.2;
        target.style.left = `${x}%`;
    }
    if (inputController.isActionActive('left')) {
        x -= 0.2;
        target.style.left = `${x}%`;
    }
    if (inputController.isActionActive('top')) {
        y -= 0.2;
        target.style.top = `${y}%`;
    }
    if (inputController.isActionActive('bottom')) {
        y += 0.2;
        target.style.top = `${y}%`;
    }

    if (inputController.isActionActive('jump')) {

        setTimeout(() => {
            y += 1
            target.style.top = `${y}%`;
            target.style.backgroundColor = 'black'
        }, 200)

        /*if(inputController.isKeyPressed(32)) {
            inputController.disableAction('jump')
        }*/
        
        
        y -= 1;
        target.style.top = `${y}%`;
        target.style.backgroundColor = 'blue'
        
    }
    window.requestAnimationFrame(move)
}

window.requestAnimationFrame(move);

