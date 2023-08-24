import {BasePlugin} from './input-controller.js'

export class Mouse extends BasePlugin {
  activity
  deactivity

  constructor(actionsToBind) {
    super(actionsToBind)
    this.activity = new Set()
    this.deactivity = new Set()
    this.handlerUpKey = this.upKey.bind(this)
    this.handlerDownKey = this.downKey.bind(this)
  }

  filingMap(bind) {
    if (bind) {
      for (let key in bind) {
        if (this.actionsToBind[key].mouse) {
          this.actionsToBind[key].mouse.forEach(el =>
            this.allBindKey.set(el, key)
          )
        }
      }
    }
  }

  upKey(e) {
    let action = this.allBindKey.get(e.which)

    if (!this.deactivity.has(action) && this.pressButton[e.which]) {
      this.activity.delete(action)
      this.deactivity.add(action)

      this.generationDispath('click', false)
    }

    delete this.pressButton[e.which]
  }

  downKey(e) {
    let action = this.allBindKey.get(e.which)

    if (!this.isButtonsActive(e.which) && !this.activity.has(action)) {
      this.pressButton[e.which] = e.which
    }
    this.searchKey(e.which)
    if (this.succsesKey && !this.activity.has(action)) {
      this.deactivity.delete(action)
      this.activity.add(action)

      this.generationDispath('click', true)
    }
  }

  listener(show) {
    const listenerClickActive = this.actionActivated.some(
      el => el.detail.type === 'click'
    )
    const listenerClickDeactive = this.actionDeactivated.some(
      el => el.detail.type === 'click'
    )

    if (listenerClickActive) {
      this.generationListener('mousedown', this.handlerDownKey, show)
    }
    if (listenerClickDeactive) {
      this.generationListener('mouseup', this.handlerUpKey, show)
    }
  }
}

export class KeyBoard extends BasePlugin {
  activity
  deactivity

  constructor(actionsToBind) {
    super(actionsToBind)
    this.activity = new Set()
    this.deactivity = new Set()
    this.handlerUpKey = this.upKey.bind(this)
    this.handlerDownKey = this.downKey.bind(this)
  }

  filingMap(bind) {
    if (bind) {
      for (let key in bind) {
        this.actionsToBind[key].keys.forEach(el => this.allBindKey.set(el, key))
      }
    }
  }

  upKey(e) {
    let action = this.allBindKey.get(e.keyCode)

    if (!this.deactivity.has(action) && this.pressButton[e.keyCode]) {
      this.activity.delete(action)
      this.deactivity.add(action)

      this.generationDispath('click', false)
    }

    delete this.pressButton[e.keyCode]
  }

  downKey(e) {
    let action = this.allBindKey.get(e.keyCode)

    if (!this.isButtonsActive(e.keyCode) && !this.activity.has(action)) {
      this.pressButton[e.keyCode] = e.keyCode
    }
    this.searchKey(e.keyCode)
    if (this.succsesKey && !this.activity.has(action)) {
      this.deactivity.delete(action)
      this.activity.add(action)

      this.generationDispath('click', true)
    }
  }

  listener(show) {
    const listenerClickActive = this.actionActivated.some(
      el => el.detail.type === 'click'
    )
    const listenerClickDeactive = this.actionDeactivated.some(
      el => el.detail.type === 'click'
    )

    if (listenerClickActive) {
      this.generationListener('keydown', this.handlerDownKey, show)
    }
    if (listenerClickDeactive) {
      this.generationListener('keyup', this.handlerUpKey, show)
    }
  }
}
