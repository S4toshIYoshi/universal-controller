import { BasePlugin } from './input-controller.js';

export class Mouse extends BasePlugin {
	activity;
	deactivity;

	constructor(actionsToBind) {
		super(actionsToBind);
		this.activity = new Set();
		this.deactivity = new Set();
		this.handlerUpKey = this.upKey.bind(this);
		this.handlerDownKey = this.downKey.bind(this);
	}

	filingMap(bind) {
		if (bind) {
			for (let key in bind) {
				this.actionsToBind[key].mouse.forEach(el =>
					this.allBindKey.set(el, key)
				);
			}
		}
	}

	upKey(e) {
		let action = this.allBindKey.get(e.which);

		this.activity.clear();

		delete this.pressButton[e.which];
		if (this.succsesKey && !this.deactivity.has(action)) {
			this.activity.delete(action);
			this.deactivity.add(action);

			this.generationDispath('click', false);
		}
	}

	downKey(e) {
		let action = this.allBindKey.get(e.which);

		if (!this.buttonsActive(e.which)) {
			this.pressButton[e.which] = e.which;
		}
		this.searchKey(e.which);
		if (this.succsesKey && !this.activity.has(action)) {
			this.deactivity.delete(action);
			this.activity.add(action);
			console.log('renderMouse');

			this.generationDispath('click', true);
		}
	}

	listener(show) {
		const listenerClickActive = this.actionActivated.some(
			el => el.detail.type === 'click'
		);
		const listenerClickDeactive = this.actionDeactivated.some(
			el => el.detail.type === 'click'
		);

		if (listenerClickActive) {
			super.generationListener('mousedown', this.handlerDownKey, show);
		}
		if (listenerClickDeactive) {
			super.generationListener('mouseup', this.handlerUpKey, show);
		}
	}
}

export class KeyBoard extends BasePlugin {
	activity;
	deactivity;

	constructor(actionsToBind) {
		super(actionsToBind);
		this.activity = new Set();
		this.deactivity = new Set();
		this.handlerUpKey = this.upKey.bind(this);
		this.handlerDownKey = this.downKey.bind(this);
	}

	filingMap(bind) {
		if (bind) {
			for (let key in bind) {
				this.actionsToBind[key].keys.forEach(el =>
					this.allBindKey.set(el, key)
				);
			}
		}
	}

	upKey(e) {
		let action = this.allBindKey.get(e.keyCode);

		this.activity.clear();

		delete this.pressButton[e.keyCode];
		if (this.succsesKey && !this.deactivity.has(action)) {
			this.activity.delete(action);
			this.deactivity.add(action);

			this.generationDispath('click', false);
		}
	}

	downKey(e) {
		let action = this.allBindKey.get(e.keyCode);

		if (!this.buttonsActive(e.keyCode)) {
			this.pressButton[e.keyCode] = e.keyCode;
		}
		this.searchKey(e.keyCode);
		if (this.succsesKey && !this.activity.has(action)) {
			this.deactivity.delete(action);
			this.activity.add(action);
			console.log('renderKey');

			this.generationDispath('click', true);
		}
	}

	listener(show) {
		const listenerClickActive = this.actionActivated.some(
			el => el.detail.type === 'click'
		);
		const listenerClickDeactive = this.actionDeactivated.some(
			el => el.detail.type === 'click'
		);

		if (listenerClickActive) {
			super.generationListener('keydown', this.handlerDownKey, show);
		}
		if (listenerClickDeactive) {
			super.generationListener('keyup', this.handlerUpKey, show);
		}
	}
}
