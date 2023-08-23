export class BasePlugin {
	constructor(actionsToBind) {
		this.actionsToBind = actionsToBind;

		this.pressButton = {};

		this.allBindKey = new Map();
		this.filingMap(this.actionsToBind);

		this.succsesKey = false;

		this.actionActivated = [];
		this.actionDeactivated = [];
	}

	initEventsActive(...events) {
		this.actionActivated.push(...events);
	}

	initEventsDeactive(...events) {
		this.actionDeactivated.push(...events);
	}

	updateActivity(activity, deactivity) {
		this.activity = activity;
		this.deactivity = deactivity;
	}

	updateMap(newBind) {
		this.allBindKey.clear();
		this.filingMap(newBind);
	}

	searchKey(keyCode) {
		if (this.allBindKey.has(keyCode)) {
			this.succsesKey = true;
		} else {
			this.succsesKey = false;
		}
	}

	buttonsActive(keyCode) {
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
						document.dispatchEvent(el);
					}
				});
			} else {
				this.actionDeactivated.forEach(el => {
					if (el.detail.type === type) {
						document.dispatchEvent(el);
					}
				});
			}
		}
	}

	generationListener(eventType, handler, show) {
		if (show) {
			document.addEventListener(eventType, handler);
		} else {
			document.removeEventListener(eventType, handler);
		}
	}
}

export class InputController {
	enabled;
	focused;
	ACTION_ACTIVATED = 'input-controller:action-activated';
	ACTION_DEACTIVATED = 'input-controller:action-deactivated';

	plugins;

	target;
	activity;
	deactivity;
	newAction;

	constructor(actionsToBind, target = null) {
		this.actionsToBind = actionsToBind;

		this.plugins = [];

		this.target = target;
		this.enabled = false;

		this.actionActivated = new CustomEvent(this.ACTION_ACTIVATED, {
			detail: {
				type: 'click',
				active: 'active',
			},
		});
		this.actionDeactivated = new CustomEvent(this.ACTION_DEACTIVATED, {
			detail: {
				type: 'click',
				active: 'deactive',
			},
		});

		this.activity = new Set();
		this.deactivity = new Set();
		this.newAction = null;

		this.handlerActivity = () => {
			this.deactivity.clear();
			this.updateSet();
		};

		this.handlerDeactivity = () => {
			this.activity.clear();
			this.updateSet();
		};
	}

	bindActions(actionsToBind) {
		this.actionsToBind = Object.assign(this.actionsToBind, actionsToBind);
		this.plugins.forEach(el => el.updateMap(this.actionsToBind));
	}

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

	attach(target, dontEnable) {
		this.target = target;
		this.enabled = !!dontEnable ? false : true;

		this.plugins.forEach(el => {
			el.initEventsActive(this.actionActivated);
			el.initEventsDeactive(this.actionDeactivated);
			el.listener(true);
		});

		document.addEventListener(this.ACTION_ACTIVATED, this.handlerActivity);
		document.addEventListener(this.ACTION_DEACTIVATED, this.handlerDeactivity);
	}

	detach() {
		this.plugins.forEach(el => {
			el.listener(false);
		});
		this.target = null;
		this.enabled = false;

		document.removeEventListener(this.ACTION_ACTIVATED, this.handlerActivity);
		document.removeEventListener(
			this.ACTION_DEACTIVATED,
			this.handlerDeactivity
		);
	}

	isActionActive(actionName) {
		const isBool =
			this.focused &&
			this.enabled &&
			this.target &&
			this.actionsToBind[actionName].enabled &&
			(this.actionsToBind[actionName].keys.some(el => this.isKeyPressed(el)) ||
				this.actionsToBind[actionName].mouse.some(el => this.isKeyPressed(el)));

		return isBool;
	}

	isKeyPressed(keyCode) {
		return this.plugins.some(el => {
			return el.buttonsActive(keyCode);
		});
	}

	isFocus() {
		this.focused = document.hasFocus();

		if (!this.focused) {
			this.focused = false;
		} else {
			this.focused = true;
		}

		return this.focused;
	}

	registerPlugin(...arg) {
		this.plugins.push(...arg);
		console.log(this.plugins);
	}

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
}
