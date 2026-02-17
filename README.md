## Classes Enumeration & Listings Methods

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

