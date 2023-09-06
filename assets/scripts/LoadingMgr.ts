import { _decorator, Component, director, lerp, Sprite } from 'cc';
import res from './frame/ResMgr';
import { AssetType } from './frame/Enums';
import { sceneMgr } from './SceneMgr';
import { eMenu } from '../easyMenu/src/eMenu';
import sound from './frame/SoundMgr';
const { ccclass, property } = _decorator;

@ccclass('loadingMgr')
export class loadingMgr extends Component {
    @property(Sprite) bar:Sprite;
    end = false;
    async start() {
        res._debug = true;
        /* load bundles */
        await res.loadBundle(1,0.1);
        await res.loadBundle(2,0.05);
        await res.loadBundle(3,0.05);

        /* load res based on types */
        await res.loadRes(1,AssetType.Prefab,0.2);
        await res.loadRes(2,AssetType.Prefab,0.4);
        await res.loadRes(3,AssetType.Skybox,0.1);
        await res.loadRes(3,AssetType.Sound,0.1);

        const root = director.getScene();
        /* scene */
        res.getNode("Plane",root);
        res.getNode("Models",root);

        /* skybox */
        director.getScene().globals.skybox.envmap = res.getTextureCube("skybox");
        /* sfx */
        sound.startBgm("bgm");
        /* destroy bars */
        this.end = true;
        this.node.destroyAllChildren();

    }

    update(deltaTime: number) {
        if(this.end) return;
        this.bar.fillRange = lerp(this.bar.fillRange,res.loadingRate,deltaTime*5);
    }
}

