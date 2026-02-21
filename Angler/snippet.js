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
    let libAngler = Process.getModuleByName('libangler.so');
    if (!libAngler) {
        console.log('libangler.so not found!');
        return;
    }

    // Assuming the offset for the strcmp call is 0x44ab0 from the base of libangler.so
    var strcmpCallAddress = libAngler.base.add(ptr('0x44ab0'));

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