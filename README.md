## Classes Enumeration & Method Listing Using Frida

```javascript
Java.perform(function () {
    var targetPackageName = 'com.packagename.myapp';

    Java.enumerateLoadedClasses({
        onMatch: function(className) {
            if (className.startsWith(targetPackageName)) {
                try {
                    var clazz = Java.use(className);
                    console.log('\n[*] Enumerating methods of class: ' + className);

                    var methods = clazz.class.getDeclaredMethods();
                    methods.forEach(function(method) {
                        console.log(method.toString());
                    });

                    clazz.$dispose();
                } catch (err) {
                    console.error('Error enumerating methods of ' + className + ': ' + err.message);
                }
            }
        },
        onComplete: function() {
            console.log('[*] Class enumeration complete');
        }
    });
});
```

## Native Hooking with Frida (Updated JavaScript API)

```javascript
function hexToASCII(hex) {
    if (!hex) return hex;
    var result = '';
    for (var i = 0; i < hex.length; i += 2) {
        result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return result;
}

setTimeout(function() {

     // Dynamically find module base address and calculate the address of the strcmp call
    let libSo = Process.getModuleByName('fileso.so');
    if (!libSo) {
        console.log('fileso.so not found!');
        return;
    }

    // Assuming the offset for the strcmp call is 0x44ab0 from the base of libSo.so
    var strcmpCallAddress = libSo.base.add(ptr('0x44ab0'));

    // Attach an interceptor to the strcmp call
    Interceptor.attach(strcmpCallAddress, {
        onEnter: function(args) {
            // Read the parameters passed to strcmp (assuming they are C strings)
            var param1 = args[0].readCString();
            var param2 = args[1].readCString();

            // Log the parameters to the console
            console.log('Parameter 1:', param1);
            console.log('Parameter 2:', hexToASCII(param2));
        },
        onLeave: function(retval) {
            // Log the return value of strcmp
            console.log('returned:', retval.toInt32());
        }
    });
}, 1000);
```
