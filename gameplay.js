class GameplayState {
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
    }

    update() {
        let gl = this.manager.params.gl;
        let input = this.manager.params.input;
        
        this.dist += input.mouse.dy * .01;
        this.dist = Math.min(20, Math.max(11, this.dist));

        let angle = input.mouse.x * -.001;

        this.cameraPos = this.box.add(new Vec3(
            Math.cos(angle) * -this.dist, 
            0, 
            Math.sin(angle) * -this.dist));

        let dir = this.box.sub(this.cameraPos).norm;
        let sidedir = dir.cross(Vec3.up);

        if (input.key(Input.A)) {
            this.box = this.box.add(sidedir.muls(this.speed));
        }
        else if(input.key(Input.D)) {
            this.box = this.box.add(sidedir.muls(-this.speed));
        }
        
        if (input.key(Input.W)) {
            this.box = this.box.add(dir.muls(this.speed));
        }
        else if (input.key(Input.S)) {
            this.box = this.box.add(dir.muls(-this.speed));
        }

        this.cameraPos = this.cameraPos.add(Vec3.up.muls(this.dist - 5));
        
        gl.uniform3f(this.un_cp, 
            this.cameraPos.x, 
            this.cameraPos.y, 
            this.cameraPos.z);

        gl.uniform3f(this.un_cl, 
            this.box.x, 
            this.box.y, 
            this.box.z);

        gl.uniform1f(this.un_ba, 
            angle);
    }

    exit() {
    }
}
