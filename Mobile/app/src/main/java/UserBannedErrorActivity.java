package com.example.bottomnavigationview;

import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;


public class UserBannedErrorActivity extends AppCompatActivity {

    TextView TVEndOfTheBan;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_was_banned);

        TVEndOfTheBan = (TextView) findViewById(R.id.TVEndOfTheBan);
        TVEndOfTheBan.setText(MainActivity.appUser._getEndOfBanDate());
        MainActivity.logout();
    }
}
