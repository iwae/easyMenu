
import { AudioSourceComponent, _decorator } from "cc";
import Res from "./ResMgr";


export class SoundMgr {
    /**
     * 音乐和单次音效播放
     */
    private _audioComp: AudioSourceComponent = new AudioSourceComponent();;
    /**
     * 循环音效播放
     */
    private _audioLoopComp: AudioSourceComponent = new AudioSourceComponent();;
    private _effectComp: AudioSourceComponent = new AudioSourceComponent();;
    private _curLoopAudioName: string = "";
   

    public startBgm (audio?: string, isLoop: boolean = true) {
        if (!audio && this._audioComp.clip) {
            this._audioComp.play();
            return;
        }
        if (!audio) return;
        let clip = Res.getClip(audio);
        this._audioComp.clip = clip;
        this._audioComp.loop = isLoop;
        this._audioComp.play();
    }

    public stopBgm() {
        this._audioComp.stop();
    }

    public play(audio: string, scale = 0.5) {
        let clip = Res.getClip(audio);
        this._effectComp.playOneShot(clip, scale);
    }
    /**
     * @description: Play loop Audio
     * @param {string} audio
     * @return {*}
     */
    public loop(audio: string) {

        let clip = Res.getClip(audio);
        this._audioLoopComp.stop();
        this._audioLoopComp.clip = clip;
        this._audioLoopComp.loop = true;
        this._audioLoopComp.play();
        this._curLoopAudioName = audio;
    }

    public stoploop() {
        this._audioLoopComp.stop();
    }

}

const sound = new SoundMgr;

export default sound;