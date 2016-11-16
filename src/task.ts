interface Observer {
     onChange(task:Task);

}
class TaskPanel extends egret.DisplayObjectContainer implements Observer{ 
    myphoto:egret.Bitmap;
    textField:egret.TextField[]=[];
    cancelButton:egret.Bitmap;
    nowtaskList:Task[]=[];
    stageH=1136;
    stageW=640;
    constructor(){
        super();
        this.myphoto=this.createBitmapByName("任务panel_png");
        this.cancelButton=this.createBitmapByName("取消_png");
        this.cancelButton.touchEnabled=true;
        this.addChild(this.myphoto);
        this.addChild(this.cancelButton);
        this.cancelButton.x=this.cancelButton.width;
        this.cancelButton.y=this.cancelButton.height;
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);

    }
    onChange(task:Task) {
        if(task.status>=2&&task.status<4){
            var k=0;
            for(let i=0;i<this.nowtaskList.length;i++){
                if(task.id==this.nowtaskList[i].id){
                    this.nowtaskList.splice(i,1,task);
                    k++;
                }
            }
            if(k==0){
                this.nowtaskList.push(task);
            }

        }if(task.status==4){
            for(let i=0;i<this.nowtaskList.length;i++){
                if(task.id==this.nowtaskList[i].id){
                    this.nowtaskList.splice(i,1);
                    
                }
            }
        }

    }
    onButtonClick() {
        this.onClose();
    }
    onShow() {
        var i=0;
        for(i;i<this.nowtaskList.length&&this.nowtaskList.length!=0;i++){
            var tx=new egret.TextField();
            this.textField.push(tx);
            this.textField[i].text=this.nowtaskList[i].name+"  "+this.nowtaskList[i].desc;
            this.addChild(this.textField[i]);
            this.textField[i].x=50;
            this.textField[i].y=100+100*i;
        }
        
        
    }
    onClose() {
        for(let i=0;i<this.textField.length;i++){
            this.removeChild(this.textField[i]);
        }
        this.textField.splice(0,this.textField.length);
        this.parent.removeChild(this);
    }
     private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}

class NPCwrodPanel extends egret.DisplayObjectContainer{ 
    count:number=0;
    textNPC:egret.TextField=new egret.TextField();
    npcname:string;
    textField:egret.TextField=new egret.TextField();;
    myphoto:egret.Bitmap;
    button:egret.Bitmap;
    stageH=1136;
    stageW=640;
    buttonShow=0;
    taskid:string;
    acceptButton:egret.Bitmap;
    cancelButton:egret.Bitmap;
    finishButton:egret.Bitmap;
    constructor(){
        super();
        this.myphoto=this.createBitmapByName("对话框01_png");
        this.x=0;
        this.y=this.stageH-this.myphoto.height;
        this.acceptButton=this.createBitmapByName("接受_png");
        this.cancelButton=this.createBitmapByName("取消_png");
        this.finishButton=this.createBitmapByName("完成_png");
        this.acceptButton.x=this.finishButton.x=this.stageW-this.acceptButton.width*3-this.x;
        this.acceptButton.y=this.finishButton.y=this.stageH-this.acceptButton.height*2-this.y;
        this.cancelButton.x=this.stageW-this.acceptButton.width*1.5-this.x;
        this.cancelButton.y=this.stageH-this.acceptButton.height*2-this.y;
        this.textNPC.x=30;
        this.textNPC.y=50;
        this.textField.x=30;
        this.textField.y=100;
        this.textField.text="";
        this.addChild(this.myphoto);
        this.addChild(this.textNPC);     
        this.addChild(this.textField); 
        this.addChild(this.cancelButton);
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onclose,this);
        this.acceptButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);
        this.finishButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);


    }
    public onShow() {
        this.count++;  
        this.textNPC.text=this.npcname;
        this.cancelButton.touchEnabled=true;       
    }
    public onclose() {
        if(this.count!=0) {
             if(this.buttonShow==1){
              this.removeChild(this.acceptButton);
              this.buttonShow=0;
               this.acceptButton.touchEnabled=false;
          }
           if(this.buttonShow==2){
              this.removeChild(this.finishButton);
              this.buttonShow=0;
              this.finishButton.touchEnabled=false;
          }
          this.parent.removeChild(this);
          this.count=0;
          this.npcname="";
          this.textField.text="";
          this.cancelButton.touchEnabled=false;
         
        }
    }
    public showMyTask(task:Task){
        this.taskid=task.id;
        this.textField.text=task.desc;
      
        if(task.status==1) {
            this.addChild(this.acceptButton);
            this.buttonShow=1;
            this.acceptButton.touchEnabled=true;
      
        }
        if(task.status==3) {
            this.addChild(this.finishButton);
            this.buttonShow=2;
            this.finishButton.touchEnabled=true;
        }
    }
    onButtonClick() {
       
        if(this.buttonShow==1){
            var tas:TaskService=TaskService.getInstance();
            tas.accept(this.taskid);
            if(this.taskid==tasks[1].id){
                tas.reach(this.taskid);
            }
        }
        if(this.buttonShow==2){
            var tas:TaskService=TaskService.getInstance();
            tas.finish(this.taskid);
        }
        this.onclose();

    }
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}



