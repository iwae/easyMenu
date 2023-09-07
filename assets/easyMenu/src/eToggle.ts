import { _decorator, Color, Component, director, EventHandler, Label, Node, Sprite, sys, Toggle } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;
const tempC_1 = new Color()

@ccclass('Easy Toggle')

export class eToggle extends Component {
    @property(Sprite)
    BgSprite: Sprite = null;
    @property(Sprite)
    SideSprite: Sprite = null;
    @property(Label)
    NameLable: Label = null;
    @property(Toggle)
    toggle:Toggle = null;
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
    public callback: (bool:boolean)=>void;
    public eventData: any;


    init(name: string,cb?: (bool:boolean)=>void) {
        this.node.name = name;
        this.NameLable.string = name;
        cb && (this.callback = cb);
    }

    onEnable() {
        this.onNormal();
        if(sys.platform=sys.Platform.DESKTOP_BROWSER){
            this.node.on(Node.EventType.MOUSE_ENTER, this.onPress, this);
            this.node.on(Node.EventType.MOUSE_LEAVE, this.onNormal, this);
        }
    }
    onDisable() {
        if(sys.platform=sys.Platform.DESKTOP_BROWSER){
            this.node.off(Node.EventType.MOUSE_ENTER, this.onPress, this);
            this.node.off(Node.EventType.MOUSE_LEAVE, this.onNormal, this);
        }
    }
    onToggleCallback(toggle: Toggle){
        this.callback && this.callback(toggle.isChecked);
    }

    changeColor(press){
        this.BgSprite.color = tempC_1.set(this.BgColor.r * press, this.BgColor.g * press, this.BgColor.b * press);
    }
    onPress(){
        this.changeColor(this.pressStrenth);
    }
    onNormal(){
        this.changeColor(1);
    }


}



