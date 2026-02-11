Java.perform(function() {

    let hooking = Java.use("com.maliciouserection.axolotl.example.activity.intents.getIntent");
    
    hooking.theMainMethod.implementation = function () {
        
        console.log(`theMainMethod is called`);
        console.log(this.getIntent().toString());

        //Use this if you want to get only String extra
        console.log(this.getIntent().getStringExtra("yay"));

        //Use this if you want to get only Integer extra
        console.log(this.getIntent().getIntExtra("yay", 0));
       
        let result = this.theMainMethod();
        return result;
    }

});


// am start -n com.maliciouserection.axolotl/.example.activity.intents.getIntent --es "yay" "yayflagyay" / --ei "yay" 1