export default class DebugDrawManager extends Phaser.Plugins.BasePlugin {
    constructor(scene, pluginManager) {
        super(pluginManager);
        this.scene = scene;
        this.startX = 10;
        this.startY = 10;
        this.lineHeight = 20;
        this.entries = new Map(); // key -> { textObj, message }
        this.manager = null;
    }

    getManager(scene) {
        if (!scene.debugDrawManager) {
            scene.debugDrawManager = new DebugDrawManager(scene)
        }
    }
    setDebugText(key, message) {
        let entry = this.entries.get(key);
        if (!entry) {
            // Create new text object
            const textObj = this.scene.add.text(
                this.startX,
                this.startY + this.entries.size * this.lineHeight,
                message,
                { fontSize: '16px', fill: '#fff' }
            );
            this.entries.set(key, { textObj, message });
        } else {
            // Update existing text
            entry.message = message;
        }
        this._updatePositions();
    }

    removeDebugText(key) {
        const entry = this.entries.get(key);
        if (entry) {
            entry.textObj.destroy();
            this.entries.delete(key);
            this._updatePositions();
        }
    }

    _updatePositions() {
        let i = 0;
        for (const entry of this.entries.values()) {
            entry.textObj.setY(this.startY + i * this.lineHeight);
            entry.textObj.setText(entry.message);
            i++;
        }
    }
}