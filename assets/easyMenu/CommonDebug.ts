import { _decorator, assetManager, Canvas, cclegacy, Component, DirectionalLight, director, game, ImageAsset, Material, Node, profiler, Sprite } from 'cc';
import { eMenu } from './src/eMenu';
import { TimeScale } from './TimeScale';
import { eGraph } from './src/eGraph';
const { ccclass, property } = _decorator;

@ccclass('CommonDebug')
export class CommonDebug extends Component {
    @property(Material) overdrawMat: Material;
    /* stored default material */
    defaultMaterial: Material = null;
    canvasNode: Node = null;
    overdrawMode = false;
    menu: eMenu = null;
    graph: eGraph;
    Batcher2D:any

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
        const material: Material = this.overdrawMode ? this.overdrawMat : this.defaultMaterial;
        children.forEach((child) => {
            if (child == this.menu.node) return;
            const sprites = child.getComponentsInChildren(Sprite);
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
        const Debug = this.menu.addGroup("Debug")

        if(profiler){
            profiler.showStats();
            Debug
            .addToggle("Profiler", (t) => {
                t ? profiler.showStats() : profiler.hideStats();
            })
        }

        Debug
            .addSlider("Scale", (v: number) => {
                TimeScale.scale = v;
            }, 1)
            .addItem("Game Time", () => {
                return "Game Time: " + Math.floor(game.totalTime) + " ms";
            })
            .addToggle("High FPS", (t) => {
                game.frameRate = t ? 60 : 30;
            })
            .addItem("Overdraw Test",
                this.testOverdraw.bind(this)
            )
            .addList("Image Memory",
                this.getImageMemory.bind(this)
            ).addGraph("FPS", null, 60, 14);

        this.graph = Debug.node.getChildByName("FPS").getComponent(eGraph);

        this.graph.callback = (() => {
            const output = this.graph.positions.toString();
            console.log("FPS History", output)
            this.copyToClipboard(output);
        })

    }
    copyToClipboard(output) {
        try {
            navigator.clipboard.writeText(output);
            console.log('Output copied to clipboard');
        } catch (err) {
            console.log('Failed to copy: ', err);
        }
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
            const url = self.url;
            const num = Math.floor((self.width * self.height * (native.indexOf('jpg') > 0 ? 3 : 4) / 1024 / 1024) * 10000) / 10000;
            total += num;
            output = output + "\n" + url + "...." + num + "M";
        })
        total = Math.floor(total * 10000) / 10000;
        output = "Total Image Mem...." + total + "M" + output;
        console.log("Image Mem==", output)
        this.copyToClipboard(output);
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

    time = 0;
    counter = 0;
    update(dt) {
        this.counter += 1;
        this.time += dt;
        if (this.time >= 1) {
            const graph = this.graph;
            if (!graph) return;
            graph.updateData(this.counter)
            this.time -= 1;
            graph.NameLable.string = "FPS: " + this.counter;
            this.counter = 0;
        }
    }




}