class Task {
 id:string;
 name:string;
 desc:string;
 status:TaskStatus;
 fromNPCid:string;
 toNPCid:string;


constructor(id,name,desc,status,fromNPCid,toNPCid) {
    this.id=id;
    this.desc=desc;
    this.name=name;
    this.desc=desc;
    this.status=status;
    this.fromNPCid=fromNPCid;
    this.toNPCid=toNPCid;
}

}

enum TaskStatus {
    UNACCEPTABLE=0,
    ACCEPTABLE=1,
    DURING=2,
    CAN_SUBMIT=3,
    SUBMITTED=4,
}

class NPC extends egret.DisplayObjectContainer implements Observer {
    id:string;
    myname:string;
    emoji:egret.Bitmap;
    myphoto:egret.Bitmap;
    myword:string;
    myPanel:NPCwrodPanel;
    constructor(i:number,npcwp:NPCwrodPanel) {
        super();
        this.id=NPCs[i].id;
        this.myname=NPCs[i].myname;
        this.myphoto=this.createBitmapByName(NPCs[i].myphoto);
        this.addChild(this.myphoto);
        this.emoji=this.createBitmapByName(emojis[0].name);
        this.addChild(this.emoji);
        this.emoji.x+=this.myphoto.width/5;
        this.emoji.y-=this.myphoto.height/4;
        this.myPanel=npcwp;
        this.myword="快去做任务吧";
    }
    onChange(task:Task) {
      if(task.fromNPCid==this.id) {
          if(task.status==1)
         this.emoji.texture=RES.getRes(emojis[1].name);   
         if(task.status==2)   
          this.emoji.texture=RES.getRes(emojis[0].name);   
       }
       if(task.toNPCid==this.id&&task.status>1) {
           var i;
           for(i=0;true;i++) {
              if(TaskStatus[TaskStatus[i]]==task.status) {
                   this.emoji.texture=RES.getRes(emojis[i].name);
                   break;
               }
           }
          
       }
    }

    onNPCClick() {
        this.myPanel.npcname=this.myname;
        var tas:TaskService=TaskService.getInstance();
        var ta=tas.getTaskBYCustomRule(this.rule1,this);
        if(ta!=null){
   //         console.log(ta.id);
            this.myPanel.showMyTask(ta);
        }
     
    }

    public rule1(tasks:Task[],npc:NPC) {
        var ta:Task;
        for(let i=0;i<tasks.length;i++) {
      //      console.log(tasks[i].id+""+tasks[i].toNPCid);
             if(tasks[i].toNPCid==npc.id) {
                if(tasks[i].status!=0&&tasks[i].status!=4&&tasks[i].status!=1){
                         ta=tasks[i];       
                         return ta;         
            } 
             }
            if(tasks[i].fromNPCid==npc.id) {
                if(tasks[i].status==1){
                         ta=tasks[i];  
                             return ta;                      
                        }
            }
               
        }return null;  
    }
  
    
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

}


class TaskService {

    public observerList:Observer[]=[];
    public taskList:Task[]=[];
    private static instance;
    private static count =0;
    constructor (){
        TaskService.count++;
        if(TaskService.count >1){
            throw 'singleton';
        }
    }
    public static getInstance() {
        if(TaskService.instance ==null) {
            TaskService.instance =new TaskService();
        }
        return TaskService.instance;
    }

    finish (id:String) {
        for(let ta of this.taskList) {
            if(ta.id==id) {
                ta.status=TaskStatus.SUBMITTED;
                this.notify(ta);
                this.notifyall();
            }
        }
    }
    reach (id:String) {
        for(let ta of this.taskList) {
            if(ta.id==id) {
                ta.status=TaskStatus.CAN_SUBMIT;
                this.notify(ta);
            }
        }
    }
     canAccept (id:String) {
        for(let ta of this.taskList) {
            if(ta.id==id) {
                ta.status=TaskStatus.ACCEPTABLE;
                this.notify(ta);
            }
        }
    }
    accept (id:String) {
         for(let ta of this.taskList) {
            if(ta.id==id) {
                ta.status=TaskStatus.DURING;
                this.notify(ta);
            }
        }

    }
    public getTaskBYCustomRule(rule:Function,npc:NPC):Task{
           
            return  rule(this.taskList,npc);
    }
    notify(ta:Task) {
        for(let ob of this.observerList) {
            ob.onChange(ta);
        }
  //      console.log(ta.id,ta.desc,ta.name);
    }
    notifyall(){
      
         for(let ob of this.observerList){
           for(let ta of this.taskList) {
            ob.onChange(ta);
            if(ta.id==tasks[0].id&&ta.status==4){
                for(var ta2 of this.taskList) {
                    if(ta2.id==tasks[1].id&&ta2.status==0){
                        ta2.status=TaskStatus.ACCEPTABLE;
                        //console.log("gai");
                        this.notify(ta2);
                    }
                }
                    
            }
         }}
         
    }
}


let tasks= [
    {id:"task_00",name:"任务一",desc:"请跟右边NPC对话",fromNPCid:"npc_0",toNPCid:"npc_0"},
    {id:"task_01",name:"哦？你来了",desc:"去左边交任务吧",fromNPCid:"npc_1",toNPCid:"npc_0"},
]

let NPCs=[
    {id:"npc_0",myname:"任务一",myphoto:"npc2_png"},
    {id:"npc_1",myname:"(⊙v⊙)嗯",myphoto:"npc_png"},
]

let emojis=[
    {name:""},
    {name:"叹号_png"},
    {name:"问号灰_png"},
    {name:"问号黄_png"},
    {name:""},
]