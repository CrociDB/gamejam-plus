class MenuState {
    enter(manager) {
        this.manager = manager;

        this.manager.params.bgm.play("music-menu");

        this.speed = .3;
        this.dist = 12;

        this.cameraPos = new Vec3(-5, 10, -20);
        this.shipPos = new Vec3(0, 2.6, 0);

        let shader = this.manager.params.shader;
        let shaderCodes = this.manager.params.shaderCodes;
        shader.setShaders(shaderCodes.mainVertex, shaderCodes.menuFragmentCode);

        let dialog = this.manager.params.dialog;
        dialog.showList(["Press SPACE to start", "Let's dive in."], this.startGame.bind(this), null);

        this.manager.params.title.classList.remove("hidden");

        let that = this;
        co(function*() {
            let col = 0.0;
            while (col < 1.0) {
                col += .05;
                shader.uniform1f("colorFade", col);
                yield .01;
            }
            shader.uniform1f("colorFade", 1.0);
        });
    }

    startGame() {
        let shader = this.manager.params.shader;
        let that = this;

        this.manager.params.bgm.stop("music-menu");

        co(function*() {
            let col = 1.0;
            while (col > 0.0) {
                col -= .08;
                shader.uniform1f("colorFade", col);
                yield .01;
            }
            that.manager.params.title.classList.add("hidden");
            shader.uniform1f("colorFade", 0.0);
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
