/*
 * @Descripttion: 
 * @version: 
 * @Author: iwae
 * @Date: 2022-01-01 23:40:30
 * @LastEditors: chenyang.sun chenyang.sun@cocos.com
 * @LastEditTime: 2023-09-05 15:20:17
 */

import { AssetManager, assetManager, AudioClip, ImageAsset, instantiate,  Node, NodePool, Prefab,  SpriteAtlas, SpriteFrame, Texture2D, TextureCube, Vec3 } from "cc"
import { AssetType } from "./Enums";
const bundle = "bundle";

export class ResMgr {
    public _jsonAssetMap: { [key: string]: Object } = {};
    public _clipMap: { [key: string]: AudioClip } = {};
    public _uiMap: { [key: string]: Node } = {};

    private _abBundleMap: { [key: string]: AssetManager.Bundle } = {};
    private _atlasMap: { [key: string]: SpriteAtlas } = {};
    private _textureCubeMap: { [key: string]: TextureCube } = {};

    private _textureMap: { [key: string]: Texture2D } = {};

    private _loadStemp = null;
    private loadTime = 0;
    private _totalTime = 0

    private _dictPool: { [key: string]: NodePool } = {}
    private _dictPrefab: { [key: string]: Prefab } = {}

    loadingRate = 0;
    _debug = false;

    /**
     * @description: get the node from the pool
     * @param {Prefab} prefab
     * @param {Node} parent
     * @param {Vec3} pos
     * @return {*}
     */
    public getNode (prefab: Prefab | string, parent?: Node, pos?: Vec3): Node {
        let tempPre;
        let name;
        if (typeof prefab === 'string') {
            tempPre = this._dictPrefab[prefab];
            name = prefab;
            if (!tempPre) {
                console.log("Pool invalid prefab name = ", name);
                return null;
            }
        }
        else {
            tempPre = prefab;
            name = prefab.data.name;
        }

        let node = null;
        if (this._dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            let pool = this._dictPool[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = instantiate(tempPre);
            }
        } else {
            //没有对应对象池，创建他！
            let pool = new NodePool();
            this._dictPool[name] = pool;

            node = instantiate(tempPre);
        }

        if (parent) {
            node.parent = parent;
            node.active = true;
            if (pos) node.position = pos;
        }

        return node;
    }


    /**
     * @description: put the node into the pool
     * @param {Node} node
     * @param {*} isActive
     * @return {*}
     */
    public putNode (node: Node | null, isActive = false) {
        if (!node) {
            return;
        }

        //console.log("回收信息",node.name,node)
        let name = node.name;
        let pool = null;
        // node.active = isActive
        if (this._dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            pool = this._dictPool[name];
        } else {
            //没有对应对象池，创建他！
            pool = new NodePool();
            this._dictPool[name] = pool;
        }

        pool.put(node);
    }

    /**
     * @description: clear the pool based on name
     * @param {string} name
     * @return {*}
     */
    public clearPool (name: string) {
        if (this._dictPool.hasOwnProperty(name)) {
            let pool = this._dictPool[name];
            pool.clear();
        }
    }


    public setPrefab (name: string, prefab: Prefab): void {
        if (!this._dictPrefab[name]) {
            this._dictPrefab[name] = prefab;
        }
    }

    public clearDict () {
        this._dictPrefab = {};
    }



    printTimer (name: string = "", end = false) {
        this.loadTime = Date.now() - this._loadStemp;
        this._loadStemp = Date.now();
        this._totalTime += this.loadTime
        console.log(name + "，load time===", this.loadTime, "ms")
        if (end) {
            console.log("Load finish, total time===", this._totalTime, "ms")
        }

    }

