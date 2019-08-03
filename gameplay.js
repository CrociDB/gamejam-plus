class GameplayState {
    enter(manager) {
        this.manager = manager;

        this.speed = .3;
        this.dist = 12;

        this.cameraPos = new Vec3(-5, 10, -20);
        this.shipPos = new Vec3(0, 2.2, 0);

        let shader = this.manager.params.shader;
        let shaderCodes = this.manager.params.shaderCodes;
        shader.setShaders(shaderCodes.mainVertex, shaderCodes.gameFragment);

        this.state = new StateManager(this.params);
        this.state.game = this;
        this.state.setState(new GameLevel());
    }

    update() {
        this.state.update();
    }

    exit() {
    }
}

// Main gameplay
class GameLevel {
    enter(manager) {
        this.manager = manager;

        this.background = new Vec3(0.2, 0.5, 0.6);

        this.baseDepth = 0;
        this.speed = .3;
        
        this.shipLanes = [
            new Vec3(-10, 2.2, 0),
            new Vec3(0, 2.2, 0),
            new Vec3(10, 2.2, 0),
        ];

        this.obstacles = [
            new Vec3(10, 5, 5),
            new Vec3(0, 5, 10),
            new Vec3(-10, 5, 15) ];
    }

    update() {
        let game = this.manager.game;
        let gl = game.manager.params.gl;
        let input = game.manager.params.input;
        let dialog = game.manager.params.dialog;
        let shader = game.manager.params.shader;

        
        game.dist += input.mouse.dy * .01;
        game.dist = Math.min(20, Math.max(11, game.dist));
        
        let angle = input.mouse.x * -.001;
        
        game.cameraPos = this.shipLanes[1].add(new Vec3(0, 0, -game.dist));
            
        let dir = game.shipPos.sub(game.cameraPos).norm;
        let sidedir = dir.cross(Vec3.up);

        if (input.blink == 1) {
            console.log("LEFT");
        } else if (input.blink == 2) {
            console.log("RIGHT");
        }

        game.cameraPos = game.cameraPos.add(Vec3.up.muls(game.dist - 5));

        this.baseDepth -= this.speed;
        
        // Send Uniforms
        shader.uniformv("camera_pos", game.cameraPos);
        shader.uniformv("ship_pos", game.shipPos);
        shader.uniformv("background", this.background);
        shader.uniform1f("ship_angle", angle);
        shader.uniform1f("base_depth", this.baseDepth);
        
        for (let i = 0; i < this.obstacles.length; i++) {
            shader.uniformv("obstacle" + (i + 1), this.obstacles[i]);
        }
    }

    exit() {
        
    }
}
