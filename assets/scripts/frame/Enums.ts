/*
 * @Author: iwae iwae@foxmail.com
 * @Date: 2022-09-02 10:22:44
 * @LastEditors: chenyang.sun chenyang.sun@cocos.com
 * @LastEditTime: 2023-09-05 11:25:55
 * @FilePath: /physicPhysic/assets/src/enum/Enums.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { AudioClip, ImageAsset, JsonAsset, Prefab, SpriteAtlas, SpriteFrame, Texture2D, TextureCube } from "cc";


export class playerState {
    static isMoving = false;
}

export enum Control {
    joystick,
    xr,
    key

}
export const ob = {
    Buildings: { name: 'Buildings' },
    Keys: { name: 'Keys' },
    Env: { name: 'Env' },
    Chests: { name: 'Chests' },
    Char: { name: 'Char' },
    xiaomeiV1: { name: 'xiaomeiV1' },
    xiaoshuaiV1: { name: 'xiaoshuaiV1' },
    cargirl: { name: 'cargirl' },
    cy: { name: 'cy' },
    CharAvatar: { name: 'CharAvatar' },
}

export const ui = ({
    GameUI: { name: 'GameView', layer: 0 },
    JoystickView: { name: 'JoystickView', layer: 1 },
    FailView: { name: 'FailView', layer: 3 },
    SettingView: { name: 'SettingView', layer: 2 },
    WinView: { name: 'WinView', layer: 3 },
    ToastView: { name: 'ToastView', layer: 5 },
    CJieView: { name: 'CJieView', layer: 3 },
    ShareView: { name: 'ShareView', layer: 4 },
    BigMapView: { name: "BigMapView", layer: 4 },
    CarTouchToastView: { name: "car_touch_toast_view", layer: 5 },
    CarInnerView: { name: "car_inner_view", layer: 5 },
    SelectAvatarView: { name: "SelectAvatarView", layer: 3 },
    DialogView: { name: "DialogView", layer: 5 }
})


export const Props = {
    Scenes: "Scenes",
    Layers: "Layers",
    Comps: "Components",
    Setting: "Setting",
}

/**
 */
export const AssetType = ({
    Prefab: { type: Prefab, path: "preload/Prefabs/" },
    Json: { type: JsonAsset, path: "preload/Jsons/" },
    Sound: { type: AudioClip, path: "preload/Sounds/" },
    Image: { type: SpriteFrame, path: "preload/Images/" },
    Atlas: { type: SpriteAtlas, path: "preload/Atlas/" },
    Skybox: { type: TextureCube, path: "preload/Skybox/" }

})

//相机状态
export enum CameraState {
    DEFAULT = 0,//默认
    CAR_ORBIT,//轨道相机
    CAR_INNER,//车内触摸相机
    INTERACT,//进入交互圈之后进入固定视角
}



