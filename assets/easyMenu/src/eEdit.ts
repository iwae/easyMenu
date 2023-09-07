import { _decorator, clamp, Color, Component, EditBox, Label, Node, Slider, Sprite, sys } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;
const tempC_1 = new Color()

@ccclass('Easy Edit')

export class eEdit extends Component {
    @property(Sprite)
    BgSprite: Sprite = null;
    @property(Sprite)
    SideSprite: Sprite = null;
    @property(Label)
    NameLable: Label = null;

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
    public callback: (input:string)=>void;
    public eventData: any;


    init(name: string, editstring:any, cb?: (input:string)=>void) {
        this.node.name = name;
        this.NameLable.string = name;
        this.editbox.string  = editstring;
        cb && (this.callback = cb);
    }

    onEnable() {
        this.onNormal();
        // this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
        if (sys.platform = sys.Platform.DESKTOP_BROWSER) {
            this.node.on(Node.EventType.MOUSE_ENTER, this.onPress, this);
            this.node.on(Node.EventType.MOUSE_LEAVE, this.onNormal, this);
        }
    }
    onDisable() {
        // this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
        if (sys.platform = sys.Platform.DESKTOP_BROWSER) {
            this.node.off(Node.EventType.MOUSE_ENTER, this.onPress, this);
            this.node.off(Node.EventType.MOUSE_LEAVE, this.onNormal, this);
        }
    }

    setProgress(v: number) {
        let value = clamp(Number(v) || 0, 0, 1);
        this.editbox.string = "" + value;
    }

 
    onEditDidEnded(editbox: EditBox, customEventData) {
        const value = editbox.string;
        this.callback&&this.callback(value);
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
 

}



