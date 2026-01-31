public final class CustomReceiver extends BroadcastReceiver {
    @Override // android.content.BroadcastReceiver
    public void onReceive(Context context, Intent intent) {
        Bundle extras;
        //The URL injection is on this line.
        String stringExtra = (intent == null || (extras = intent.getExtras()) == null) ? null : extras.getString("web_url");
        String str = stringExtra;
        if (!(str == null || StringsKt.isBlank(str))) {
            Intent intent2 = new Intent(context, (Class<?>) WebView2Activity.class);
            intent2.putExtra("url", stringExtra);
            if (context != null) {
                context.startActivity(intent2);
            }
        }
    }
}