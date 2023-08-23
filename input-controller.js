class KeyBoard {
  constructor(actionsToBind) {
    this.actionsToBind = actionsToBind

    this.pressButton = {}

    this.handlerUpKey = this.upKey.bind(this)
    this.handlerDownKey = this.downKey.bind(this)

    this.allBindKey = new Map()
    this.filingMap(this.actionsToBind)

    this.succsesKey = false
    this.oldSuccsesKey = null
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
    this.oldSuccsesKey = this.searchKey

    if (this.allBindKey.has(keyCode)) {
      this.succsesKey = true
    } else {
      this.succsesKey = false
    }
  }

  upKey(e) {
    this.deactivity = this.allBindKey.get(e.keyCode)
    this.activity = 'none'

    delete this.pressButton[e.keyCode]
    if (this.succsesKey) {
      document.dispatchEvent(this.actionDeactivated)
    }
  }

  downKey(e) {
    if (!this.isKeyPressed(e.keyCode)) {
      this.pressButton[e.keyCode] = e.keyCode
      this.activity = this.allBindKey.get(e.keyCode)
    }
    this.searchKey(e.keyCode)
    if (this.succsesKey) {
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

  isKeyPressed(keyCode) {
    return (
      this.pressButton.hasOwnProperty(keyCode) && this.allBindKey.get(keyCode)
    )
  }
}

export class InputController extends KeyBoard {
  enabled
  focused
  ACTION_ACTIVATED = 'input-controller:action-activated'
  ACTION_DEACTIVATED = 'input-controller:action-deactivated'

  target
  activity
  deactivity
  newAction

  constructor(actionsToBind, target = null) {
    super(actionsToBind)

    this.actionsToBind = actionsToBind

    this.target = target
    this.enabled = false

    this.actionActivated = new Event(this.ACTION_ACTIVATED)
    this.actionDeactivated = new Event(this.ACTION_DEACTIVATED)

    this.activity = null
    this.deactivity = null
    this.newAction = null

    this.handlerActivity = (() => this.activity).bind(this)

    this.handlerDeactivity = (() => this.deactivity).bind(this)
  }

  bindActions(actionsToBind) {
    this.actionsToBind = Object.assign(this.actionsToBind, actionsToBind)
    this.updateMap(this.actionsToBind)
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

    document.addEventListener(this.ACTION_ACTIVATED, this.handlerActivity)
    document.addEventListener(this.ACTION_DEACTIVATED, this.handlerDeactivity)
  }

  detach() {
    this.target = null
    this.enabled = false
    this.activity = null

    this.KeyboardListener(false)

    document.removeEventListener(this.ACTION_ACTIVATED, this.handlerActivity)
    document.removeEventListener(
      this.ACTION_DEACTIVATED,
      this.handlerDeactivity
    )
  }

  isActionActive(actionName) {
    const isBool =
      this.enabled &&
      this.target &&
      this.actionsToBind[actionName].enabled &&
      this.actionsToBind[actionName].keys.some(el => this.isKeyPressed(el))

    return isBool
  }

  isFocus() {
    this.focused = document.hasFocus()

    if (!this.focused) {
      this.enabled = false
    } else {
      this.enabled = true
    }

    return this.enabled
  }
  /*
  isAction(keyCode) {
		let result = false;
		for (let key in this.actionsToBind) {
			result = this.actionsToBind[key].keys.some(el => el === keyCode);
			if (result) {
				return result;
			}
		}

		return result;
	}*/
}
