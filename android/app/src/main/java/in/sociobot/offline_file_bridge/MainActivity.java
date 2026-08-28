package in.sociobot.offline_file_bridge;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(OfflineBridgePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
