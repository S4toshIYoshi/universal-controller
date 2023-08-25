import { BasePlugin } from './input-controller.js';

export class Mouse extends BasePlugin {
	activity;
	deactivity;
	pressButton;

	constructor(actionsToBind) {
		super(actionsToBind);
		this.activity = new Set();
		this.deactivity = new Set();
		this.handlerUpKey = this.upKey.bind(this);
		this.handlerDownKey = this.downKey.bind(this);

		this.pressButton = {};
	}

	upKey(e) {
		let action = this.allBindKey.get(e.which);
		delete this.pressButton[e.which];

		if (!this.deactivity.has(action) && !this.actionActive(action)) {
			this.activity.delete(action);
			this.deactivity.add(action);

			this.generationDispath('click', false);
		}
	}

	downKey(e) {
		let action = this.allBindKey.get(e.which);

		if (!this.isButtonsActive(e.which)) {
			this.pressButton[e.which] = e.which;
		}

		this.searchKey(e.which);
		if (this.succsesKey && !this.activity.has(action)) {
			this.deactivity.delete(action);
			this.activity.add(action);

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
			this.generationListener('mousedown', this.handlerDownKey, show);
		}
		if (listenerClickDeactive) {
			this.generationListener('mouseup', this.handlerUpKey, show);
		}
	}
}

export class KeyBoard extends BasePlugin {
	activity;
	deactivity;
	pressButton;

	constructor(actionsToBind) {
		super(actionsToBind);
		this.activity = new Set();
		this.deactivity = new Set();
		this.handlerUpKey = this.upKey.bind(this);
		this.handlerDownKey = this.downKey.bind(this);
		this.pressButton = {};
	}

	upKey(e) {
		let action = this.allBindKey.get(e.keyCode);

		delete this.pressButton[e.keyCode];

		if (
			!this.deactivity.has(action) &&
			!this.actionActive(action) &&
			this.allBindKey.get(e.keyCode)
		) {
			this.activity.delete(action);
			this.deactivity.add(action);

			this.generationDispath('click', false);
		}
	}

	downKey(e) {
		let action = this.allBindKey.get(e.keyCode);

		if (!this.isButtonsActive(e.keyCode) && this.allBindKey.get(e.keyCode)) {
			this.pressButton[e.keyCode] = e.keyCode;
		}

		this.searchKey(e.keyCode);
		if (this.succsesKey && !this.activity.has(action)) {
			this.deactivity.delete(action);
			this.activity.add(action);

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
			this.generationListener('keydown', this.handlerDownKey, show);
		}
		if (listenerClickDeactive) {
			this.generationListener('keyup', this.handlerUpKey, show);
		}
	}
}
