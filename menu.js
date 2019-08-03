class MenuState {
    enter(manager) {
        this.manager = manager;

        this.speed = .3;
        this.dist = 12;

        this.cameraPos = new Vec3(-5, 10, -20);
        this.shipPos = new Vec3(0, 2.6, 0);

        let shader = this.manager.params.shader;
        let shaderCodes = this.manager.params.shaderCodes;
        shader.setShaders(shaderCodes.mainVertex, shaderCodes.menuFragmentCode);

        let dialog = this.manager.params.dialog;
        dialog.show("Press SPACE to start", () => {
            dialog.show("Okay. Let's go.", this.startGame.bind(this), null);
        }, null);
    }

    startGame() {
        let that = this;
        co(function*() {
            yield 1;
            that.manager.setState(new GameplayState());
        });
    }

    update() {
        let gl = this.manager.params.gl;
        let input = this.manager.params.input;
        let shader = this.manager.params.shader;

        shader.uniformv("camera_pos", this.cameraPos);
        shader.uniformv("ship_pos", this.shipPos);
    }

    exit() {
    }
}
