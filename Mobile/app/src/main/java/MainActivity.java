package com.example.ecoville_app_S;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Switch;
import android.widget.Toast;

import com.example.ecoville_app_S.model.User;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

public class MainActivity extends AppCompatActivity {

    EditText firstName;
    EditText lastName;
    EditText email;
    EditText dob;
    EditText ETdocID;
    Switch gender;
    Button bSave;
    Button bEdit;
    Button bGoToRecycler;

    FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        db = FirebaseFirestore.getInstance();

        firstName     = (EditText)findViewById(R.id.firstName);
        lastName      = (EditText)findViewById(R.id.lastName);
        email         = (EditText)findViewById(R.id.email);
        dob           = (EditText)findViewById(R.id.dob);
        ETdocID       = (EditText)findViewById(R.id.docID);
        gender        = (Switch)  findViewById(R.id.gender);
        bSave         = (Button)  findViewById(R.id.bSave);
        bEdit         = (Button)  findViewById(R.id.bEdit);
        bGoToRecycler = (Button)  findViewById(R.id.bGoToRecycler);

        bGoToRecycler.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Intent intent = new Intent(getApplicationContext(), Home_missions_activity.class);
                //Intent intent = new Intent(getApplicationContext(), Home_talk_activity.class);
                Intent intent = new Intent(getApplicationContext(), Home_tips_activity.class);
                startActivity(intent);
            }
        });/*
        bGoToRecycler.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getApplicationContext(), RecycleActivity.class);
                startActivity(intent);
            }
        });*/

        bSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String TfirstName = firstName.getText().toString().trim();
                String TlastName = lastName.getText().toString().trim();
                String Temail = email.getText().toString().trim();
                int Tdob = Integer.parseInt(dob.getText().toString().trim());
                boolean Tgender = gender.isChecked();

                User user = new User(TfirstName, TlastName, Temail, Tdob, Tgender);
                String docId = ETdocID.getText().toString().trim();

                db.collection("users").document(docId).set(user);
            }
        });

        bEdit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String docID = ETdocID.getText().toString().trim();
                User temp = returnUserById("users", docID);
            }
        });
    }

    public User returnUserById(String collectionID, String docID) {
        DocumentReference docRef = db.collection(collectionID).document(docID);
        docRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                User user = documentSnapshot.toObject(User.class);
                if (user != null){
                    firstName.setText(user.getFirstName());
                    lastName.setText(user.getLastName());
                    email.setText(user.getEmail());
                    dob.setText(String.valueOf(user.getDob()));
                    gender.setChecked(user.isGender());
                } else {
                    showToast("No data");
                }
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                showToast("Failed to fetch data");
            }
        });
        return null;
    }

    public void showToast(String msg) {
        Toast toast = Toast.makeText(getApplicationContext(), msg, Toast.LENGTH_LONG);
        toast.show();
    }
}