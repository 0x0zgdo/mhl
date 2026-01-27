Java.perform(function () {

var System = Java.use("java.lang.System");

        console.log("[*] Passive heap scan for MainActivity instances");
        Java.choose("com.mobilehackinglab.challenge.MainActivity", {
        onMatch: function (instance) {

            console.log("[+] Existing heap instance id:", System.identityHashCode(instance));

            if (System.identityHashCode(instance) === 252388289) {
                instance.KLOW();
            }

        },
        onComplete: function () {
            console.log("[*] Passive heap scan complete");
        }
    });

});