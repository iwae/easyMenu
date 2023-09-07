import { _decorator, clamp, Color, Component, director, EditBox, Label, Node, Slider, Sprite, sys } from 'cc';
const { ccclass, property } = _decorator;
const tempC_1 = new Color()

@ccclass('Easy Slider')

export class eSlider extends Component {
    @property(Sprite)
    BgSprite: Sprite = null;
    @property(Sprite)
    SideSprite: Sprite = null;
    @property(Label)
    NameLable: Label = null;
    @property(Slider)
    slider: Slider = null;
    @property(EditBox)
    editbox: EditBox = null;
    @property(Color)
    set MenuItemBgColor(v) {
        this.BgColor = v;
        this.onNormal();
    }
    get MenuItemBgColor() {
        return this.BgColor;
    }
    @property(Color)
    set MenuItemSideColor(v) {
        this.SideColor = v;
        this.onNormal();
    }
    get MenuItemSideColor() {
        return this.SideColor;
    }
    @property({ visible: false })
    private BgColor: Color = new Color(40, 40, 40, 255);
    @property({ visible: false })
    private SideColor: Color = new Color(0, 130, 180, 255);

    private pressStrenth = 0.75;
    public callback: (progress:number)=>void;
    public eventData: any;
    private _scale = 1;


    init(name: string, cb?: (progress:number)=>void, scale?:number) {
        this.node.name = name;
        this.NameLable.string = name;
        cb && (this.callback = cb);
        scale && (this._scale = scale);
    }

    onEnable() {
        this.onNormal();
        if (sys.platform = sys.Platform.DESKTOP_BROWSER) {
            this.node.on(Node.EventType.MOUSE_ENTER, this.onPress, this);
            this.node.on(Node.EventType.MOUSE_LEAVE, this.onNormal, this);
        }
    }
    onDisable() {
        if (sys.platform = sys.Platform.DESKTOP_BROWSER) {
            this.node.off(Node.EventType.MOUSE_ENTER, this.onPress, this);
            this.node.off(Node.EventType.MOUSE_LEAVE, this.onNormal, this);
        }
    }

    setProgress(v: number) {
        let value = clamp(Number(v) || 0, 0, this._scale);
        this.slider.progress = value/this._scale;
        this.editbox.string = "" + value;
    }

    onSliderCallback(slider: Slider, customEventData: string) {
        const progress  = slider.progress * this._scale;
        this.editbox.string = "" +progress;
        this.callback&&this.callback(progress);
    }

    onEditDidEnded(editbox: EditBox, customEventData) {
        const value = clamp(Number(editbox.string) || 0, 0, this._scale);
        this.callback&&this.callback(value);
        this.slider.progress = value/this._scale;
    }

    changeColor(press) {
        this.BgSprite.color = tempC_1.set(this.BgColor.r * press, this.BgColor.g * press, this.BgColor.b * press);
    }
    onPress() {
        this.changeColor(this.pressStrenth);
    }
    onNormal() {
        this.changeColor(1);
    }
    onClick() {
        if (!this.callback) return;
        this.callback(this.slider.progress);
    }

}



