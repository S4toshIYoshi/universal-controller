class KeyBoard {
  constructor() {
    this.pressButton = {}

    this.handlerUpKey = this.upKey.bind(this)
    this.handlerDownKey = this.downKey.bind(this)
  }

  upKey(e) {
    delete this.pressButton[e.keyCode]
    this.actionDeactivated.detail.activity = this
    document.dispatchEvent(this.actionDeactivated)
  }

  downKey(e) {
    if (!this.isKeyPressed(e.keyCode)) {
      this.pressButton[e.keyCode] = e.keyCode

      document.dispatchEvent(this.actionActivated)
    }
  }

  KeyboardListener(show) {
    if (show) {
      document.addEventListener('keydown', this.handlerDownKey)
      document.addEventListener('keyup', this.handlerUpKey)
    } else {
      document.removeEventListener('keydown', this.handlerDownKey)
      document.removeEventListener('keyup', this.handlerUpKey)
    }
  }
}

export class InputController extends KeyBoard {
  enabled
  focused
  ACTION_ACTIVATED = 'input-controller:action-activated'
  ACTION_DEACTIVATED = 'input-controller:action-deactivated'

  target

  constructor(actionsToBind, target = null) {
    super(actionsToBind)

    this.actionsToBind = actionsToBind

    this.target = target
    this.enabled = false

    this.actionActivated = new CustomEvent(this.ACTION_ACTIVATED, {
      detail: {
        activity: null,
      },
    })
    this.actionDeactivated = new CustomEvent(this.ACTION_DEACTIVATED, {
      detail: {
        activity: null,
      },
    })
  }

  bindActions(actionsToBind) {
    this.actionsToBind = Object.assign(this.actionsToBind, actionsToBind)
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

    this.KeyboardListener(true)

    document.addEventListener(this.ACTION_ACTIVATED, e => console.log())
  }

  detach() {
    this.target = null
    this.enabled = false

    this.KeyboardListener(false)
  }

  isActionActive(actionName) {
    return (
      this.enabled &&
      this.target &&
      this.actionsToBind[actionName].enabled &&
      this.actionsToBind[actionName].keys.some(el => this.isKeyPressed(el))
    )
  }

  isKeyPressed(keyCode) {
    return this.pressButton.hasOwnProperty(keyCode)
  }
}
