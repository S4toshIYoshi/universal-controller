class KeyBoard {
  constructor() {
    this.pressButton = {}
  }

  event(e, press) {
    for (let key in this.actionsToBind) {
      if (this.actionsToBind[`${key}`].keys.indexOf(e.keyCode) != -1) {
        this.actionsToBind[`${key}`].active = press
        document.dispatchEvent(
          press ? this.actionActivated : this.actionDeactivated
        )
      }
    }
  }

  upKey(e) {
    delete this.pressButton[e.keyCode]
    this.event(e, false)
  }

  downKey(e) {
    if (!this.isKeyPressed(e.keyCode)) {
      this.pressButton[e.keyCode] = e.keyCode
    }
    this.event(e, true)
  }

  toggleListener(show) {
    if (show) {
      document.addEventListener('keydown', e => this.downKey(e))
      document.addEventListener('keyup', e => this.upKey(e))
    } else {
      document.removeEventListener('keydown', e => this.downKey(e))
      document.removeEventListener('keyup', e => this.upKey(e))
    }
  }
}

export class InputController extends KeyBoard {
  enabled
  focused
  ACTION_ACTIVATED = 'input-controller:action-activated'
  ACTION_DEACTIVATED = 'input-controller:action-deactivated'

  target

  constructor(actionsToBind, target) {
    super(actionsToBind)

    this.actionsToBind = actionsToBind

    this.target = target
    this.enabled = false

    this.actionActivated = new Event(this.ACTION_ACTIVATED)
    this.actionDeactivated = new Event(this.ACTION_DEACTIVATED)
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
    this.toggleListener(true)
  }

  detach() {
    this.target = null
    this.enabled = false
    this.toggleListener(false)
  }

  isActionActive(actionName) {
    return (
      this.enabled &&
      this.actionsToBind[actionName].enabled &&
      (this.actionsToBind[actionName].active ||
        this.actionsToBind[actionName].keys.some(el => this.isKeyPressed(el)))
    )
  }

  isKeyPressed(keyCode) {
    return this.pressButton.hasOwnProperty(keyCode)
  }
}