    /**
     * @description: Load assetbundle based on index
     * @param {number} index
     * @param {number} ratio
     * @return {*}
     */
    public async loadBundle (index: number, ratio: number): Promise<void> {
        if (!this._loadStemp) this._loadStemp = Date.now();
        const name = bundle + index
        return new Promise<void>((resolve, reject) => {
            if(this._abBundleMap[index] ){
                resolve && resolve();
            }
            assetManager.loadBundle(name, (err: any, bundle: any) => {
                if (err) {
                    const str = "bundle" + index + " load error, error==" + err
                    console.log(str)
                } else {
                    this._abBundleMap[index] = bundle;
                    this.printTimer("bundle" + index + "__" + "load success")
                    this.loadingRate += ratio;
                    resolve && resolve();
                }
            })
        })
    }
    /**
     * @name: Load any res
     * @param {index} bunlde index
     * @param {type} res type from AssetType
     * @param {ratio} Res Loading ratiro, make sure the amount of all ratios is less than 1.0
     */
    public async loadRes (index: number, type: any, ratio: number = 0): Promise<void> {
        const rate = this.loadingRate;
        const self = this;
        return new Promise<void>((resolve, reject) => {
            this._abBundleMap[index].loadDir(type.path, type.type, (finished: number, total: number) => {
                // this._loadUtils.setValue(idx, finished / total); 
                if (ratio > 0) this.loadingRate = rate + ratio * finished / total
            }, (err: any, assets: any[]) => {
                if (err) {
                    const str = "Res Error ===" + err
                    console.log(str);
                    resolve && resolve();
                }
                let asset: any
                switch(type){
                    case AssetType.Prefab:
                        for (let i = 0; i < assets.length; i++) {
                            asset = assets[i];
                            this.setPrefab(asset.data.name, asset);
                            this._debug&& console.log("prefab name==", asset.data.name)
                        }
                    break;
                    case AssetType.Sound:
                        for (let i = 0; i < assets.length; i++) {
                            asset = assets[i];
                            this._debug&& console.log("clip name==", asset.name)
                            if (!self._clipMap[asset.name]) self._clipMap[asset.name] = asset;
                        }
                    break;
                    case AssetType.Image:
                        for (let i = 0; i < assets.length; i++) {
                            asset = assets[i] as SpriteFrame;
                            if (!self._textureMap[asset.name]) self._textureMap[asset.name] = asset.texture;
                        }
                    break;
                    case AssetType.Json:
                        for (let i = 0; i < assets.length; i++) {
                            asset = assets[i];
                            this._debug&& console.log("json name==", asset.name)
                            if (!self._jsonAssetMap[asset.name]) self._jsonAssetMap[asset.name] = asset.json;
                        }
                    break;
                    case AssetType.Atlas:
                        for (let i = 0; i < assets.length; i++) {
                            asset = assets[i];
                            this._debug&& console.log("atlas name==", asset.name)
                            if (!self._atlasMap[asset.name]) self._atlasMap[asset.name] = asset;
                        }
                    break;
                    case AssetType.Skybox:
                        for (let i = 0; i < assets.length; i++) {
                            asset = assets[i];
                            const name = asset.name||"skybox";
                            this._debug&& console.log("skybox name==", name)
                            if (!self._textureCubeMap[name]) self._textureCubeMap[name] = asset;
                        }
                    break;
                }

                self.printTimer("Bundle" + index + "__" + type.path + "loaded success")
                resolve && resolve();
            })
        })
    }

    public async loadBgm (): Promise<void> {
        let self = this
        return new Promise<void>((resolve, reject) => {
            this._abBundleMap[5].load("bgm", function (err, bgm: AudioClip) {
                if (err) {
                    console.log("Error info===", err);
                    resolve && resolve();
                }
                if (!self._clipMap[bgm.name]) self._clipMap[bgm.name] = bgm
                resolve && resolve();
            })
        }
        )
    }


    /**
   * @name: load any prefab
   * @param {index} bunlde index
   * @param {type} res type
   * @param {ratio} Res Loading ratiro, make sure the amount of all ratios is less than 1.0
   */
    public async loadPrefab (info): Promise<void> {
        const rate = this.loadingRate;
        return new Promise<void>((resolve, reject) => {
            this._abBundleMap[info.bundle].load(info.path + info.name, function (err, Prefab) {
                if (err) {
                    console.log("错误信息===", err);
                    resolve && resolve();
                }
                this.setPrefab(info.name, Prefab);
                // console.log("预制体名字===", info.name);

                resolve && resolve();
            })
        }
        )
    }

