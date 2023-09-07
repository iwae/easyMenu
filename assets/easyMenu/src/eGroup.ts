import { _decorator, Color, Component, EventTouch, game, instantiate, Label, Node, Prefab, Quat, Size, UITransform } from 'cc';
import { eItem } from './eItem';
import { eSlider } from './eSlider';
import { eToggle } from './eToggle';
import { eMenu } from './eMenu';
import { eEdit } from './eEdit';
import { eList } from './eList';
import { eGraph } from './eGraph';
const { ccclass, property, executeInEditMode } = _decorator;

const _tempQuat = new Quat();

@ccclass('EasyGroup')
export class eGroup extends Component {

    @property(Node) arrow: Node;
    @property(Node) tittle: Node;
    @property(Prefab) menuItem: Prefab;
    @property(Prefab) sliderItem: Prefab;
    @property(Prefab) toggleItem: Prefab;
    @property(Prefab) groupItem: Prefab;
    @property(Prefab) editItem: Prefab;
    @property(Prefab) listItem: Prefab;
    @property(Prefab) graphItem: Prefab;
    @property(Label) nameLabel: Label;

    private _size: Size = new Size(200, 30);
    private _item: eItem = null;
    private _isVisible: boolean = true;
    private _groupName = ""
    public parentComp: eMenu;
    private _time = 0;

    set size(v) {
        this._size = v;
        this.setMenuNode();
    }
    get size() {
        return this._size;
    }

    set groupName(v) {
        this._groupName = v;
        this.nameLabel.string = v;
    }

    getParent() {
        return this.parentComp as eMenu;
    }

    onEnable() {
        this.tittle.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.tittle.on(Node.EventType.TOUCH_END, this.changeVisible, this);
        this.tittle.on(Node.EventType.TOUCH_MOVE, this.dragPos, this);
    }
    onDisable() {
        this.tittle.off(Node.EventType.TOUCH_START, this.touchStart, this);
        this.tittle.on(Node.EventType.TOUCH_MOVE, this.dragPos, this);
        this.tittle.off(Node.EventType.TOUCH_END, this.changeVisible, this);
    }
    touchStart() {
        this._time = game.totalTime;
    }

    dragPos(event: EventTouch) {
        const delay = game.totalTime - this._time;
        if (delay < 90) return;
        const parent = this.node.parent;
        const touch = event.touch;
        const pos = touch.getUILocation()
        parent.setWorldPosition(pos.x, pos.y, 0);
    }
    /**
     * @Description: add new group comp
     * @param {string} name
     * @return {*}
     */
    addGroup(name: string): eGroup {
        const item = instantiate(this.groupItem);
        const easyGroup = item.getComponent(eGroup);
        easyGroup.size = this.size
        item.parent = this.node;
        if (name) {
            easyGroup.groupName = name
        }
        easyGroup.parentComp = this.getParent();
        return easyGroup;
    }

    /**
     * @Description: add new slider comp
     * @param {string} name default name for slider
     * @param {function} cb callback
     * @param {number} value
     * @param {*} scale
     * @return {*}
     */
    addSlider(name: string, cb?: (progress: number) => void, value?: number, scale?: number, tempSlider?:eSlider): eGroup {
        const item = instantiate(this.sliderItem);
        const tranform = item.getComponent(UITransform);
        tranform.height = this._size.height;
        tranform.width = this._size.width;
        item.parent = this.node;
        const sliderItem = item.getComponent(eSlider);
        sliderItem.slider.progress = value;
        sliderItem.editbox.string = "" + value;
        sliderItem && sliderItem.init(name, cb, scale);
        tempSlider && (tempSlider = sliderItem);
        return this;
    }
    /**
     * @Description: add new editbox comp
     * @param {string} name name of the comp
     * @param {string} editbox default editbox's string
     * @param {function} cb edit callback
     * @return {*}
     */
    addEdit(name: string, editbox: string | number, cb?: (input: string) => void): eGroup {
        const item = instantiate(this.editItem);
        const tranform = item.getComponent(UITransform);
        tranform.height = this._size.height;
        tranform.width = this._size.width;
        item.parent = this.node;
        const editItem = item.getComponent(eEdit);
        editItem && editItem.init(name, editbox, cb);
        return this;
    }
     /**
     * @Description: add new item comp, could be use for btn or string
     * @param {string} name name of graph comp
     * @param {function} cb call back for graph click event
     * @return {*} 
     */
     addGraph(name: string, cb?: () => string | void | number,limit=60,points= 10): eGroup{
        const item = instantiate(this.graphItem);
        const tranform = item.getComponent(UITransform);
        tranform.height = this._size.height;
        tranform.width = this._size.width;
        item.parent = this.node;
        const graphItem = item.getComponent(eGraph);
        graphItem && graphItem.init(name, cb,limit,points);
        return this;
    }
    /**
     * @Description: add new item comp, could be use for btn or string
     * @param {string} name name of item comp
     * @param {function} cb call back for item click event
     * @return {*} 
     */
    addItem(name: string, cb?: () => string | void | number): eGroup  {
        const item = instantiate(this.menuItem);
        const tranform = item.getComponent(UITransform);
        tranform.height = this._size.height;
        tranform.width = this._size.width;
        item.parent = this.node;
        const menuItem = item.getComponent(eItem);
        menuItem && menuItem.init(name, cb);
        return this;
    }
    /**
   * @Description: 添加list
   * @param {string} name list组件名字
   * @param {function} cb 是否需要回调 可以是方法/string/number
   * @return {*} 
   */
    addList(name: string, cb?: () => string | void | number): eGroup {
        const item = instantiate(this.listItem);
        const tranform = item.getComponent(UITransform);
        tranform.width = this._size.width;
        item.parent = this.node;
        const listItem = item.getComponent(eList);
        listItem && listItem.init(name, cb);
        return this;
    }
    /**
     * @Description: add toggle comp
     * @param {string} name name of toggle comp
     * @param {function} cb toggle callback
     * @param {*} checked toggle's default checked state
     * @return {*}
     */
    addToggle(name: string, cb?: (bool: boolean) => void, checked = true): eGroup {
        const item = instantiate(this.toggleItem);
        const tranform = item.getComponent(UITransform);
        tranform.height = this._size.height;
        tranform.width = this._size.width;
        item.parent = this.node;
        const toggleItem = item.getComponent(eToggle);
        toggleItem.toggle.isChecked = checked;
        toggleItem && toggleItem.init(name, cb);
        return this;
    }

    setMenuNode() {
        this.resetSize(this.node);
        const children = this.node.children;
        if (children.length > 0) {
            children.forEach((c) => {
                this.resetSize(c);
            })
        }
    }

    resetSize(node) {
        const tranform = node.getComponent(UITransform);
        tranform && tranform.setContentSize(this._size);
    }
    resetItem(item: eItem) {
        if (this._item != item && this._item) this._item.onNormal();
        this._item = item;
    }
    changeVisible() {
        this._isVisible = !this._isVisible;
        const children = this.node.children;
        this.arrow.rotation = Quat.fromAngleZ(_tempQuat, (this._isVisible ? -90 : 0));
        for (var i = 1; i < children.length; i++) {
            children[i].active = this._isVisible;
        }
    }
}

