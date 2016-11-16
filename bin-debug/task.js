var TaskPanel = (function (_super) {
    __extends(TaskPanel, _super);
    function TaskPanel() {
        _super.call(this);
        this.textField = [];
        this.nowtaskList = [];
        this.stageH = 1136;
        this.stageW = 640;
        this.myphoto = this.createBitmapByName("任务panel_png");
        this.cancelButton = this.createBitmapByName("取消_png");
        this.cancelButton.touchEnabled = true;
        this.addChild(this.myphoto);
        this.addChild(this.cancelButton);
        this.cancelButton.x = this.cancelButton.width;
        this.cancelButton.y = this.cancelButton.height;
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
    }
    var d = __define,c=TaskPanel,p=c.prototype;
    p.onChange = function (task) {
        if (task.status >= 2 && task.status < 4) {
            var k = 0;
            for (var i = 0; i < this.nowtaskList.length; i++) {
                if (task.id == this.nowtaskList[i].id) {
                    this.nowtaskList.splice(i, 1, task);
                    k++;
                }
            }
            if (k == 0) {
                this.nowtaskList.push(task);
            }
        }
        if (task.status == 4) {
            for (var i = 0; i < this.nowtaskList.length; i++) {
                if (task.id == this.nowtaskList[i].id) {
                    this.nowtaskList.splice(i, 1);
                }
            }
        }
    };
    p.onButtonClick = function () {
        this.onClose();
    };
    p.onShow = function () {
        var i = 0;
        for (i; i < this.nowtaskList.length && this.nowtaskList.length != 0; i++) {
            var tx = new egret.TextField();
            this.textField.push(tx);
            this.textField[i].text = this.nowtaskList[i].name + "  " + this.nowtaskList[i].desc;
            this.addChild(this.textField[i]);
            this.textField[i].x = 50;
            this.textField[i].y = 100 + 100 * i;
        }
    };
    p.onClose = function () {
        for (var i = 0; i < this.textField.length; i++) {
            this.removeChild(this.textField[i]);
        }
        this.textField.splice(0, this.textField.length);
        this.parent.removeChild(this);
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return TaskPanel;
}(egret.DisplayObjectContainer));
egret.registerClass(TaskPanel,'TaskPanel',["Observer"]);
var NPCwrodPanel = (function (_super) {
    __extends(NPCwrodPanel, _super);
    function NPCwrodPanel() {
        _super.call(this);
        this.count = 0;
        this.textNPC = new egret.TextField();
        this.textField = new egret.TextField();
        this.stageH = 1136;
        this.stageW = 640;
        this.buttonShow = 0;
        this.myphoto = this.createBitmapByName("对话框01_png");
        this.x = 0;
        this.y = this.stageH - this.myphoto.height;
        this.acceptButton = this.createBitmapByName("接受_png");
        this.cancelButton = this.createBitmapByName("取消_png");
        this.finishButton = this.createBitmapByName("完成_png");
        this.acceptButton.x = this.finishButton.x = this.stageW - this.acceptButton.width * 3 - this.x;
        this.acceptButton.y = this.finishButton.y = this.stageH - this.acceptButton.height * 2 - this.y;
        this.cancelButton.x = this.stageW - this.acceptButton.width * 1.5 - this.x;
        this.cancelButton.y = this.stageH - this.acceptButton.height * 2 - this.y;
        this.textNPC.x = 30;
        this.textNPC.y = 50;
        this.textField.x = 30;
        this.textField.y = 100;
        this.textField.text = "";
        this.addChild(this.myphoto);
        this.addChild(this.textNPC);
        this.addChild(this.textField);
        this.addChild(this.cancelButton);
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclose, this);
        this.acceptButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        this.finishButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
    }
    var d = __define,c=NPCwrodPanel,p=c.prototype;
    ;
    p.onShow = function () {
        this.count++;
        this.textNPC.text = this.npcname;
        this.cancelButton.touchEnabled = true;
    };
    p.onclose = function () {
        if (this.count != 0) {
            if (this.buttonShow == 1) {
                this.removeChild(this.acceptButton);
                this.buttonShow = 0;
                this.acceptButton.touchEnabled = false;
            }
            if (this.buttonShow == 2) {
                this.removeChild(this.finishButton);
                this.buttonShow = 0;
                this.finishButton.touchEnabled = false;
            }
            this.parent.removeChild(this);
            this.count = 0;
            this.npcname = "";
            this.textField.text = "";
            this.cancelButton.touchEnabled = false;
        }
    };
    p.showMyTask = function (task) {
        this.taskid = task.id;
        this.textField.text = task.desc;
        if (task.status == 1) {
            this.addChild(this.acceptButton);
            this.buttonShow = 1;
            this.acceptButton.touchEnabled = true;
        }
        if (task.status == 3) {
            this.addChild(this.finishButton);
            this.buttonShow = 2;
            this.finishButton.touchEnabled = true;
        }
    };
    p.onButtonClick = function () {
        if (this.buttonShow == 1) {
            var tas = TaskService.getInstance();
            tas.accept(this.taskid);
            if (this.taskid == tasks[1].id) {
                tas.reach(this.taskid);
            }
        }
        if (this.buttonShow == 2) {
            var tas = TaskService.getInstance();
            tas.finish(this.taskid);
        }
        this.onclose();
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return NPCwrodPanel;
}(egret.DisplayObjectContainer));
egret.registerClass(NPCwrodPanel,'NPCwrodPanel');
var Task = (function () {
    function Task(id, name, desc, status, fromNPCid, toNPCid) {
        this.id = id;
        this.desc = desc;
        this.name = name;
        this.desc = desc;
        this.status = status;
        this.fromNPCid = fromNPCid;
        this.toNPCid = toNPCid;
    }
    var d = __define,c=Task,p=c.prototype;
    return Task;
}());
egret.registerClass(Task,'Task');
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["UNACCEPTABLE"] = 0] = "UNACCEPTABLE";
    TaskStatus[TaskStatus["ACCEPTABLE"] = 1] = "ACCEPTABLE";
    TaskStatus[TaskStatus["DURING"] = 2] = "DURING";
    TaskStatus[TaskStatus["CAN_SUBMIT"] = 3] = "CAN_SUBMIT";
    TaskStatus[TaskStatus["SUBMITTED"] = 4] = "SUBMITTED";
})(TaskStatus || (TaskStatus = {}));
var NPC = (function (_super) {
    __extends(NPC, _super);
    function NPC(i, npcwp) {
        _super.call(this);
        this.id = NPCs[i].id;
        this.myname = NPCs[i].myname;
        this.myphoto = this.createBitmapByName(NPCs[i].myphoto);
        this.addChild(this.myphoto);
        this.emoji = this.createBitmapByName(emojis[0].name);
        this.addChild(this.emoji);
        this.emoji.x += this.myphoto.width / 5;
        this.emoji.y -= this.myphoto.height / 4;
        this.myPanel = npcwp;
        this.myword = "快去做任务吧";
    }
    var d = __define,c=NPC,p=c.prototype;
    p.onChange = function (task) {
        if (task.fromNPCid == this.id) {
            if (task.status == 1)
                this.emoji.texture = RES.getRes(emojis[1].name);
            if (task.status == 2)
                this.emoji.texture = RES.getRes(emojis[0].name);
        }
        if (task.toNPCid == this.id && task.status > 1) {
            var i;
            for (i = 0; true; i++) {
                if (TaskStatus[TaskStatus[i]] == task.status) {
                    this.emoji.texture = RES.getRes(emojis[i].name);
                    break;
                }
            }
        }
    };
    p.onNPCClick = function () {
        this.myPanel.npcname = this.myname;
        var tas = TaskService.getInstance();
        var ta = tas.getTaskBYCustomRule(this.rule1, this);
        if (ta != null) {
            //         console.log(ta.id);
            this.myPanel.showMyTask(ta);
        }
    };
    p.rule1 = function (tasks, npc) {
        var ta;
        for (var i = 0; i < tasks.length; i++) {
            //      console.log(tasks[i].id+""+tasks[i].toNPCid);
            if (tasks[i].toNPCid == npc.id) {
                if (tasks[i].status != 0 && tasks[i].status != 4 && tasks[i].status != 1) {
                    ta = tasks[i];
                    return ta;
                }
            }
            if (tasks[i].fromNPCid == npc.id) {
                if (tasks[i].status == 1) {
                    ta = tasks[i];
                    return ta;
                }
            }
        }
        return null;
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return NPC;
}(egret.DisplayObjectContainer));
egret.registerClass(NPC,'NPC',["Observer"]);
var TaskService = (function () {
    function TaskService() {
        this.observerList = [];
        this.taskList = [];
        TaskService.count++;
        if (TaskService.count > 1) {
            throw 'singleton';
        }
    }
    var d = __define,c=TaskService,p=c.prototype;
    TaskService.getInstance = function () {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    };
    p.finish = function (id) {
        for (var _i = 0, _a = this.taskList; _i < _a.length; _i++) {
            var ta = _a[_i];
            if (ta.id == id) {
                ta.status = TaskStatus.SUBMITTED;
                this.notify(ta);
                this.notifyall();
            }
        }
    };
    p.reach = function (id) {
        for (var _i = 0, _a = this.taskList; _i < _a.length; _i++) {
            var ta = _a[_i];
            if (ta.id == id) {
                ta.status = TaskStatus.CAN_SUBMIT;
                this.notify(ta);
            }
        }
    };
    p.canAccept = function (id) {
        for (var _i = 0, _a = this.taskList; _i < _a.length; _i++) {
            var ta = _a[_i];
            if (ta.id == id) {
                ta.status = TaskStatus.ACCEPTABLE;
                this.notify(ta);
            }
        }
    };
    p.accept = function (id) {
        for (var _i = 0, _a = this.taskList; _i < _a.length; _i++) {
            var ta = _a[_i];
            if (ta.id == id) {
                ta.status = TaskStatus.DURING;
                this.notify(ta);
            }
        }
    };
    p.getTaskBYCustomRule = function (rule, npc) {
        return rule(this.taskList, npc);
    };
    p.notify = function (ta) {
        for (var _i = 0, _a = this.observerList; _i < _a.length; _i++) {
            var ob = _a[_i];
            ob.onChange(ta);
        }
        //      console.log(ta.id,ta.desc,ta.name);
    };
    p.notifyall = function () {
        for (var _i = 0, _a = this.observerList; _i < _a.length; _i++) {
            var ob = _a[_i];
            for (var _b = 0, _c = this.taskList; _b < _c.length; _b++) {
                var ta = _c[_b];
                ob.onChange(ta);
                if (ta.id == tasks[0].id && ta.status == 4) {
                    for (var _d = 0, _e = this.taskList; _d < _e.length; _d++) {
                        var ta2 = _e[_d];
                        if (ta2.id == tasks[1].id && ta2.status == 0) {
                            ta2.status = TaskStatus.ACCEPTABLE;
                            //console.log("gai");
                            this.notify(ta2);
                        }
                    }
                }
            }
        }
    };
    TaskService.count = 0;
    return TaskService;
}());
egret.registerClass(TaskService,'TaskService');
var tasks = [
    { id: "task_00", name: "任务一", desc: "请跟右边NPC对话", fromNPCid: "npc_0", toNPCid: "npc_0" },
    { id: "task_01", name: "哦？你来了", desc: "去左边交任务吧", fromNPCid: "npc_1", toNPCid: "npc_0" },
];
var NPCs = [
    { id: "npc_0", myname: "任务一", myphoto: "npc2_png" },
    { id: "npc_1", myname: "(⊙v⊙)嗯", myphoto: "npc_png" },
];
var emojis = [
    { name: "" },
    { name: "叹号_png" },
    { name: "问号灰_png" },
    { name: "问号黄_png" },
    { name: "" },
];
//# sourceMappingURL=task.js.map