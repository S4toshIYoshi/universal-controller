class KeyBoard {
  constructor() {
    this.pressButton = {}
  }

  upKey(key) {
    delete this.pressButton[key]
  }

  downKey(key) {
    if (!this.isKeyPressed(key)) {
      this.pressButton[key] = key
    }
  }

  KeyboardListener(show) {
    if (show) {
      document.addEventListener('keydown', e => {
        this.actionActivated.detail.key = e.keyCode
        document.dispatchEvent(this.actionActivated)
      })
      document.addEventListener('keyup', e => {
        this.actionDeactivated.detail.key = e.keyCode
        document.dispatchEvent(this.actionDeactivated)
      })
    } else {
      document.removeEventListener('keydown', e => {
        this.actionActivated.detail.key = e.keyCode
        document.dispatchEvent(this.actionActivated)
      })
      document.removeEventListener('keyup', e => {
        this.actionDeactivated.detail.key = e.keyCode
        document.dispatchEvent(this.actionDeactivated)
      })
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
      detail: {key: null},
    })
    this.actionDeactivated = new CustomEvent(this.ACTION_DEACTIVATED, {
      detail: {key: null},
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

    document.addEventListener(this.ACTION_ACTIVATED, e =>
      this.downKey(e.detail.key)
    )
    document.addEventListener(this.ACTION_DEACTIVATED, e =>
      this.upKey(e.detail.key)
    )
    this.KeyboardListener(true)
  }

  detach() {
    this.target = null
    this.enabled = false

    document.removeEventListener(this.ACTION_ACTIVATED, e =>
      this.downKey(e.detail.key)
    )
    document.removeEventListener(this.ACTION_DEACTIVATED, e =>
      this.upKey(e.detail.key)
    )
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
