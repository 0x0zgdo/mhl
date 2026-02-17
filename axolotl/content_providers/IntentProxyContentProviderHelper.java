package com.example.evilapp2;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.MimeTypeMap;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

public class IntentProxyContentProviderHelper extends Activity {

    String filename = "yayoutputyay.txt";
    Uri uri;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.layout_intentproxycontentproviderhelper);

        if(getIntent() != null){
            getTheFile(getIntent());
        }
    }

    private void getTheFile(Intent intent) {
        uri = Uri.parse(intent.getDataString());
        if(intent.getStringExtra("filename") != null){
            filename = intent.getStringExtra("filename");
        }

        try{
            InputStream input = getContentResolver().openInputStream(uri);
            File file = new File(getFilesDir(), filename);
            FileOutputStream output = new FileOutputStream(file);

            try{

                byte[] buffer = new byte[1024];
                int len;

                while (true) {
                    assert input != null;
                    if(!((len = input.read(buffer)) > 0)) break;
                    output.write(buffer, 0, len);
                }
            }catch (Exception e){
                e.printStackTrace();
            }

        }catch (Exception e) {
            e.printStackTrace();
        }
        showTheFile();
    }

private void showTheFile() {
    String filePath = getFilesDir().getAbsolutePath() + "/" + filename;
    String mimeType = getFileMimeType(filePath);
    WebView theWebView = findViewById(R.id.theWebView);
    WebSettings webViewSettings = theWebView.getSettings();
    webViewSettings.setAllowFileAccess(true);
    theWebView.setWebViewClient(new WebViewClient());
    if ((mimeType.equals("text/plain")) || (mimeType.equals("image/jpeg"))) {
        theWebView.loadUrl("file://" + filePath);
    }
}
private String getFileMimeType(String filePath) {
            String type = null;
            String extension = MimeTypeMap.getFileExtensionFromUrl(filePath);
            if(extension != null){
                type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
            }
            return type;
    }
}


