export class InputController{
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
            console.log(this.actionsToBind)
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
       this.activeHandler()
    }

    detach() {
        this.target = null
        this.enabled = false
    }

    isActionActive(actionName, test = false) {
        return this.enabled && this.actionsToBind[actionName].enabled && (this.actionsToBind[actionName].active || this.actionsToBind[actionName].keys.some(el => this.isKeyPressed(el)))

       

    }

    isKeyPressed(keyCode) {
        return this.pressButton.hasOwnProperty(keyCode);
    }

    keyBoardEvent(e, press) {
        for(let key in this.actionsToBind) {
            if(this.actionsToBind[`${key}`].keys.indexOf(e.keyCode) != -1) {
                this.actionsToBind[`${key}`].active = press
                console.log(this.isActionActive(key, true))
            }
        } 
    }

    upKey(e) {
         delete this.pressButton[e.keyCode]
        this.keyBoardEvent(e, false)
        console.log(this.pressButton, 'up')
       
    }

    downKey(e) {
        if(!this.isKeyPressed(e.keyCode)){
            this.pressButton[e.keyCode] = e.keyCode
         }
         this.keyBoardEvent(e, true)
        console.log(this.pressButton, 'dw')
    }

    activeHandler() {

         document.addEventListener('keydown', (e) => {
        this.downKey(e)
    });
    
        document.addEventListener('keyup', (e) => {
        this.upKey(e)
    });

    }
   

}