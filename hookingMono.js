const monoLib = Process.getModuleByName('libmonosgen-2.0.so');

// Get all the Mono API functions
const mono_get_root_domain = new NativeFunction(
    monoLib.getExportByName('mono_get_root_domain'), 'pointer', []
);
const mono_thread_attach = new NativeFunction(
    monoLib.getExportByName('mono_thread_attach'), 'pointer', ['pointer']
);
const mono_assembly_foreach = new NativeFunction(
    monoLib.getExportByName('mono_assembly_foreach'), 'void', ['pointer', 'pointer']
);
const mono_assembly_get_image = new NativeFunction(
    monoLib.getExportByName('mono_assembly_get_image'), 'pointer', ['pointer']
);
const mono_image_get_name = new NativeFunction(
    monoLib.getExportByName('mono_image_get_name'), 'pointer', ['pointer']
);
const mono_class_from_name = new NativeFunction(
    monoLib.getExportByName('mono_class_from_name'), 'pointer', ['pointer', 'pointer', 'pointer']
);
const mono_class_get_method_from_name = new NativeFunction(
    monoLib.getExportByName('mono_class_get_method_from_name'), 'pointer', ['pointer', 'pointer', 'int']
);
const mono_compile_method = new NativeFunction(
    monoLib.getExportByName('mono_compile_method'), 'pointer', ['pointer']
);

// Attach to Mono runtime
const domain = mono_get_root_domain();
mono_thread_attach(domain);
console.log('[+] Attached to domain:', domain);

// Enumerate assemblies and find Assembly-CSharp
const assemblies = [];
const cb = new NativeCallback((assembly, user_data) => {
    assemblies.push(assembly);
}, 'void', ['pointer', 'pointer']);

mono_assembly_foreach(cb, ptr(0));

let targetImage = null;
assemblies.forEach(asm => {
    const image = mono_assembly_get_image(asm);
    const name = mono_image_get_name(image).readUtf8String();
    console.log('[Assembly]', name);

    if (name === 'Assembly-CSharp') {
        targetImage = image;
    }
});

if (!targetImage) {
    console.log('[-] Assembly-CSharp not found!');
} else {
    console.log('[+] Found Assembly-CSharp image:', targetImage);

    // Find the concrete class that implements the interface
    const klass = mono_class_from_name(
        targetImage,
        Memory.allocUtf8String('MyApp.Auth'),   // replace with your namespace
        Memory.allocUtf8String('AuthService')    // replace with your concrete class
    );

    if (klass.isNull()) {
        console.log('[-] Class not found!');
    } else {
        console.log('[+] Found class:', klass);

        // Find CheckPin method
        const method = mono_class_get_method_from_name(
            klass,
            Memory.allocUtf8String('CheckPin'),
            -1
        );

        if (method.isNull()) {
            console.log('[-] Method not found!');
        } else {
            console.log('[+] Found method:', method);

            // Compile to native and hook
            const nativePtr = mono_compile_method(method);
            console.log('[+] Native pointer:', nativePtr);

            Interceptor.attach(nativePtr, {
                onEnter(args) {
                    // args[0] = this
                    // args[1] = username
                    // args[2] = pin
                    const username = args[1].readUtf16String();
                    const pin = args[2].readUtf16String();
                    console.log('[+] CheckPin called');
                    console.log('    Username:', username);
                    console.log('    Pin:', pin);
                },
                onLeave(retval) {
                    console.log('    Result:', retval.toInt32());
                    // uncomment to force return true
                    // retval.replace(ptr(1));
                }
            });

            console.log('[+] CheckPin hooked successfully!');
        }
    }
