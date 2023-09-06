/*
 * @Author: your name
 * @Date: 2022-01-20 11:26:15
 * @LastEditTime: 2023-08-30 10:25:04
 * @LastEditors: chenyang.sun chenyang.sun@cocos.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \AssaHunterMaster\assets\Scripts\DirectorOverwrite.ts
 */

import { _decorator, Component, director } from 'cc';
const { ccclass } = _decorator;

@ccclass('TimeScale')
export class TimeScale extends Component {
    static scale = 1
    start () {
        const originalTick = director.tick;
        director.tick = (dt: number) => {
            dt *= TimeScale.scale;
            originalTick.call(director, dt);
        }
    }
}


