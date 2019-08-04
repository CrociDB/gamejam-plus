class GameplayState {
    enter(manager) {
        this.manager = manager;

        this.speed = .3;
        this.dist = 12;

        this.cameraPos = new Vec3(-5, 10, -20);
        this.shipPos = new Vec3(0, 2.2, 0);
        this.currentLevel = 9;

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

class Entry {
    enter(manager) {
        this.manager = manager;
        console.dir(this);
        let dialog = this.manager.game.manager.params.dialog;
        let levelData = LEVELS[this.manager.game.currentLevel];
        dialog.showList(levelData.entry, () => {
            manager.setState(new GameLevel());
        }, null);
    }

    update() {
    }

    exit() {

    }
}

class Dead {
    enter(manager) {
        this.manager = manager;
        console.dir(this);
        let levelData = LEVELS[this.manager.game.currentLevel];
        let dialog = this.manager.game.manager.params.dialog;
        dialog.showList(levelData.death, () => {
            manager.setState(new Entry());
        }, null, true);
    }

    update() {

    }

    exit() {

    }
}

// Main gameplay
class GameLevel {
    enter(manager) {
        this.manager = manager;

        this.finished = 0;
        this.fade = -2;

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

        this.obstaclesWide = -1;
        this.levelData = LEVELS[this.manager.game.currentLevel];
        
        this.generateObstacles();
    }

    generateObstacles() {
        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i] = this.generateSingleObstacle(true);
        }
    }
    
    generateSingleObstacle(d) {
        let lane = Math.ceil(Math.random() * 3) - 2;
        let r = d ? this.levelData.obsDepth : this.levelData.obsMinDist
        let dist = 150 + Math.ceil(Math.random() * r) * this.levelData.obsMul;
        //return new Vec3(0, 0, 0);
        return new Vec3(this.obstaclesWide + lane * 10, 0, dist);
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
        this.countdown -= 0.2;
        if (this.finished == 0 && this.fade > 0.9) {
            if (input.blink == 1) {
                this.ship.moveLeft();
            } else if (input.blink == 2) {
                this.ship.moveRight();
            }
            game.shipPos = this.ship.pos;
        }

        game.cameraPos = game.cameraPos.add(Vec3.up.muls(game.dist - 5));

        this.baseDepth -= this.levelData.speed;
        if(Math.abs(this.baseDepth) >= this.levelData.dist) {
            this.finished = 2;
        }

        if (this.finished > 0) {
            this.fade -= this.finished == 2 ? .015 : .2;
            if (this.fade <= 0) {
                if (this.finished == 1) {
                    this.manager.setState(new Dead());
                } else {
                    if (this.manager.game.currentLevel < LEVELS.length - 1) {
                        this.manager.game.currentLevel++;
                        this.manager.setState(new Entry());
                    } else {
                        game.manager.setState(new MenuState());
                    }
                }
            }
        } else {
            this.fade = Math.min(this.fade + .026, 1.0);
        }
        
        // Send Uniforms
        shader.uniformv("camera_pos", game.cameraPos);
        shader.uniformv("ship_pos", game.shipPos);
        shader.uniformv("ship_initial_pos", this.shipLanes[1]);
        shader.uniformv("background", this.levelData.background);
        shader.uniform1f("ship_angle", this.ship.mov);
        shader.uniform1f("ship_sign", this.ship.sign);
        shader.uniform1f("base_depth", this.baseDepth);
        shader.uniform1f("colorFade", this.fade);
        shader.uniform1f("distort", this.levelData.distort);
        
        for (let i = 0; i < this.obstacles.length; i++) {
            if (this.finished == 0)
            {
                if (i < this.levelData.obsMax) {
                    this.obstacles[i].z -= this.levelData.speed;
                    let t = Math.min(1.0 - (this.obstacles[i].z - 30) / 90, 1);
                    this.obstacles[i].y = (1 - t) * -5 + t * 5
                    if (this.obstacles[i].z <= -10 && this.finished == 0) {
                        this.obstacles[i] = this.generateSingleObstacle(false);
                    };
    
                    if (Vec3.distance(this.ship.pos, this.obstacles[i]) < 5) {
                        this.finished = 1;
                    }
                }
            }

            if (i >= this.levelData.obsMax || this.finished > 0) {
                this.obstacles[i].y = 300;
            }

            shader.uniformv("obstacle" + (i + 1), this.obstacles[i]);
        }
    }

    exit() {
        
    }
}
