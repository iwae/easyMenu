import { _decorator, Color, Component, game, Graphics, Label, Node, Sprite, sys, UITransform, Vec3 } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;
const tempC_1 = new Color()
const tempVec3 = new Vec3();

@ccclass('Easy Graph')
export class eGraph extends Component {
    @property(Sprite)
    BgSprite: Sprite = null;
    @property(Sprite)
    SideSprite: Sprite = null;
    @property(Label)
    NameLable: Label = null;
    @property(Graphics)
    LineGraph: Graphics = null;
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
    public callback: () => string | void | number;
    positions:any[]=[];
    _x = 100;
    _y = 18;
    _points = 10;
    _limit = 60;


    updateData(data:number){
        const length = this.positions.length;
        if(length>= this._points){
            this.positions.shift()
        }
        this.positions.push(data);
        this.drawLine();
    }

    init(name: string, cb?: () => string | void | number,limit=60,points= 10) {
        this.node.name = name;
        this.NameLable.string = name;
        cb && (this.callback = cb);
        const size = this.LineGraph.getComponent(UITransform);
        this._x = size.width;
        this._y = size.height*0.85;
        this._limit = limit;
        this._points = Math.max(Math.floor(points),3);
    }

    drawLine(){
        const length = this.positions.length;
        if(length<2) return;
        this.LineGraph.clear();
        const x = this._x*0.5;
        const y = this._y*0.5;
        const height = this._y;
        const offset = this._x/(this._points-1); 
        for(var i=0;i<length;i++){
            const scale = Math.min(this.positions[i]/this._limit,1.05);
            const _y = height *scale-y;
            const _x = i*offset-x;
            if(i==0){
                this.LineGraph.moveTo(_x, _y);
            }else{

                this.LineGraph.lineTo(_x, _y);
            }
        }
        this.LineGraph.stroke();
    }

    onEnable() {
        this.onNormal();
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
        if (sys.platform = sys.Platform.DESKTOP_BROWSER) {
            this.node.on(Node.EventType.MOUSE_ENTER, this.onPress, this);
            this.node.on(Node.EventType.MOUSE_LEAVE, this.onNormal, this);
        }
    }
    onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
        if (sys.platform = sys.Platform.DESKTOP_BROWSER) {
            this.node.off(Node.EventType.MOUSE_ENTER, this.onPress, this);
            this.node.off(Node.EventType.MOUSE_LEAVE, this.onNormal, this);
        }
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
        const result = this.callback();
        if (result) {
            this.NameLable.string = String(result) || this.NameLable.string;
        }
    }

  
}



