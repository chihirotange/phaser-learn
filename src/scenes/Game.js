import {Player} from '../gameObjects/Player.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.add.image(400, 300, 'sky')
        this.platform = this.physics.add.staticGroup()
        this.platform.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platform.create(600, 400, 'ground');
        this.platform.create(50, 250, 'ground');
        this.platform.create(750, 220, 'ground');
        this.player = new Player(this, 100, 450);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: {x: 12, y:0, stepX: 70}
        });
        //control
        this.jumpKeyPressed = false;

        this.stars.children.iterate(child =>
            {
                child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            });
        this.physics.add.collider(this.player, this.platform);
        this.physics.add.collider(this.stars, this.platform);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.score = 0;
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
    }

    update(time) {
        this.player.update(time);
        if(this.cursors.left.isDown){
            this.player.moveLeft();
        }
        else if (this.cursors.right.isDown){
            this.player.moveRight();
        }
        else {
            this.player.idle();
        }

        if(this.cursors.up.isDown && !this.jumpKeyPressed){
            this.jumpKeyPressed = true;
            this.player.jump(time)
        }
        if(!this.cursors.up.isDown){
            this.jumpKeyPressed = false;
        }
    }

    moveSnake() {
    }

    spawnFood() {
    }

    gameOver() {
    }
}
