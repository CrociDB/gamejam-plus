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

class ShipMovement {
    constructor(shipPos, lanes) {
        this.shipPos = shipPos;
        this.lanes = lanes;

        this.oldPos = 1;
        this.currentPos = 1;
        this.movement = 1.0;
        this.sign = 1.0;
    }
    
    moveRight() {
        console.dir(this.currentPos);
        if (this.currentPos < 2 && this.movement > 0.999) {
            this.oldPos = this.currentPos;
            this.currentPos++;
            this.movement = 0;
            this.sign = -1.0;
        }
    }
    
    moveLeft() {
        if (this.currentPos > 0 && this.movement > 0.999) {
            this.oldPos = this.currentPos;
            this.currentPos--;
            this.movement = 0;
            this.sign = 1.0;
        }
    }

    update() {
        this.movement = Math.min(this.movement + 0.05, 1.0);
        if (this.movement <= 1.0) {
            this.shipPos = Vec3.lerp(this.lanes[this.oldPos], this.lanes[this.currentPos], Math.sqrt(this.movement));
        }
    }

    get pos() {
        return this.shipPos;
    }

    get mov() {
        return this.movement;
    }
}

// Main gameplay
class GameLevel {
    enter(manager) {
        this.manager = manager;

        this.background = new Vec3(0.2, 0.5, 0.6);

        this.baseDepth = 0;
        
        this.shipLanes = [
            new Vec3(-10, 2.2, 0),
            new Vec3(0, 2.2, 0),
            new Vec3(10, 2.2, 0),
        ];

        this.ship = new ShipMovement(this.manager.game.shipPos, this.shipLanes);

        this.obstacles = [
            new Vec3(10, 5, 5),
            new Vec3(0, 5, 10),
            new Vec3(-10, 5, 15),
            new Vec3(10, 5, 5),
            new Vec3(0, 5, 10),
            new Vec3(-10, 5, 15),
            new Vec3(10, 5, 5),
            new Vec3(0, 5, 10),
            new Vec3(-10, 5, 15), ];

        this.obstaclesHeight = 5;
        this.obstaclesWide = -1;
        this.levelData = {
            obsDepth: 200,
            obsMinDist: 100,
            obsMul: 400,
            obsMax: 3,
            speed: .6,
        } 

        this.generateObstacles();
    }

    generateObstacles() {
        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i] = this.generateSingleObstacle(true);
        }
    }
    
    generateSingleObstacle(d) {
        let lane = Math.ceil(Math.random() * 3) - 2;
        let r = d ? Math.round(this.levelData.obsDepth / this.levelData.obsMul) : Math.round(this.levelData.obsMinDist / this.levelData.obsMul)
        let dist = 150 + Math.random() * r * this.levelData.obsMul;
        return new Vec3(this.obstaclesWide + lane * 10, this.obstaclesHeight, dist);
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

        this.ship.update();
        if (input.blink == 1) {
            this.ship.moveLeft();
        } else if (input.blink == 2) {
            this.ship.moveRight();
        }
        game.shipPos = this.ship.pos;

        game.cameraPos = game.cameraPos.add(Vec3.up.muls(game.dist - 5));

        this.baseDepth -= this.levelData.speed;
        
        // Send Uniforms
        shader.uniformv("camera_pos", game.cameraPos);
        shader.uniformv("ship_pos", game.shipPos);
        shader.uniformv("ship_initial_pos", this.shipLanes[1]);
        shader.uniformv("background", this.background);
        shader.uniform1f("ship_angle", this.ship.mov);
        shader.uniform1f("ship_sign", this.ship.sign);
        shader.uniform1f("base_depth", this.baseDepth);
        
        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].z -= this.levelData.speed;
            if (this.obstacles[i].z <= -10) {
                this.obstacles[i] = this.generateSingleObstacle(false);
            };

            shader.uniformv("obstacle" + (i + 1), this.obstacles[i]);
        }
    }

    exit() {
        
    }
}
