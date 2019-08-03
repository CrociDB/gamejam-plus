class MenuState {
    enter(manager) {
        this.manager = manager;

        this.speed = .3;
        this.dist = 12;

        this.cameraPos = new Vec3(-5, 10, -20);
        this.box = new Vec3(0, 2.6, 0);

        this.un_cp = manager.params.gl.getUniformLocation(
            manager.params.program, "camera_pos");

        this.un_cl = manager.params.gl.getUniformLocation(
            manager.params.program, "box_pos");

        this.un_ba = manager.params.gl.getUniformLocation(
            manager.params.program, "box_angle");


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
    }

    exit() {
    }
}
