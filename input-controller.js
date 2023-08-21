export class InputController {
    enabled;
    focused;
    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";


    constructor(actionsToBind, target) {
        this.actionsToBind = actionsToBind

        this.target = target
        this.enabled = false

        this.pressButton = {}
    }

    bindActions(actionsToBind) {
        this.actionsToBind = Object.assign(this.actionsToBind, actionsToBind)
    }

    enableAction(actionName) {
        if(this.enabled) {
            this.actionsToBind[actionName].enabled = true
        }
            
    }

    disableAction(actionName) {
        if(this.enabled) {
            this.actionsToBind[actionName].enabled = false
        }       
    }

    attach(target, dontEnable) {
       this.target = target
       this.enabled = !!dontEnable ? false : true
    }

    detach() {
        this.target = null
        this.enabled = false
    }

    isActionActive(actionName) {
        if(this.enabled && this.actionsToBind[actionName].enabled) {
            return true
        }
        return false
    }

    isKeyPressed(keyCode) {
        return this.pressButton.hasOwnProperty(keyCode);
    }


    keyBoardEvent(e, action) {
        for(let key in this.actionsToBind) {
            if(this.actionsToBind[`${key}`].keys.indexOf(e.keyCode) != -1) {
                action(key)
            }
        } 
    }

    upKey(e) {
        this.keyBoardEvent(e, (key) => this.disableAction(key))
        delete this.pressButton[e.keyCode]
    }

    downKey(e) {
        this.keyBoardEvent(e, (key) => this.enableAction(key))
        this.pressButton[e.keyCode] = e.keyCode
    }

}