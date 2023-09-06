import { Component, _decorator, Vec3, EventTouch, Touch, Quat, Vec2, Node, EventMouse, lerp, macro, input, Input,sys } from 'cc'
import { EDITOR } from 'cc/env';

const { ccclass, property, type, executeInEditMode } = _decorator;

let tempVec3 = new Vec3();
let tempVec3_2 = new Vec3();
let tempQuat = new Quat();
let tempVec2 = new Vec2();
let tempVec2_2 = new Vec2();
let DeltaFactor = 1 / 200;

@ccclass('OrbitCamera')
export default class OrbitCamera extends Component {

    @property enableTouch = true;
    @property enableScaleRadius = false;
    @property rotateSpeed = 1;
    @property followSpeed = 1;
    @property xRotationRange = new Vec2(5, 70);
    @type(Node) _target: Node;
    @property radiusScaleSpeed = 1;
    @property minRadius = 5;
    @property maxRadius = 10;
    @property followTargetRotationY = true;
    @property height = 4;

    @property
    get radius() {
        return this._targetRadius;
    }
    set radius(v) {
        this._targetRadius = v;
    }

    @type(Node)
    get target() {
        return this._target;
    }
    set target(v) {
        this._target = v;
        this._targetRotation.set(this._startRotation);
        this._targetCenter.set(v!.worldPosition);
    }

    @property
    get preview() {
        return false
    }
    set preview(v) {
        this.resetCam(1);
    }

    @property
    get targetRotation(): Vec3 {
        return this._startRotation;
    }
    set targetRotation(v: Vec3) {
        this._targetRotation.set(v);
        this._startRotation.set(v);
    }


    @property({ visible: false }) private _startRotation = new Vec3;
    @property({ visible: false }) private _targetRadius = 10;

    private _center = new Vec3;
    private _targetCenter = new Vec3;
    private _touched = false;
    private _targetRotation = new Vec3;
    private _rotation = new Quat
    private _radius = 10;
    private dis = 0;

    start() {
        if (!this._target){
            this._target = new Node("target");
            this._target.parent = this.node.parent;
            this._target.setPosition(Vec3.ZERO);
        }

        if (EDITOR) {
            this.resetCam(1);
            return;
        }

        this.init();

    }

    init() {
        macro.ENABLE_MULTI_TOUCH = true;

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this)
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this)

        this.resetTargetRotation();
        Quat.fromEuler(this._rotation, this._targetRotation.x, this._targetRotation.y, this._targetRotation.z);
   
        if (this.target) {
            this._targetCenter.set(this.target.worldPosition);
            this._center.set(this._targetCenter);
        }

        this._radius = this.radius;

        this.limitRotation()

        if (this.enableScaleRadius && sys.platform == sys.Platform.DESKTOP_BROWSER) {
            input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this)
        }

    }

    resetTargetRotation() {
        let targetRotation = this._targetRotation.set(this._startRotation);
        if (this.followTargetRotationY) {
            targetRotation = tempVec3_2.set(targetRotation);
            Quat.toEuler(tempVec3, this.target!.worldRotation);
            targetRotation.y += tempVec3.y;
        }
    }

    onTouchStart(event?: EventTouch) {
        this._touched = true;
    }


    onTouchMove(event?: EventTouch) {

        if (!this._touched) return;

        const touch = event.touch;

        const touches = event.getAllTouches();
        /* scale radius for mobile multi touch */
        if (touches.length > 1) {
            const changedTouches = event.getTouches();

            let touch1: Touch = null!;
            let touch2: Touch = null!;
            if (changedTouches.length > 1) {
                touch1 = touches[0];
                touch2 = touches[1];

            } else {
                touch1 = touch;
                const diffID = touch1.getID();
                for (let i = 0; i < touches.length; i++) {
                    const element = touches[i];
                    if (element.getID() !== diffID) {
                        touch2 = element;
                        break;
                    }
                }
            }
            touch1.getLocation(tempVec2);
            touch2.getLocation(tempVec2_2);
            let dis = Vec2.distance(tempVec2, tempVec2_2)
            let delta = dis - this.dis
            this._targetRadius += this.radiusScaleSpeed * -Math.sign(delta) * 0.3;
            this._targetRadius = Math.min(this.maxRadius, Math.max(this.minRadius, this._targetRadius));
            this.dis = dis;
        }

        tempVec2 = touch!.getDelta()

        this.setRotate(tempVec2)
    }

    onTouchEnd() {
        this._touched = false;
    }

    setRotate(v2: Vec2) {
        Quat.fromEuler(tempQuat, this._targetRotation.x, this._targetRotation.y, this._targetRotation.z);

        Quat.rotateX(tempQuat, tempQuat, -v2.y * DeltaFactor);
        Quat.rotateAround(tempQuat, tempQuat, Vec3.UP, -v2.x * DeltaFactor);

        Quat.toEuler(this._targetRotation, tempQuat);

        this.limitRotation()
    }


    onMouseWheel(event: EventMouse) {
        let scrollY = event.getScrollY();
        this._targetRadius += this.radiusScaleSpeed * -Math.sign(scrollY);
        this._targetRadius = Math.min(this.maxRadius, Math.max(this.minRadius, this._targetRadius));
    }

    limitRotation() {
        let rotation = this._targetRotation;
        if (rotation.x < this.xRotationRange.x) {
            rotation.x = this.xRotationRange.x
        }
        else if (rotation.x > this.xRotationRange.y) {
            rotation.x = this.xRotationRange.y
        }
        rotation.z = 0;
    }


    lateUpdate(dt) {
        this.resetCam(dt);
    }

    resetCam(dt) {

        let targetRotation = this._targetRotation;
        this._targetCenter.set(this.target.worldPosition);
        this._targetCenter.y += this.height;

        if (this.followTargetRotationY) {
            targetRotation = tempVec3_2.set(targetRotation);
            Quat.toEuler(tempVec3, this.target.worldRotation);
            targetRotation.y += tempVec3.y;
        }

        Quat.fromEuler(tempQuat, targetRotation.x, targetRotation.y, targetRotation.z);

        Quat.slerp(this._rotation, this._rotation, tempQuat, dt * 7 * this.rotateSpeed);

        Vec3.lerp(this._center, this._center, this._targetCenter, dt * 5 * this.followSpeed);

        this._radius = lerp(this._radius, this._targetRadius, dt * 10);

        Vec3.transformQuat(tempVec3, Vec3.FORWARD, this._rotation);

        Vec3.multiplyScalar(tempVec3, tempVec3, this._radius)
        tempVec3.add(this._center)

        this.node.position = tempVec3;
        this.node.lookAt(this._center);
    }

}
