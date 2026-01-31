public final class AboutUsActivity extends AppCompatActivity { 

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about_us);
        CustomReceiver customReceiver = new CustomReceiver();
        this.receiver = customReceiver;
        if (customReceiver == null) {
            Intrinsics.throwUninitializedPropertyAccessException("receiver");
        }

        //Registration of a broadcast enabling URL injection.
        registerReceiver(customReceiver, new IntentFilter("com.insecureshop.CUSTOM_INTENT"));
    }

}