    /** 
     * pre load&&make prefabs
    */
    public async preloadRes (name: string, count: number, ratio: number = 0): Promise<void> {
        const rate = this.loadingRate;

        return new Promise<void>((resolve, reject) => {
            let pre = this._dictPrefab[name];
            for (let i = 0; i < count; i++) {
                this.putNode(instantiate(pre));
            }
            if (ratio > 0) this.loadingRate = rate + ratio
            this.printTimer("preload_" + name)
            resolve && resolve();
        })
    }
    public getAtlas (name: string): SpriteAtlas {
        return this._atlasMap[name];
    }





    public async getPrefab (prefabPath: any, parent?: Node) {

        if (this._dictPrefab[prefabPath.name]) {
            return this.getNode(prefabPath.name, parent)
        }
        await this.loadPrefab(prefabPath)
        return this.getNode(prefabPath.name, parent)

    }


    public getJson (name: string): Object {
        return this._jsonAssetMap[name];
    }

    public getClip (name: string): AudioClip {
        return this._clipMap[name];
    }
    public getTexture (name: string): Texture2D {
        return this._textureMap[name];
    }
    public getTextureCube (name: string): TextureCube {
        return this._textureCubeMap[name];
    }


    /**
     * @Date: 2022-08-03 12:25:53
     * @LastEditors: iwae
     * @description: 通过ImageAsset 创建一个Texture2D
     * @param {ImageAsset} imgAsset
     */
    public createTexture2DWtihImageAsset (imgAsset: ImageAsset, addRef = true): Texture2D {
        let texture: Texture2D = null;
        let id;
        if (imgAsset._uuid != "''" && imgAsset._uuid != null && imgAsset._uuid.length > 0) {
            id = imgAsset._uuid;
        } else {
            id = imgAsset.name;
        }

        const uuid = this.getTexture2DUUID(id);

        if (assetManager.assets.has(uuid)) {
            // console.log("existTex", uuid)
            texture = assetManager.assets.get(uuid) as Texture2D;
            // let image = texture.image;
            // image.addRef();

        } else {
            console.log("not exist", uuid)
            texture = new Texture2D();
            texture.image = imgAsset;
            // imgAsset.addRef();
            texture._uuid = uuid;
            texture._nativeUrl = '';
            assetManager.assets.add(texture._uuid, texture);
            assetManager.dependUtil._depends.add(texture._uuid, { deps: [imgAsset._uuid], nativeDep: [] });
            texture.setMipFilter(Texture2D.Filter.NONE);
            texture.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
            texture.setWrapMode(Texture2D.WrapMode.CLAMP_TO_EDGE, Texture2D.WrapMode.CLAMP_TO_EDGE);
        }

        if (addRef) { texture.addRef(); }

        return texture;
    }

    public getNewImageAsset (url: string, nativeAsset?): ImageAsset {
        let uuid = url;
        let imgAsset: ImageAsset
        if (assetManager.assets.has(uuid)) {
            console.log("exist imgae", uuid)
            imgAsset = assetManager.assets.get(uuid) as ImageAsset;
        }
        else {
            console.log("new imgae", uuid)
            imgAsset = nativeAsset ? new ImageAsset(nativeAsset) : new ImageAsset();
            imgAsset._uuid = uuid;
            assetManager.assets.add(imgAsset._uuid, imgAsset);
            imgAsset._nativeUrl = imgAsset._uuid;
            assetManager.dependUtil._depends.add(imgAsset._uuid, { deps: [], nativeDep: [] });
        }
        imgAsset.addRef();
        return imgAsset;
    }

    public getSpriteFrameUUID (key: string): string {
        return `${key}@f9941`;
    }
    public getTexture2DUUID (key: string): string {
        return `${key}@6c48a`;
    }

    public getImageUUID (key: string): string {
        return `${key}@76234`;
    }




}

const res = new ResMgr;

export default res;