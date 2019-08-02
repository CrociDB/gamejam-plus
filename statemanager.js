class StateManager {
    constructor(params) {
        this.params = params;
        this.currentState = undefined;
    }   

    setState(state) {
        if (this.currentState != undefined) {
            this.currentState.exit();
        }

        this.currentState = state;

        if (state != undefined) {
            this.currentState.enter(this);
        }
    }

    update() {
        if (this.currentState != undefined) {
            this.currentState.update();
        }
    }
};