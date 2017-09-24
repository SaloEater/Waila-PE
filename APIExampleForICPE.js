ModAPI.addAPICallback("WailaCore", function(WailaCore){ 
	//Game.dialogMessage("Adding to Waila");
	WailaCore.blockRegistry.changeBlock(BlockID.storageBatBox, {
		"energy": {
			x: 320,
			y: 120,
			type: "text",
			text: "",
			width: 680,
			height: 70,
			font: {
				size: 50,
				color: android.graphics.Color.WHITE
			}
		}, 
		"source": {
			x: 320,
			y: 190,
			type: "text",
			text: "Industrial Craft",
			width: 680,
			height: 150,
			font: {
				size: 50,
				color: android.graphics.Color.BLUE
			}
		}
	},
	[
		function(){
			//Game.message("Hello from IC");
			var machine = EnergyTileRegistry.accessMachineAtCoords(WailaCore.UI.activePos.x, WailaCore.UI.activePos.y, WailaCore.UI.activePos.z);
			if(machine){
				for(var i in machine.data){
					if(i != "energy_storage"){
						var eT=[];
						for(e in World.getTileEntity(WailaCore.UI.activePos.x, WailaCore.UI.activePos.y, WailaCore.UI.activePos.z).__energyTypes)eT.push(e);
						if(i == "energy"){
							WailaCore.UI.getContainer().setText("energy", eT[0]+": "+machine.data[i] + "/" + machine.getEnergyStorage());
						} else {
							WailaCore.UI.getContainer().setText("energy", eT[0]+": "+machine.data[i]);
						}
					}
				}
			}
		}
	])
});