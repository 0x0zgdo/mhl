Java.perform(function () {    
    
    var MainActivity = Java.use("com.maliciouserection.axolotl.MainActivity");

    MainActivity.adjustSharedPreferences.implementation = function() {
        
        var context = this.getApplicationContext();
        var prefs = context.getSharedPreferences(context.getPackageName(), 0);
        var editor = prefs.edit();

        editor.putBoolean("show_flag_2", true);    
        editor.apply();
        
        console.log("show_flag_2 set to true!");
    }

});