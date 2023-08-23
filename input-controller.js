export class Mouse {
  activity
  deactivity

  constructor(actionsToBind) {
    this.actionsToBind = actionsToBind

    this.pressButton = {}

    this.handlerUpKey = this.upKey.bind(this)
    this.handlerDownKey = this.downKey.bind(this)

    this.allBindKey = new Map()
    this.filingMap(this.actionsToBind)

    this.succsesKey = false

    this.activity = new Set()
    this.deactivity = new Set()

    this.actionActivated = null
    this.actionDeactivated = null
  }

  initEvents(...events) {
    const [actionActivated, actionDeactivated] = events
    this.actionActivated = actionActivated
    this.actionDeactivated = actionDeactivated
  }

  filingMap(bind) {
    if (bind) {
      for (let key in bind) {
        this.actionsToBind[key].mouse.forEach(el =>
          this.allBindKey.set(el, key)
        )
      }
      console.log(this.pressButton)
    }
  }

  updateMap(newBind) {
    this.allBindKey.clear()
    this.filingMap(newBind)
  }

  searchKey(keyCode) {
    if (this.allBindKey.has(keyCode)) {
      this.succsesKey = true
    } else {
      this.succsesKey = false
    }
  }

  upKey(e) {
    let action = this.allBindKey.get(e.which)

    this.activity.clear

    delete this.pressButton[e.which]
    if (this.succsesKey && !this.deactivity.has(action)) {
      this.activity.delete(action)
      this.deactivity.add(action)
      document.dispatchEvent(this.actionDeactivated)
    }
  }

  downKey(e) {
    let action = this.allBindKey.get(e.which)

    this.pressButton[e.which] = e.which

    this.searchKey(e.which)
    if (this.succsesKey && !this.activity.has(action)) {
      this.deactivity.delete(action)
      this.activity.add(action)
      document.dispatchEvent(this.actionActivated)
    }
  }

  listener(show) {
    if (show) {
      document.addEventListener('mousedown', this.handlerDownKey)
      document.addEventListener('mouseup', this.handlerUpKey)
    } else {
      document.removeEventListener('mousedown', this.handlerDownKey)
      document.removeEventListener('mouseup', this.handlerUpKey)
    }
  }

  buttonsActive(keyCode) {
    return (
      this.pressButton.hasOwnProperty(keyCode) && !!this.allBindKey.get(keyCode)
    )
  }
}

export class KeyBoard {
  activity
  deactivity

  constructor(actionsToBind) {
    this.actionsToBind = actionsToBind

    this.pressButton = {}

    this.handlerUpKey = this.upKey.bind(this)
    this.handlerDownKey = this.downKey.bind(this)

    this.allBindKey = new Map()
    this.filingMap(this.actionsToBind)

    this.succsesKey = false

    this.activity = new Set()
    this.deactivity = new Set()

    this.actionActivated = null
    this.actionDeactivated = null
  }

  initEvents(...events) {
    const [actionActivated, actionDeactivated] = events
    this.actionActivated = actionActivated
    this.actionDeactivated = actionDeactivated
  }

  filingMap(bind) {
    if (bind) {
      for (let key in bind) {
        this.actionsToBind[key].keys.forEach(el => this.allBindKey.set(el, key))
      }
    }
  }

  updateMap(newBind) {
    this.allBindKey.clear()
    this.filingMap(newBind)
  }

  searchKey(keyCode) {
    if (this.allBindKey.has(keyCode)) {
      this.succsesKey = true
    } else {
      this.succsesKey = false
    }
  }

  upKey(e) {
    let action = this.allBindKey.get(e.keyCode)

    this.activity.clear()

    delete this.pressButton[e.keyCode]
    if (this.succsesKey && !this.deactivity.has(action)) {
      this.activity.delete(action)
      this.deactivity.add(action)
      document.dispatchEvent(this.actionDeactivated)
    }
  }

