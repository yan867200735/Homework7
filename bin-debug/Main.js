//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    p.createGameScene = function () {
        var sky = this.createBitmapByName("bgImage");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        var Taskser = TaskService.getInstance();
        this.run(Taskser);
    };
    p.run = function (tasker) {
        var _this = this;
        var npcwrodPanel = new NPCwrodPanel();
        var npc_0 = new NPC(0, npcwrodPanel);
        var npc_1 = new NPC(1, npcwrodPanel);
        var taskPanel = new TaskPanel();
        var TaskButton = this.createBitmapByName("任务按钮_png");
        TaskButton.x = this.stage.stageWidth - TaskButton.width;
        TaskButton.y = 0;
        var task0 = new Task(tasks[0].id, tasks[0].name, tasks[0].desc, TaskStatus.ACCEPTABLE, tasks[0].fromNPCid, tasks[0].toNPCid);
        var task1 = new Task(tasks[1].id, tasks[1].name, tasks[1].desc, TaskStatus.UNACCEPTABLE, tasks[1].fromNPCid, tasks[1].toNPCid);
        this.addChild(npc_0);
        this.addChild(npc_1);
        this.addChild(TaskButton);
        npc_0.x = 26;
        npc_0.y = 133;
        npc_1.x = 326;
        npc_1.y = 333;
        tasker.observerList.push(taskPanel);
        tasker.observerList.push(npc_0);
        tasker.observerList.push(npc_1);
        tasker.taskList.push(task0);
        tasker.taskList.push(task1);
        TaskButton.touchEnabled = true;
        npc_0.touchEnabled = true;
        npc_1.touchEnabled = true;
        npc_0.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { _this.NPCisClick(npc_0, npcwrodPanel); }, this);
        TaskButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { return (_this.showTaskPanel(taskPanel)); }, this);
        npc_1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.NPCisClick(npc_1, npcwrodPanel);
            if (task0.status == 2) {
                tasker.reach(task0.id);
            }
        }, this);
        tasker.notifyall();
    };
    p.showTaskPanel = function (taskPanel) {
        this.addChild(taskPanel);
        taskPanel.onShow();
    };
    p.NPCisClick = function (npc, npcwp) {
        npcwp.onclose();
        npc.onNPCClick();
        this.addChild(npcwp);
        npcwp.onShow();
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
/**
 * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
 * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
 */
//# sourceMappingURL=Main.js.map