//This is a public method inside the ScanEngine class

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