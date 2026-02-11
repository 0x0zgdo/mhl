Java.perform(function() {

     let hooking_check = Java.use("com.maliciouserection.axolotl.activity.hooking_check");

     let newArg1 = true;
     let newArg2 = 95379;
     let newArg3 = "TheBestHookCheckEver";
     let newArg4 = "TestingModifyReturns";


	hooking_check.hookingCheckBoolean.implementation = function (args) {
          console.log(`hooking_check.hookingCheckBoolean old value ( is called: i=${args}`);
          console.log(`hooking_check.hookingCheckBoolean new value ( is called: ${newArg1}`);
          return this.hookingCheckBoolean(newArg1);
          
     };

     
     hooking_check.hookingCheckInt.implementation = function (args) {
          return this.hookingCheckInt(newArg2);
     }

     
     hooking_check.hookingCheckString.implementation = function (args) {
          return this.hookingCheckString(newArg3);
     }

     
     hooking_check.hookingCheckReturn.implementation = function (arg) {
          return newArg4;
     }

     hooking_check.hookingCheckRead.implementation = function (str) {
         console.log(`hooking_check.hookingCheckRead is called: str=${str}`);
     }
})
