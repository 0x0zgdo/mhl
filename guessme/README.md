I crafted a custom deep link (mhl://) to force the target app’s exported WebviewActivity to load an attacker controlled local PoC HTML page via the url parameter.

The malicious HTML executes inside the app’s WebView, gaining access to the exposed AndroidBridge JavaScript interface.

This calls the getTime(“usercontrolledinput”) that gets executed in this unsanitized code Runtime.getRuntime().exec(). This enables arbitrary OS command injection from JavaScript (RCE).