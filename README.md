# easyMenu
easyMenu is a component to help developers to add menus easily in Cocos Creator

![image](https://github.com/iwae/easyMenu/assets/26038745/80b44753-5222-4223-840e-d7141c8fccaa)

it presets few functions for 2d/3d game tests.

### FPS Monitor
![122](https://github.com/iwae/easyMenu/assets/26038745/d39d5829-45d1-45ad-9e7d-effec50bf63b)


## how to use 
copy easyMenu to your project, and add EasyMenu to the Canvas

![image](https://github.com/iwae/easyMenu/assets/26038745/f65c65b1-df16-4014-b64f-3ad579a60041)



## add group

![image](https://github.com/iwae/easyMenu/assets/26038745/05c1f225-6d05-47fc-8378-5d46054fb140)

``` typescript
    const menu = director.getScene().getChildByName('Canvas').getComponentInChildren(eMenu);
    if(!menu) return;
    const group = menu.addGroup("Scene");

```

## add item
``` typescript
    group.addItem("Default",()=>{
          this.defaultScene();
    });
```

## add toggle
``` typescript
  
     group.addToggle("High FPS", (t) => {
           game.frameRate = t ? 60 : 30;
     });
```

## add list
``` typescript
  
     group.addList("Image Memory",
           this.getImageMemory.bind(this)
    );
```
## add slider
``` typescript
  
     group.addSlider("Scale", (v: number) => {
           timeScale.scale = v;
     }, 1);
```
## add editbox
``` typescript
     group.addEdit("edit", "default",((input:string)=>{

     });
```
## add graph
``` typescript
    group.addGraph("FPS", null, 60, 14);

    this.graph = group.node.getChildByName("FPS").getComponent(eGraph);

    this.graph.callback = (() => {
        const output = this.graph.positions.toString();
        console.log("FPS History", output)
        this.copyToClipboard(output);
    })
```
## add multi items
``` typescript
   this.menu
    .addGroup("Debug")
    .addToggle("Profiler", (t) => {
        t ? profiler.showStats() : profiler.hideStats();
    })
    .addSlider("Scale", (v: number) => {
        TimeScale.scale = v;
    }, 1)
    .addItem("Game Time", () => {
        return "GameTime: " + Math.floor(game.totalTime) + " ms";
    })
    .addToggle("High FPS", (t) => {
        game.frameRate = t ? 60 : 30;
    })
    .addItem("Overdraw Test",
        this.testOverdraw.bind(this)
    )
    .addList("Image Memory",
        this.getImageMemory.bind(this)
    )
```
