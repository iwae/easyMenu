import { _decorator, assetManager, AudioClip, Component, DirectionalLight, director, EventTouch, game, ImageAsset, Input, input, instantiate, Prefab, profiler, Vec2 } from 'cc';
import { eMenu } from '../easyMenu/src/eMenu';
import { TimeScale } from '../easyMenu/TimeScale';
const { ccclass, property } = _decorator;

@ccclass('sceneMgr')
export class sceneMgr extends Component {
    @property(Prefab) default: Prefab;
    @property(Prefab) cases: Prefab[] = [];
    test = 200;

    private _index = -1;
    private _prefab: Prefab = null;
    private _amount = 0;
    start() {
        profiler.showStats();
        this.defaultScene();
        this.configMenu();
    }
 
  
    configMenu() {
        const menu = director.getScene().getChildByName('Canvas').getComponentInChildren(eMenu);
        if(!menu) return;
        const group = menu.addGroup("Scene");
        group.addItem("Default",()=>{
            this.defaultScene();
        })
          this.cases.forEach((c, i) => {
            group.addItem(c.name, () => {
                this.changePrefab(c, i + 1);
            })
        })
  
    }

    defaultScene() {
        if (this._index == 0) return;
        this._amount = 0;
        this._index = 0;
        this.node.destroyAllChildren();
        const defaultScene = instantiate(this.default);
        defaultScene.parent = this.node;
    }
    changePrefab(pfb: Prefab, index = 2) {
        if (this._index == index) return
        this.node.destroyAllChildren();
        this._index = index;
        this._prefab = pfb;
        this._amount = this.test;
    }

    update(deltaTime: number) {
        if (this._amount > 0) {
            const x = (this._amount % 10 - 5) * 2.6;
            const z = -Math.floor(this._amount / 10) * 2;
            const node = instantiate(this._prefab);
            node.parent = this.node;
            node.setPosition(x, 0, z);
            this._amount--;
        }

    }
}

