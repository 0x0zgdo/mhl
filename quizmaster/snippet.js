// Use Frida's Java.perform method to safely interact with Java classes
Java.perform(function () {
  // Obtain a reference to the 'ScoreManager' class from the target app
  var ScoreManager = Java.use('com.hackthebox.myapp.ScoreManager');
  
  // Override the implementation of the 'getScore' method in the ScoreManager class
  ScoreManager.getScore.implementation = function () {
    return 12; // Always return 12, effectively forcing the score to always be greater than 10
  };
});