  downKey(e) {
    let action = this.allBindKey.get(e.keyCode)
    console.log(action, e.keyCode)

    if (!this.buttonsActive(e.keyCode)) {
      this.pressButton[e.keyCode] = e.keyCode
    }
    this.searchKey(e.keyCode)
    if (this.succsesKey && !this.activity.has(action) && action) {
      this.deactivity.delete(action)
      this.activity.add(action)
      document.dispatchEvent(this.actionActivated)
    }
  }

  listener(show) {
    if (show) {
      document.addEventListener('keydown', this.handlerDownKey)
      document.addEventListener('keyup', this.handlerUpKey)
    } else {
      document.removeEventListener('keydown', this.handlerDownKey)
      document.removeEventListener('keyup', this.handlerUpKey)
    }
  }

  buttonsActive(keyCode) {
    return (
      this.pressButton.hasOwnProperty(keyCode) && !!this.allBindKey.get(keyCode)
    )
  }
}

export class InputController {
  enabled
  focused
  ACTION_ACTIVATED = 'input-controller:action-activated'
  ACTION_DEACTIVATED = 'input-controller:action-deactivated'

  plugins

  target
  activity
  deactivity
  newAction

  constructor(actionsToBind, target = null) {
    this.actionsToBind = actionsToBind

    this.plugins = []

    this.target = target
    this.enabled = false

    this.actionActivated = new Event(this.ACTION_ACTIVATED)
    this.actionDeactivated = new Event(this.ACTION_DEACTIVATED)

    this.activity = new Set()
    this.deactivity = new Set()
    this.newAction = null

    this.handlerActivity = () => {
      this.activity
      console.log(this.activity)
    }

    this.handlerDeactivity = () => {
      this.deactivity
      console.log(this.deactivity)
    }
  }

  bindActions(actionsToBind) {
    this.actionsToBind = Object.assign(this.actionsToBind, actionsToBind)
    this.plugins.forEach(el => el.updateMap(this.actionsToBind))
  }

  enableAction(actionName) {
    if (this.enabled && this.target) {
      this.actionsToBind[actionName].enabled = true
    }
  }

  disableAction(actionName) {
    if (this.enabled && this.target) {
      this.actionsToBind[actionName].enabled = false
    }
  }

  attach(target, dontEnable) {
    this.target = target
    this.enabled = !!dontEnable ? false : true

    this.plugins.forEach(el => {
      el.initEvents(this.actionActivated, this.actionDeactivated)
      el.listener(true)
    })

    document.addEventListener(this.ACTION_ACTIVATED, this.handlerActivity)
    document.addEventListener(this.ACTION_DEACTIVATED, this.handlerDeactivity)
  }

  detach() {
    this.target = null
    this.enabled = false
    this.activity = null
    this.deactivity = null

    this.plugins.forEach(el => {
      el.listener(false)
    })

    document.removeEventListener(this.ACTION_ACTIVATED, this.handlerActivity)
    document.removeEventListener(
      this.ACTION_DEACTIVATED,
      this.handlerDeactivity
    )
  }

  isActionActive(actionName) {
    this.updateSet()

    const isBool =
      this.focused &&
      this.enabled &&
      this.target &&
      this.actionsToBind[actionName].enabled &&
      (this.actionsToBind[actionName].keys.some(el => this.isKeyPressed(el)) ||
        this.actionsToBind[actionName].mouse.some(el => this.isKeyPressed(el)))

    return isBool
  }

  isKeyPressed(keyCode) {
    return this.plugins.some(el => {
      return el.buttonsActive(keyCode)
    })
  }

  isFocus() {
    this.focused = document.hasFocus()

    if (!this.focused) {
      this.focused = false
    } else {
      this.focused = true
    }

    return this.focused
  }

  registerPlugin(...arg) {
    arg.forEach(el => this.plugins.push(el))
  }

  updateSet() {
    this.activity.clear()
    this.deactivity.clear()
    this.plugins.forEach(el => {
      this.activity.add(...el.activity)
      this.deactivity.add(...el.deactivity)
    })
  }
}
