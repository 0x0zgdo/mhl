//This is a public method inside the ScanEngine class. It takes the absolute path of the file and calculate its SHA-1 checksum.
//Once the hash is generated it compares it to the known malware samples that is also hashed.


private static final HashMap<String, String> KNOWN_MALWARE_SAMPLES = MapsKt.hashMapOf(TuplesKt.to("eicar.com", "3395856ce81f2b7382dee72602f798b642f14140"), TuplesKt.to("eicar.com.txt", "3395856ce81f2b7382dee72602f798b642f14140"), TuplesKt.to("eicar_com.zip", "d27265074c9eac2e2122ed69294dbc4d7cce9141"), TuplesKt.to("eicarcom2.zip", "bec1b52d350d721c7e22a6d4bb0a92909893a3ae"));
public final boolean scanFile(File file) {
            Intrinsics.checkNotNullParameter(file, "file");
            try {
                //this first line of code is vulnerable to command injection
                String command = "toybox sha1sum " + file.getAbsolutePath(); 
                Process process = new ProcessBuilder(new String[0]).command("sh", "-c", command).directory(Environment.getExternalStorageDirectory()).redirectErrorStream(true).start();
                InputStream inputStream = process.getInputStream();
                Intrinsics.checkNotNullExpressionValue(inputStream, "getInputStream(...)");
                Reader inputStreamReader = new InputStreamReader(inputStream, Charsets.UTF_8);
                BufferedReader bufferedReader = inputStreamReader instanceof BufferedReader ? (BufferedReader) inputStreamReader : new BufferedReader(inputStreamReader, 8192);
                try {
                    BufferedReader reader = bufferedReader;
                    String output = reader.readLine();
                    Intrinsics.checkNotNull(output);
                    Object fileHash = StringsKt.substringBefore$default(output, "  ", (String) null, 2, (Object) null);
                    Unit unit = Unit.INSTANCE;
                    CloseableKt.closeFinally(bufferedReader, null);
                    return !ScanEngine.KNOWN_MALWARE_SAMPLES.containsValue(fileHash);
                } finally {
                }
            } catch (Exception e) {
                e.printStackTrace();
                return false;
    }
}