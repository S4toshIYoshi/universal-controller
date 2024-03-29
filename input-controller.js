export class BasePlugin {
	constructor(actionsToBind) {
		this.actionsToBind = actionsToBind; // бинды

		this.succsesKey = false;

		this.actionActivated = []; // кеолекция активных экшенов
		this.actionDeactivated = []; // колекция деактивных экшенов
	}

	/**
	 * @description инициализирует активные экшены
	 * @param  {object} events
	 */
	initEventsActive(...events) {
		this.actionActivated.push(...events);
	}

	/**
	 * @description инициализирует не активные экшены
	 * @param  {object} events
	 */
	initEventsDeactive(...events) {
		this.actionDeactivated.push(...events);
	}

	setDetachAction() {
		this.actionActivated = [];
		this.actionDeactivated = [];
	}

	setPressButton(obj) {
		this.pressButton = obj;
	}

	/**
	 * @description проверяет есть ли в нажатых кнопках похожие
	 * @param {string} action
	 * @returns {bool}
	 */
	actionActive(action) {
		if (this.actionsToBind[action]) {
			return this.actionsToBind[action].allkeys.some(el =>
				this.pressButton.hasOwnProperty(el)
			);
		}
	}

	/**
	 * @description обновляет set экшенов
	 * @param  {object} activity
	 * @param  {object} deactivity
	 */
	updateActivity(activity, deactivity) {
		this.activity = activity;
		this.deactivity = deactivity;
	}
	/**
	 * @description обновляет список всех биндов
	 * @param {object} newBind
	 */
	updateMap(newBind) {
		this.allBindKey = new Map([...newBind]);
	}

	/**
	 * @description обновляет Map всех нажатых кнопок
	 * @param  {object} newBind
	 */

	/**
	 * @description првоверят есть ли переданное значение во всех биндах
	 * @param  {number} keyCode
	 */
	searchKey(keyCode) {
		if (this.allBindKey.has(keyCode)) {
			this.succsesKey = true;
		} else {
			this.succsesKey = false;
		}
	}

	/**
	 * @description проверяет нажата ли кнопка по переданомму коду
	 * @param  {number} keyCode
	 */
	isButtonsActive(keyCode) {
		return (
			this.pressButton.hasOwnProperty(keyCode) && !!this.allBindKey.get(keyCode)
		);
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
						console.log('active');
						document.dispatchEvent(el);
					}
				});
			} else {
				this.actionDeactivated.forEach(el => {
					if (el.detail.type === type) {
						console.log('deactive');
						document.dispatchEvent(el);
					}
				});
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
			document.addEventListener(eventType, handler);
		} else {
			document.removeEventListener(eventType, handler);
		}
	}
}

export class InputController {
	enabled; // доступность контроллера
	focused; // фокус пользователя на экран

	// Экшены
	ACTION_ACTIVATED = 'input-controller:action-activated';
	ACTION_DEACTIVATED = 'input-controller:action-deactivated';

	plugins; // все подключенные плагины

	target; // объект к которму цепляемся
	activity; // Set колекция с активными экшенами
	deactivity; // Set колекция с не активными экшенами

	constructor(actionsToBind, target = null) {
		this.actionsToBind = actionsToBind;

		this.plugins = [];

		this.target = target;
		this.enabled = false;

		this.pressButton = {};

		this.actionActivated = new CustomEvent(this.ACTION_ACTIVATED, {
			detail: {
				type: 'click',
				action: new Set(),
			},
		});
		this.actionDeactivated = new CustomEvent(this.ACTION_DEACTIVATED, {
			detail: {
				type: 'click',
				action: new Set(),
			},
		});

		this.activity = new Set();
		this.deactivity = new Set();

		this.allBindKey = new Map();
		this.filingMap(this.actionsToBind);

		/**
		 *
		 * @description срабатывает когда экшен активен
		 * @description обновляет колекцию deactivity и detail.action
		 */
		this.handlerActivity = e => {
			this.deactivity.clear();
			this.updateSet();
		};
		/**
		 *
		 * @description срабатывает когда экшен активен
		 * @description обновляет колекцию activity и detail.action
		 */
		this.handlerDeactivity = e => {
			this.activity.clear();
			this.updateSet();
		};
	}

	//inits ------------------------------------------------------------------------------------

