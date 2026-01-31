//This is a public method that evalautes if a all files under external storage is infected or not by calling the ScanEngine.INSTANCE.scanFile(file); method.
  
  public void handleMessage(Message msg) {
            Intrinsics.checkNotNullParameter(msg, "msg");
            try {
                System.out.println((Object) "starting file scan...");
                File externalStorageDirectory = Environment.getExternalStorageDirectory();
                Intrinsics.checkNotNullExpressionValue(externalStorageDirectory, "getExternalStorageDirectory(...)");
                Sequence $this$forEach$iv = FilesKt.walk$default(externalStorageDirectory, null, 1, null);
                for (Object element$iv : $this$forEach$iv) {
                    File file = (File) element$iv;
                    if (file.canRead() && file.isFile()) {
                        System.out.print((Object) (file.getAbsolutePath() + "..."));
                        boolean safe = ScanEngine.INSTANCE.scanFile(file);
                        System.out.println((Object) (safe ? "SAFE" : "INFECTED"));
                    }
                }
                System.out.println((Object) "finished file scan!");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            Message $this$handleMessage_u24lambda_u241 = obtainMessage();
            $this$handleMessage_u24lambda_u241.arg1 = msg.arg1;
            sendMessageDelayed($this$handleMessage_u24lambda_u241, ScanService.SCAN_INTERVAL);
}
    
