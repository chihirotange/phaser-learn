export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'dude');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        //move
        this.speed = 300;
        this.drag = 0.8;
        
        // this.setBounce(0.2);
        this.setGravityY(300);
        this.setCollideWorldBounds(true);
        this.initAnimations()

        // jump
        this.jumpBufferTime = 0;
        this.jumpBufferDuration = 400;

        //gun
        this.gun = scene.add.sprite(x, y, 'gun');
        this.gun.setOrigin(0.2, 0.5);

        // bullets group
        this.bullets = scene.physics.add.group({
            classType: Phaser.GameObjects.Sprite,
            runChildUpdate: true
        });

        // mouse input
        scene.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.shoot(pointer.worldX, pointer.worldY);
            }
        });
    }

    shoot(targetX, targetY) {
        // Create a bullet at the gun's tip
        const angle = this.gun.rotation;
        const bulletSpeed = 1000;
        const bulletX = this.gun.x + Math.cos(angle) * this.gun.width * 0.8;
        const bulletY = this.gun.y + Math.sin(angle) * this.gun.width * 0.8;
        const bullet = this.scene.physics.add.sprite(bulletX, bulletY, 'bomb');
        bullet.displayWidth = 50;
        bullet.displayHeight = 50;
        bullet.body.setSize(bullet.displayWidth, bullet.displayHeight)
        this.bullets.add(bullet);
        bullet.setAngle(Phaser.Math.RadToDeg(angle));
        bullet.setVelocity(Math.cos(angle) * bulletSpeed, Math.sin(angle) * bulletSpeed);
        bullet.setTint(0xffff00);
        bullet.body.allowGravity = false;

        // Optional: destroy bullet after 1.5 seconds
        this.scene.time.delayedCall(1500, () => {
            if (bullet && bullet.active) bullet.destroy();
        });
    }
    
    update(time) {
        if (this.body.blocked.down){
            this.jumpBufferTime = time;
        }
        const bufferRemaining = Math.max(0, this.jumpBufferDuration - (time - this.jumpBufferTime))
        this.scene.debugDrawManager.setDebugText("jumpBufferTime", "Jump buffer: " + bufferRemaining.toFixed(0));
            
        //gun
        const pointer = this.scene.input.activePointer;
        const angle = Phaser.Math.Angle.Between(this.gun.x, this.gun.y, pointer.worldX, pointer.worldY);
        this.gun.setRotation(angle);

        const lerp = 0.3; // Adjust for more/less lag
        this.gun.x += (this.x - this.gun.x) * lerp;
        this.gun.y += (this.y - this.gun.y) * lerp;
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
        this.setVelocityX(-this.speed);
        this.anims.play('left', true);
    }

    moveRight() {
        this.setVelocityX(this.speed);
        this.anims.play('right', true);
    }

    idle() {
        this.setVelocityX(this.body.velocity.x*this.drag);
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