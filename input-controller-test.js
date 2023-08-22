import {InputController} from './input-controller.js'

const ButtonKey = {
    "left": {
        keys: [65,37],
        enabled: true
    },
    "right": {
        keys: [68,39],
        enabled: true
    },
    "top": {
        keys: [87,38],
        enabled: true
    },
    "bottom": {
        keys: [83,40],
        enabled: true
    }

}

const jumpKey = {
    "jump": {
        keys: [32],
        enabled: true
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


const jump = () => {
    setTimeout(() => {
        y += 1
        target.style.top = `${y}%`;
        target.style.backgroundColor = 'black'
        inputController.disableAction('jump')
    }, 100)

    setTimeout(() => {
        inputController.enableAction('jump')
    }, 500)

    
    y -= 1;
    target.style.top = `${y}%`;
    target.style.backgroundColor = 'blue'
}

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
        jump()
    }
    window.requestAnimationFrame(move)
}

window.requestAnimationFrame(move);

