// Initiates a Frida script to interact with Java classes and methods.
Java.perform(function () {
    // Accesses the Cipher class from the Java Cryptography API.
    var Cipher = Java.use('javax.crypto.Cipher');

    // Hooks into the doFinal method of the Cipher class that processes a byte array.
    Cipher.doFinal.overload('[B').implementation = function (input) {
        // Executes the original doFinal method with the given input and stores the result.
        var result = this.doFinal(input);

        // Creates a new String object from the result byte array assuming it's UTF-8 encoded.
        var decryptedString = Java.use("java.lang.String").$new(result, "UTF-8");
        
        // Logs the decrypted string to the console.
        console.log("Decrypted string: " + decryptedString);

        // Returns the decryption result to ensure the app's functionality remains unaffected.
        return result;
    };
});