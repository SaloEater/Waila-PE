var LOGGER_TAG = "Waila PE";
var windowX=750, windowY=0;
var settingsGUI;
var allowedShow = false;
var screensize, localContainer;
var activeType="";
var WailaCore=null

importLib("energylib", "*");
Callback.addCallback("LevelLoaded", function() {
    screensize = ModAPI.requireGlobal("GuiUtils.GetDisplaySize()");
});

var settingsUI = {
	showMoverButton: function(){
		var ctx = UI.getMcContext();
        //Game.message(screensize[0] + ":" + screensize[1]);
        UI.run(function() {
            var layout = new android.widget.LinearLayout(ctx);
            layout.setOrientation(1);
            var directory = new android.graphics.Bitmap.createScaledBitmap(new android.graphics.BitmapFactory.decodeFile("/sdcard/"+FileTools.moddir+"Waila/gui/buttonShowMover.png"), screensize[0] / 18, screensize[0] / 18, true);
            var img = new android.graphics.drawable.BitmapDrawable(directory);
            var image = new android.widget.ImageView(ctx);
            image.setImageBitmap(directory);
            image.setOnClickListener(new android.view.View.OnClickListener({
                onClick: function(viewarg) {
					var moverWindow = new UI.StandartWindow({
						standart: {
						},
						drawing: [
							{type: "background", color: android.graphics.Color.WHITE}
						],
						elements: {
							"bg": {type: "image", x: windowX, y: windowY, bitmap: "bg", scale: 10},
							"up": {
								type: "button", 
								x: 200, 
								y: 350, 
								bitmap: "buttonUp", 
								bitmap2: "buttonUpOff", 
								scale: 2, 
								clicker: {
									onClick: function(container, tileEntity, position,  window, canvas, scale){
										if(windowY-5>=0){
											windowY-=-5;
											container.getGuiContent().elements["bg"]=null;
											container.getGuiContent().elements["bg"]={type: "image", x: windowX, y: windowY, bitmap: "bg", scale: 10}
										}
									}
								}
							},
							"left": {
								type: "button", 
								x: 150, 
								y: 400, 
								bitmap: "buttonLeft", 
								bitmap2: "buttonLeftOff", 
								scale: 2, 
								clicker: {
									onClick: function(container, tileEntity, position,  window, canvas, scale){
										if(windowX-5>=0){
											windowX-=5;
											container.getGuiContent().elements["bg"]=null;
											container.getGuiContent().elements["bg"]={type: "image", x: windowX, y: windowY, bitmap: "bg", scale: 10}
										}
									}
								}
							},
							"down": {
								type: "button", 
								x: 200, 
								y: 450, 
								bitmap: "buttonDown", 
								bitmap2: "buttonDownOff", 
								scale: 2, 
								clicker: {
									onClick: function(container, tileEntity, position,  window, canvas, scale){
										if(windowY+5<=400){
											windowY+=5;
											container.getGuiContent().elements["bg"]=null;
											container.getGuiContent().elements["bg"]={type: "image", x: windowX, y: windowY, bitmap: "bg", scale: 10}
										}
									}
								}
							},
							"right": {
								type: "button", 
								x: 250, 
								y: 400, 
								bitmap: "buttonRight", 
								bitmap2: "buttonRightOff", 
								scale: 2, 
								clicker: {
									onClick: function(container, tileEntity, position,  window, canvas, scale){
										if(windowX+5<=1000){
											windowX+=5;
											container.getGuiContent().elements["bg"]=null;
											container.getGuiContent().elements["bg"]={type: "image", x: windowX, y: windowY, bitmap: "bg", scale: 10}
										}
									}
								}
							},
							"confirm": {
								type: "button", 
								x: 350, 
								y: 450, 
								bitmap: "buttonOK", 
								bitmap2: "buttonOKOff", 
								scale: 2, 
								clicker: {
									onClick: function(container, tileEntity, position,  window, canvas, scale){
										wailaUI.Window = null;
										wailaUI.Window = new UI.StandartWindow({
											location: {
												x: windowX,
												y: windowY,
												width: 250,
												height: 80
											},
											drawing: [{
													type: "background",
													color: android.graphics.Color.BLACK
												},
												{
													type: "frame",
													x: 0,
													y: 0,
													width: 1000,
													height: 600,
													bitmap: "_default_slot_dark",
													scale: 1,
													bg: android.graphics.Color.rgb(47, 43, 43)
												},
											],
											elements: {}
										});
										localContainer.close();
										localContainer=null;
									}
								}
							},
							"default": {
								type: "button", 
								x: 450, 
								y: 450, 
								bitmap: "buttonDef", 
								bitmap2: "buttonDefOff", 
								scale: 2, 
								clicker: {
									onClick: function(container, tileEntity, position,  window, canvas, scale){
										windowX=750;
										windowY=0;
										container.getGuiContent().elements["bg"]=null;
										container.getGuiContent().elements["bg"]={type: "image", x: windowX, y: windowY, bitmap: "bg", scale: 10}
									}
								}
							}
						}
					});
					localContainer=new UI.Container();
					localContainer.openAs(moverWindow);
                }
            }));
            layout.addView(image);
            settingsGUI = new android.widget.PopupWindow(layout, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
            settingsGUI.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.RED));
            settingsGUI.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.LEFT | android.view.Gravity.TOP, 0, 0);

        });
	},
	closeAll: function(){
		if(settingsGUI){
			UI.run(function() {
				settingsGUI.dismiss();
				settingsGUI=null;
			});
		}
	}
};

