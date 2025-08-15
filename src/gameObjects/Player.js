export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'dude');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // this.setBounce(0.2);
        this.setGravityY(300);
        this.setCollideWorldBounds(true);
        this.initAnimations()

        // jump
        this.jumpBufferTime = 0;
        this.jumpBufferDuration = 300;
        this.jumpDebug = scene.add.text(10, 50, 'bc', {fontSize: '16px', fill:'#111'})
    }

    update(time) {
        if (this.body.blocked.down){
            this.jumpBufferTime = time;
        }
        const bufferRemaining = Math.max(0, this.jumpBufferDuration - (time - this.jumpBufferTime))
        this.jumpDebug.setText(`${bufferRemaining.toFixed(0)}`)
    }

    initAnimations() {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4}],
            frameRate: 1
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        })
    }

    moveLeft() {
        this.setVelocityX(-200);
        this.anims.play('left', true);
    }

    moveRight() {
        this.setVelocityX(200);
        this.anims.play('right', true);
    }

    idle() {
        this.setVelocityX(0);
        this.anims.play('turn');
    }

    jump(time) {
        if (this.body.blocked.down || time - this.jumpBufferTime <= this.jumpBufferDuration)
        {
            this.setVelocityY(-500);
            this.jumpBufferTime = 0;
        }
    }
}