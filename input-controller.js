export class InputController {
    enabled;
    focused;
    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";


    constructor(actionsToBind, target) {
        this.actionsToBind = actionsToBind

        this.target = target
        this.isDisable = false
    }

    bindActions(actionsToBind) {
        this.actionsToBind = Object.assign(this.actionsToBind, actionsToBind)
    }

    enableAction(actionName) {
        if(this.isDisable) {
            this.actionsToBind[actionName].enabled = true
        }
            
    }

    disableAction(actionName) {
        if(this.isDisable) {
            this.actionsToBind[actionName].enabled = false
        }
            
    }

    attach(target, dontEnable) {
        this.target = !!dontEnable ? null : target
        this.isDisable = true
    }

    detach() {
        this.target = null
        this.isDisable = false
    }

    isActionActive(actionName) {
        return this.actionsToBind[actionName].enabled
    }

    isKeyPressed(keyCode) {
        
    }

}