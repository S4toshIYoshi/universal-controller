export class BasePlugin {
  constructor(actionsToBind) {
    this.actionsToBind = actionsToBind // бинды

    this.pressButton = {} // нажатые кнопки

    this.allBindKey = new Map() // коллекция всех кодов действий
    this.filingMap(this.actionsToBind)

    this.succsesKey = false

    this.actionActivated = [] // кеолекция активных экшенов
    this.actionDeactivated = [] // колекция деактивных экшенов
  }

  /**
   * @description инициализирует активные экшены
   * @param  {object} events
   */
  initEventsActive(...events) {
    this.actionActivated.push(...events)
  }

  /**
   * @description инициализирует не активные экшены
   * @param  {object} events
   */
  initEventsDeactive(...events) {
    this.actionDeactivated.push(...events)
  }

  /**
   * @description обновляет set экшенов
   * @param  {object} activity
   * @param  {object} deactivity
   */
  updateActivity(activity, deactivity) {
    this.activity = activity
    this.deactivity = deactivity
  }

  /**
   * @description обновляет Map всех нажатых кнопок
   * @param  {object} newBind
   */
  updateMap(newBind) {
    this.allBindKey.clear()
    this.filingMap(newBind)
  }

  /**
   * @description првоверят есть ли переданное значение во всех биндах
   * @param  {number} keyCode
   */
  searchKey(keyCode) {
    if (this.allBindKey.has(keyCode)) {
      this.succsesKey = true
    } else {
      this.succsesKey = false
    }
  }

  /**
   * @description проверяет нажата ли кнопка по переданомму коду
   * @param  {number} keyCode
   */
  isButtonsActive(keyCode) {
    return (
      this.pressButton.hasOwnProperty(keyCode) && !!this.allBindKey.get(keyCode)
    )
  }

  /**
   * @description type -  *тип который должен быть в ивенте чтобы событие задиспатчилось*
   * @description activated -  *по каким ивентам искать: true - активирующим, false - деактивирующим**
   * @description conditions -  *условие при которм выполниться поиск по ивентам, по умолчанию true*
   * @param {string} type
   * @param {bool} activated
   * @param {bool} conditions
   *
   */
  generationDispath(type, activated, conditions = true) {
    if (conditions) {
      if (activated) {
        this.actionActivated.forEach(el => {
          if (el.detail.type === type) {
            document.dispatchEvent(el)
          }
        })
      } else {
        this.actionDeactivated.forEach(el => {
          if (el.detail.type === type) {
            document.dispatchEvent(el)
          }
        })
      }
    }
  }

  /**
   * @description цепляет к document слушатель на переданное событие
   * @param {string} eventType
   * @param {Function} handler
   * @param {bool} show
   *
   */

  generationListener(eventType, handler, show) {
    if (show) {
      document.addEventListener(eventType, handler)
    } else {
      document.removeEventListener(eventType, handler)
    }
  }
}

export class InputController {
  enabled // доступность контроллера
  focused // фокус пользователя на экран

  // Экшены
  ACTION_ACTIVATED = 'input-controller:action-activated'
  ACTION_DEACTIVATED = 'input-controller:action-deactivated'
  ACTION_ADVERTISING_DEACTIVATED = 'input-controller:advertising-deactevated'

  plugins // все подключенные плагины

  target // объект к которму цепляемся
  activity // Set колекция с активными экшенами
  deactivity // Set колекция с не активными экшенами

  constructor(actionsToBind, target = null) {
    this.actionsToBind = actionsToBind

    this.plugins = []

    this.target = target
    this.enabled = false

    this.actionActivated = new CustomEvent(this.ACTION_ACTIVATED, {
      detail: {
        type: 'click',
        active: 'active',
        action: new Set(),
      },
    })
    this.actionDeactivated = new CustomEvent(this.ACTION_DEACTIVATED, {
      detail: {
        type: 'click',
        active: 'deactive',
        action: new Set(),
      },
    })

    this.actionAdvertising = new CustomEvent(
      this.ACTION_ADVERTISING_DEACTIVATED,
      {
        detail: {
          type: 'click',
          active: 'deactive',
          action: new Set(),
        },
      }
    )

    this.activity = new Set()
    this.deactivity = new Set()

    /**
     *
     * @description срабатывает когда экшен активен
     * @description обновляет колекцию deactivity и detail.action
     */
    this.handlerActivity = e => {
      this.deactivity.clear()
      e.detail.action.clear()

      this.updateSet()

      e.detail.action.add(...this.activity)

      console.log('action Active')
    }
    /**
     *
     * @description срабатывает когда экшен активен
     * @description обновляет колекцию activity и detail.action
     */
    this.handlerDeactivity = e => {
      this.activity.clear()
      e.detail.action.clear()

      this.updateSet()

      e.detail.action.add(...this.deactivity)
      console.log('action deactive')
    }
  }

  /**
   *
   * @description добовляет новые бинды и раскидывает их по плагинам
   */
  bindActions(actionsToBind) {
    this.actionsToBind = Object.assign(this.actionsToBind, actionsToBind)
    this.plugins.forEach(el => el.updateMap(this.actionsToBind))
  }

  /**
   *
   * @description сеттер
   */
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
      el.initEventsActive(this.actionActivated)
      el.initEventsDeactive(this.actionDeactivated, this.actionAdvertising)
      el.listener(true)
    })

    document.addEventListener(this.ACTION_ACTIVATED, this.handlerActivity)
    document.addEventListener(this.ACTION_DEACTIVATED, this.handlerDeactivity)
    document.addEventListener(
      this.ACTION_ADVERTISING_DEACTIVATED,
      this.handlerDeactivity
    )
  }

  detach() {
    this.plugins.forEach(el => {
      el.listener(false)
    })
    this.target = null
    this.enabled = false

    document.removeEventListener(this.ACTION_ACTIVATED, this.handlerActivity)
    document.removeEventListener(
      this.ACTION_DEACTIVATED,
      this.handlerDeactivity
    )
    document.removeEventListener(
      this.ACTION_ADVERTISING_DEACTIVATED,
      this.handlerDeactivity
    )
  }

  isActionActive(actionName) {
    const isBool =
      this.focused &&
      this.enabled &&
      this.target &&
      this.actionsToBind[actionName].enabled &&
      this.isPresent(this.actionsToBind[actionName], ['keys', 'mouse'])

    return isBool
  }

  isKeyPressed(keyCode) {
    return this.plugins.some(el => {
      return el.isButtonsActive(keyCode)
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
    this.plugins.push(...arg)
    console.log(this.plugins)
  }

  updateSet() {
    this.plugins.reduce((acc, el) => {
      if (el.activity && el.deactivity) {
        this.activity = new Set([
          ...this.activity,
          ...el.activity,
          ...acc.activity,
        ])
        this.deactivity = new Set([
          ...el.deactivity,
          ...acc.deactivity,
          ...this.deactivity,
        ])
      }
    })

    this.plugins.forEach(el =>
      el.updateActivity(this.activity, this.deactivity)
    )
  }

  isKey(obj, key) {
    return typeof obj[key] === 'object'
  }

  isPresent(obj, key = []) {
    const result = key.map(key => {
      if (this.isKey(obj, key)) {
        return obj[key].some(el => this.isKeyPressed(el))
      }
    })

    return result.some(el => el)
  }
}