	/**
	 *
	 * @description добовляет новые бинды и раскидывает их по плагинам
	 */
	bindActions(actionsToBind) {
		this.actionsToBind = Object.assign(this.actionsToBind, actionsToBind);
		this.allBindKey.clear();
		this.filingMap(this.actionsToBind);
		this.plugins.forEach(el => {
			el.updateMap(this.allBindKey);
		});
	}

	/**
	 * @description заполняет Map со всеми биндами key => name
	 * @param {object} bind
	 */
	filingMap(bind) {
		if (bind) {
			for (let key in bind) {
				bind[key].allkeys.forEach(el => this.allBindKey.set(el, key));
			}
		}
	}

	attach(target, dontEnable) {
		this.target = target;
		this.enabled = !!dontEnable ? false : true;

		this.plugins.forEach(el => {
			el.initEventsActive(this.actionActivated);
			el.initEventsDeactive(this.actionDeactivated);
			el.listener(true);
			el.updateMap(this.allBindKey);
		});

		document.addEventListener(this.ACTION_ACTIVATED, this.handlerActivity);
		document.addEventListener(this.ACTION_DEACTIVATED, this.handlerDeactivity);
	}

	detach() {
		this.plugins.forEach(el => {
			el.listener(false);
			el.setDetachAction();
		});
		this.target = null;
		this.enabled = false;

		document.removeEventListener(this.ACTION_ACTIVATED, this.handlerActivity);
		document.removeEventListener(
			this.ACTION_DEACTIVATED,
			this.handlerDeactivity
		);
	}

	/**
	 *
	 * @description инициирует переданные плагины
	 */
	registerPlugin(...arg) {
		this.plugins.push(...arg);
		console.log(this.plugins);
	}

	//checks ---------------------------------------------------------------------------------------------------

	isActionActive(actionName) {
		this.updatePressButton();
		const isBool =
			this.focused &&
			this.enabled &&
			this.target &&
			this.actionsToBind[actionName].enabled &&
			this.isPresent(this.actionsToBind[actionName], ['keys', 'mouse']);

		return isBool;
	}

	isKeyPressed(keyCode) {
		return this.plugins.some(el => {
			return el.isButtonsActive(keyCode);
		});
	}

	/**
	 *
	 * @description сеттер для проверки фокуса
	 */
	isFocus() {
		this.focused = document.hasFocus();

		if (!this.focused) {
			this.focused = false;
		} else {
			this.focused = true;
		}

		return this.focused;
	}

	/**
	 *
	 * @description проверят есть ли в объекте ключ
	 */
	isKey(obj, key) {
		return typeof obj[key] === 'object';
	}

	/**
	 *
	 * @description проверяет присутсвует ли действия в нажатых клавишах
	 */
	isPresent(obj, key = []) {
		const result = key.map(key => {
			if (this.isKey(obj, key)) {
				return obj[key].some(el => this.isKeyPressed(el));
			}
		});

		return result.some(el => el);
	}

	//updates data ---------------------------------------------------------------------------------------

	enableAction(actionName) {
		if (this.enabled && this.target) {
			this.actionsToBind[actionName].enabled = true;
		}
	}

	disableAction(actionName) {
		if (this.enabled && this.target) {
			this.actionsToBind[actionName].enabled = false;
		}
	}

	/**
	 *
	 * @description обновляет списки активности и деактивности, затем отправляет их в плагины
	 */
	updateSet() {
		this.plugins.reduce((acc, el) => {
			if (el.activity && el.deactivity) {
				this.activity = new Set([
					...this.activity,
					...el.activity,
					...acc.activity,
				]);
				this.deactivity = new Set([
					...el.deactivity,
					...acc.deactivity,
					...this.deactivity,
				]);
			}
		});

		this.plugins.forEach(el =>
			el.updateActivity(this.activity, this.deactivity)
		);
	}

	/**
	 *
	 * @description обновляет списки нажатых кнопок, затем отправляет их в плагины
	 */
	updatePressButton() {
		this.plugins.forEach(el => {
			if (el.pressButton) {
				this.pressButton = Object.assign(this.pressButton, el.pressButton);
			}
		});
		this.plugins.forEach(el => {
			el.setPressButton(this.pressButton);
		});
	}
}