Callback.addCallback("NativeGuiChanged", function(screenName){
	if(screenName=="pause_screen"){
		settingsUI.showMoverButton();
	} else {
		settingsUI.closeAll();
	}
	if (screenName == "hud_screen" || screenName == "in_game_play_screen") {
		allowedShow=true;
    } else {
		allowedShow=false;
		if (wailaUI.getContainer()) {
			//Game.message("Remove GUI")
			wailaUI.getContainer().close();
			wailaUI.setContainer(null);
			for(e in wailaUI.Window.content.elements)wailaUI.Window.content.elements[e] = null;
		}
	}
});

var wailaUI = {
    container: null,
    activeID: -1,
    activeData: -1,
	activePos: {},
    Window: new UI.StandartWindow({
        location: {
            x: windowX,
            y: windowY,
            width: 250,
            height: 80
        },
        drawing: [{
                type: "background",
                color: android.graphics.Color.BLACK
            },
            {
                type: "frame",
                x: 0,
                y: 0,
                width: 1000,
                height: 600,
                bitmap: "_default_slot_dark",
                scale: 1,
                bg: android.graphics.Color.rgb(47, 43, 43)
            },
        ],
        elements: {}
    }),
	getContainer: function(){
		return this.container;
	},
	setContainer: function(c){
		this.container=c;
	}
}

Callback.addCallback("tick", function() {
    if (World.getThreadTime() % 20 == 0 && allowedShow) {
        //Game.message(Player.getPointed().block.id);
        if (Player.getPointed().block.id != 0) {
			if (Player.getPointed().block.id != wailaUI.activeID || Player.getPointed().block.data != wailaUI.activeData) {
				//Game.message("Show new block");
				wailaUI.activeID = Player.getPointed().block.id;
				wailaUI.activeData = Player.getPointed().block.data;
				wailaUI.activePos = {
				"x": Player.getPointed().pos.x,
				"y": Player.getPointed().pos.y,
				"z": Player.getPointed().pos.z
				};
				fillWailaWindow();
			}
			//Game.message("Length - "+blockInformation.getUpdatables(wailaUI.activeID).length);
			blockInformation.getUpdatables(wailaUI.activeID).forEach(function(entry){
				//Game.message("Make update");
				entry();
			});
        } else {
            if (wailaUI.getContainer()) {
                //Game.message("Remove GUI")
                wailaUI.getContainer().close();
                wailaUI.setContainer(null);
				for(e in wailaUI.Window.content.elements)wailaUI.Window.content.elements[e] = null;
            }
        }
    }
});

function fillWailaWindow(){
	if(!wailaUI.getContainer()){
		wailaUI.setContainer(new UI.Container());
		wailaUI.getContainer().openAs(wailaUI.Window);
	}
	var elements = wailaUI.getContainer().getGuiContent().elements;
	var newEls=null;
	for(e in elements){
		elements[e]=null;
	}
	if(newEls=blockInformation.getChangedBlocks()[wailaUI.activeID]){
		for(e in newEls.elements){
			Game.message("Add "+e);
			
			elements[e]=blockInformation.getElementChanges(wailaUI.activeID, e);
		}
	}
	if(!elements["slot"]){
		Game.message("Add slot");
		elements["slot"]= {
			type: "slot",
			x: 15,
			y: 15,
			size: 285,
			visual: true
		}
	}
	if(!elements["name"]){
		Game.message("Add "+Item.getName(wailaUI.activeID, wailaUI.activeData));
		elements["name"]= {
			x: 320,
			y: 25,
			type: "text",
			text: Item.getName(wailaUI.activeID, wailaUI.activeData),
			width: 680,
			height: 70,
			font: {
				size: 50,
				color: android.graphics.Color.WHITE
			}
		}
	}
	if(!elements["source"]){
		Game.message("Add source");
		elements["source"]= {
			x: 320,
			y: 190,
			type: "text",
			text: "Minecraft",
			width: 680,
			height: 150,
			font: {
				size: 50,
				color: android.graphics.Color.BLUE
			}
		}
	}
	
	wailaUI.getContainer().setSlot("slot", wailaUI.activeID, wailaUI.activeData, 0);
	//wailaUI.getContainer().setText("name", Item.getName(wailaUI.activeID, wailaUI.activeData));
}


var blockInformation = {
	changedBlocks: {},
	changeBlock: function(id, elements, updatables){
		//Game.dialogMessage("Add for "+Item.getName(id, 0));
		this.getChangedBlocks()[id]={};
		this.getChangedBlocks()[id].elements={};
		this.getChangedBlocks()[id].updatables=[];
		for(e in elements){
			//Game.dialogMessage("Copy "+e);
			this.getChangedBlocks()[id].elements[e]=elements[e];
			//Game.dialogMessage(JSON.stringify(this.getChangedBlocks()[id].elements[e]), e);
		}
		for(var i=0; i<updatables.length; i++){
			this.getChangedBlocks()[id].updatables.push(updatables[i]);
		}
	},
	getElementChanges: function(id, element){
		return this.getChangedBlocks()[id].elements[element];
	},
	getUpdatables: function(id){
		return this.getChangedBlocks()[id]?this.changedBlocks[id].updatables:[];
	},
	getChangedBlocks: function(){
		return this.changedBlocks;
	}
};

ModAPI.registerAPI("WailaCore", {
    blockRegistry: blockInformation,
	UI: wailaUI,
	
	requireGlobal: function(command){
		return eval(command);
	}
});

ModAPI.addAPICallback("WailaCore", function(WailaCore) {
	WailaCore = this.WailaCore;
    Logger.Log("Waila API is registred and can be accessed by ModAPI.requireAPI(\"WailaCore\")", LOGGER_TAG);
});