package com.example.bottomnavigationview;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;


import androidx.fragment.app.Fragment;

import android.view.MenuItem;

import com.google.android.material.bottomnavigation.BottomNavigationView;

import com.example.bottomnavigationview.model.User;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.Date;

public class MainActivity extends AppCompatActivity {

    public static User appUser;
    public static DocumentReference userDocRef;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if(appUser._isUserBanned()) {
            Intent intent = new Intent(getApplicationContext(), UserBannedErrorActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
        }else{
            setContentView(R.layout.activity_main);
            BottomNavigationView BNV = findViewById(R.id.BottomNavigationView);
            BNV.setOnNavigationItemSelectedListener(bnvListener);
        }
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
                            selectedFragment = new fragment_shop();
                            break;
                        case R.id.fragment_4:
                            selectedFragment = new fragment_profile();
                            break;
                    }
                    getSupportFragmentManager().beginTransaction().replace(R.id.fragment, selectedFragment).commit();
                    return true;
                }
    };

    public static void logout(){
        appUser = null;
        userDocRef = null;
        FirebaseAuth mAuth;
        FirebaseAuth.getInstance().signOut();
    }


    public void setUser() {

        FirebaseAuth mAuth;
        FirebaseFirestore FStore;
        String UserId;

        FStore = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();

        UserId = mAuth.getCurrentUser().getUid();
        userDocRef = FStore.collection("user").document(UserId);
        userDocRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                appUser = documentSnapshot.toObject(User.class);
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
            }
        });
    }

    public static Date getDateFromServer()
    {
        //for testing purpose, use local date
        return new Date();

//        try {
//            tcpClient mTcpClient = new tcpClient();
//            Thread thread = new Thread(mTcpClient);
//            thread.start();
//            thread.join();
//            System.out.println("Login date: " + mTcpClient.serverTime);
//            return mTcpClient.serverTime;
//        } catch (InterruptedException e) {
//            System.err.println("Tcp interrupted!!");
//            return null;
//        }
    }
}