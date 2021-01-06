package com.example.ecoville_app_S;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;


import androidx.fragment.app.Fragment;

import android.view.MenuItem;

import com.google.android.material.bottomnavigation.BottomNavigationView;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        BottomNavigationView BNV = findViewById(R.id.bottomNavigationView);
        BNV.setOnNavigationItemSelectedListener(bnvListener);
    }

    private BottomNavigationView.OnNavigationItemSelectedListener bnvListener=
            new BottomNavigationView.OnNavigationItemSelectedListener() {
                @Override
                public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                    Fragment selectedFragment = null;

                    switch (item.getItemId()){
                        case R.id.fragment_1:
                            selectedFragment = new fragment_home_missions();
                            break;
                        case R.id.fragment_2:
                            selectedFragment = new fragment_rank();
                            break;
                        case R.id.fragment_3:
                            selectedFragment = new fragment_3();
                            break;
                        case R.id.fragment_4:
                            selectedFragment = new fragment_4();
                            break;
                    }
                    getSupportFragmentManager().beginTransaction().replace(R.id.fragment, selectedFragment).commit();
                    return true;
                }
            };
}