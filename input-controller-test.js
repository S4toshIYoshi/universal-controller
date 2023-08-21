import {InputController} from './input-controller.js'

const ButtonKey = {
    "left": {
        keys: 65,
        enabled: false
    },
    "right": {
        keys: 68,
        enabled: false
    },
    "top": {
        keys: 87,
        enabled: false
    },
    "bottom": {
        keys: 83,
        enabled: false
    }

}


const target = document.querySelector('.cube')

const inputController = new InputController(ButtonKey, target)
inputController.bindActions(ButtonKey)

let x = 50
let y = 50

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
    window.requestAnimationFrame(move)
}

window.requestAnimationFrame(move);


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
    for(let key in inputController.actionsToBind) {
        if(inputController.actionsToBind[`${key}`].keys == e.keyCode) {
            inputController.enableAction(key)
            console.log(inputController.actionsToBind[`${key}`].enabled )
        }
    }
});

document.addEventListener('keyup', (e) => {
    for(let key in inputController.actionsToBind) {
        if(inputController.actionsToBind[`${key}`].keys == e.keyCode) {
            inputController.disableAction(key)
            console.log(inputController.actionsToBind[`${key}`].enabled)
        }
    }
});

    

   
    //console.log(e.keyCode)

