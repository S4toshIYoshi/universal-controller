import {InputController} from './input-controller.js'

const ButtonKey = {
  left: {
    keys: [65, 37],
    enabled: true,
  },
  right: {
    keys: [68, 39],
    enabled: true,
  },
  top: {
    keys: [87, 38],
    enabled: true,
  },
  bottom: {
    keys: [83, 40],
    enabled: true,
  },
}

const jumpKey = {
  jump: {
    keys: [32],
    enabled: true,
  },
}

const target = document.querySelector('.cube')

const inputController = new InputController(ButtonKey)

const setting = {
  x: 50,
  y: 50,
  speed: 1, // в процентах относительно экрана
  color: 'black',
  jump: {
    hightJump: 1, // в процентах относительно экрана
    cooldown: 1, //в секундах
    timeInJump: 0.2, //в секундах
    color: 'blue',
  },
}

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

const activeController = document.querySelector('.activeController')
activeController.onclick = () => {
  inputController.enabled = true
}

const deactiveController = document.querySelector('.deactiveController')
deactiveController.onclick = () => {
  inputController.enabled = false
}

const menuActionActive = document.getElementById('actionActive')
const menuActionDeactive = document.getElementById('actionDeactive')
const menuFocus = document.getElementById('focused')

const bind = document.querySelector('.bind')
bind.onclick = e => {
  e.preventDefault()

  inputController.bindActions(jumpKey)
  const newObj = document.createElement('li')
  newObj.innerText = 'jump'

  if (
    menuActionActive.children[menuActionActive.children.length - 1]
      .innerText !== 'jump'
  ) {
    menuActionActive.append(newObj)
  }

  if (
    menuActionDeactive.children[menuActionDeactive.children.length - 1]
      .innerText !== 'jump'
  ) {
    menuActionDeactive.append(newObj)
  }
}

const jump = () => {
  setTimeout(() => {
    setting.y += setting.jump.hightJump
    target.style.top = `${setting.y}%`
    target.style.backgroundColor = setting.color
    inputController.disableAction('jump')
  }, setting.jump.timeInJump * 1000)

  setTimeout(() => {
    inputController.enableAction('jump')
  }, setting.jump.cooldown * 1000)

  setting.y -= setting.jump.hightJump

  target.style.top = `${setting.y}%`
  target.style.backgroundColor = setting.jump.color
}

const restrictions = (top, left) => {
  function ifelse(value, action) {
    if (value) {
      inputController.disableAction(action)
    } else {
      inputController.enableAction(action)
    }
  }

  ifelse(top < 0, 'top')
  ifelse(top > 80, 'bottom')
  ifelse(left < 0, 'left')
  ifelse(left > 83, 'right')
}

const move = () => {
  restrictions(parseInt(target.style.top), parseInt(target.style.left))

  if (inputController.isActionActive('right')) {
    setting.x += setting.speed
    target.style.left = `${setting.x}%`
  }
  if (inputController.isActionActive('left')) {
    setting.x -= setting.speed
    target.style.left = `${setting.x}%`
  }
  if (inputController.isActionActive('top')) {
    setting.y -= setting.speed
    target.style.top = `${setting.y}%`
  }
  if (inputController.isActionActive('bottom')) {
    setting.y += setting.speed
    target.style.top = `${setting.y}%`
  }
  if (inputController.actionsToBind['jump']) {
    if (inputController.isActionActive('jump')) {
      jump()
    }
  }

  for (let i = 0; i < menuActionActive.children.length; i++) {
    if (inputController.activity.has(menuActionActive.children[i].innerText)) {
      menuActionActive.children[i].classList.add('green')
    } else {
      menuActionActive.children[i].classList.remove('green')
    }
  }

  for (let i = 0; i < menuActionDeactive.children.length; i++) {
    if (
      inputController.deactivity.has(menuActionDeactive.children[i].innerText)
    ) {
      menuActionDeactive.children[i].classList.add('green')
    } else {
      menuActionDeactive.children[i].classList.remove('green')
    }
  }

  menuFocus.innerText = inputController.isFocus()

  window.requestAnimationFrame(move)
}

window.requestAnimationFrame(move)
