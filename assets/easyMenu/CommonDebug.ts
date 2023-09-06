import { _decorator, assetManager, Canvas, Component, DirectionalLight, director, game, ImageAsset, Material, Node, profiler, Sprite } from 'cc';
import { eMenu } from './src/eMenu';
import { TimeScale } from './TimeScale';
const { ccclass, property } = _decorator;

@ccclass('CommonDebug')
export class CommonDebug extends Component {
    @property(Material) overdrawMat: Material;
    /* stored default material */
    defaultMaterial: Material = null;
    canvasNode: Node = null;
    overdrawMode = false;
    menu: eMenu = null;

    start() {
        this.canvasNode = director.getScene().getComponentInChildren(Canvas).node;
        this.menu = this.canvasNode.getComponentInChildren(eMenu);
        this.addDebug();
        this.add3dEnvDebug();
        director.addPersistRootNode(this.node);
    }
    testOverdraw() {
        this.overdrawMode = !this.overdrawMode;
        const children = this.canvasNode.children;
        children.forEach((child) => {
            if (child == this.menu.node) return;
            const sprites = child.getComponentsInChildren(Sprite);
            const material: Material = this.overdrawMode ? this.overdrawMat : this.defaultMaterial;
            sprites.forEach((sprite) => {
                if (!this.defaultMaterial) {
                    this.defaultMaterial = new Material();
                    this.defaultMaterial.copy(sprite.material)
                }
                if (sprite.node.name !== this.node.name) {
                    sprite.material = material;
                }
            })

        })
    }

    addDebug() {
        if (!this.menu) return;
        profiler.showStats();
        this.menu.addGroup("Debug")
            .addToggle("Profiler", (t) => {
                t ? profiler.showStats() : profiler.hideStats();
            })
            .addSlider("Scale", (v: number) => {
                TimeScale.scale = v;
            }, 1)
            .addItem("Game Time", () => {
                return "GameTime: " + Math.floor(game.totalTime) + " ms";
            })
            .addToggle("High FPS", (t) => {
                game.frameRate = t ? 60 : 30;
            })
            .addItem("Overdraw Test",
                this.testOverdraw.bind(this)
            )
            .addList("Image Memory",
                this.getImageMemory.bind(this)
            )

    }
    getImageMemory(): string {
        const assets = assetManager.assets;
        let images: ImageAsset[] = [];
        assets.forEach((asset) => {
            if (asset instanceof ImageAsset) {
                images.push(asset);
            }
        })
        images.sort(function (a, b) {
            return b.height * b.width - a.height * a.width;
        });
        let output = "";
        let total = 0;
        /* get all imagessets mem */
        images.forEach((image, i) => {
            const self = image;
            const native = self._native;
            const uuid = self.uuid;
            const num = Math.floor((self.width * self.height * (native.indexOf('jpg') > 0 ? 3 : 4) / 1024 / 1024) * 10000) / 10000;
            total += num;
            output = output + "\n" + uuid + native + "...." + num + "M";
        })
        total = Math.floor(total * 10000) / 10000;
        output = "Total Image Mem...." + total + "M" + output;
        console.log("Image Mem==", output)
        try {
            navigator.clipboard.writeText(output);
            console.log('Output copied to clipboard');
        } catch (err) {
            console.log('Failed to copy: ', err);
        }
        return output;
    }

    add3dEnvDebug() {
        if (!this.menu) return;
        const scene = director.getScene();
        const globals = scene.globals;
        const light = scene.getComponentInChildren(DirectionalLight);
        const ambientScale = globals.ambient.skyIllum / 100000;
        const lightScale = light.illuminance / 100000;

        this.menu
            .addGroup("Env")
            .addToggle("Shadow", (t) => {
                globals.shadows.enabled = t;
            })
            .addToggle("IBL", (t) => {
                globals.skybox.useIBL = t;
            })
            .addToggle("CSM", (t) => {
                light.enableCSM = t;
            })
            .addSlider("Ambient", (p) => {
                globals.ambient.skyIllum = p * 100000
            }, ambientScale)
            .addSlider("Light", (p) => {
                light.illuminance = p * 100000
            }, lightScale)
    }



}

