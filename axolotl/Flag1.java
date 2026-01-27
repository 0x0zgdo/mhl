
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        Intent intent = new Intent();
        intent.setComponent(new ComponentName(
                "com.maliciouserection.axolotl",
                "com.maliciouserection.axolotl.MainActivity"
        ));

        intent.putExtra(Intent.EXTRA_REFERRER, Uri.parse("com.maliciouserection.axolotl"));
        intent.putExtra("Y3aZ0Ix8BSic", "3C92TcdomGi8");
        intent.putExtra("1MLO3ay089bG", true);
        intent.putExtra("gz2HlP387CGb", 44218);


        Log.d("ReferrerCheck", "Referrer: " + getReferrer());
        Log.d("ReferrerCheck", "Package Name: " + getPackageName());

        startActivity(intent);

    }
}