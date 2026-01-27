// Convert string to hex pattern
function stringToHex(str) {
    var hexPattern = str.split('').map(function(c) {
        return ('0' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(' ');
    return hexPattern;
}

// Search using hex pattern (like objection)
function hexSearch(hexPattern) {
    console.log("[*] Searching for hex pattern: " + hexPattern);
    
    var ranges = Process.enumerateRanges('r--');
    var matches = [];
    
    ranges.forEach(function(range) {
        try {
            Memory.scan(range.base, range.size, hexPattern, {
                onMatch: function(address, size) {
                    matches.push(address);
                    console.log("[+] " + address + " - " + hexdump(address, {
                        offset: 0,
                        length: 32,
                        header: false,
                        ansi: false
                    }));
                },
                onComplete: function() {}
            });
        } catch(e) {}
    });
    
    console.log("[*] Found " + matches.length + " matches");
    return matches;
}

// Search using string input (auto-converts to hex)
function stringSearch(searchString) {
    var hexPattern = stringToHex(searchString);
    console.log("[*] Converting '" + searchString + "' to hex: " + hexPattern);
    return hexSearch(hexPattern);
}


// Search using hex directly:
// hexSearch("4d 48 4c 7b");
// Or search using string (auto-converts):
stringSearch("MHL{");