Java.perform(function() {

    let hooking = Java.use("com.maliciouserection.axolotl.MainActivity");
    
    hooking.showFlag1.implementation = function () {
        
        console.log(`showFlag1 is called`);
        console.log(this.getIntent().toString());

        //Use this if you want to get only String extra
        console.log(this.getIntent().getStringExtra("Y3aZ0Ix8BSic"));

        //Use this if you want to get only Boolean extra
        console.log(this.getIntent().getBooleanExtra("1MLO3ay089bG",false))

        //Use this if you want to get only Integer extra
        console.log(this.getIntent().getIntExtra("gz2HlP387CGb", 0));
       
        let result = this.showFlag1();
        return result;
    }

});