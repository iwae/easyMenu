import { _decorator, Color, Component, instantiate, Node, Prefab, Size, UITransform, Vec3 } from 'cc';
import { eGroup } from './eGroup';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('EasyMenu')
@executeInEditMode(true)
export class eMenu extends Component {
    @property(Size)
    set MenuItemSize(v) {
        this._size = v;
    }
    get MenuItemSize() {
        return this._size;
    }
    @property(Prefab)
    GroupPrefab: Prefab = null;

    @property({ visible: false })
    private _size: Size = new Size(200, 30);
    private _groups = new Map<string,Node>;
    private _isVisible: boolean = true;

    /**
     * @Description: add new group to menu
     * @param {string} name name of menu, could be used to delete group
     * @return {*}
     */
    addGroup(name?:string):eGroup{
        const groupNode = instantiate(this.GroupPrefab);
        const easyGroup  = groupNode.getComponent(eGroup);
        if(name){
            easyGroup.groupName = name
            this._groups.set(name,groupNode);
        }
        easyGroup.parentComp  = this;

        easyGroup.size  = this._size;
        groupNode.parent = this.node;
        return easyGroup;
    };
    /**
     * @Description: get group by name
     * @param {string} name
     * @return {*}
     */
    getGroup(name:string){
        return this._groups.get(name)||null;
    };

    /**
     * @Description: delete group by name
     * @param {string} name
     * @return {*}
     */
    deleteGroup(name:string){
        const group = this.getGroup(name);
        if(group){
            this._groups.delete(name);
            group.removeFromParent();
            group.destroy();
        }
    };

    resetSize(node) {
        const tranform = node.getComponent(UITransform);
        tranform && tranform.setContentSize(this.MenuItemSize);
    };

}

