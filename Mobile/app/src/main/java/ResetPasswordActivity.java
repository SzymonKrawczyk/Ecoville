package com.example.bottomnavigationview;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Dialog;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Log;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.example.bottomnavigationview.model.Gadget;
import com.example.bottomnavigationview.model.User;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.storage.StorageReference;

import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ResetPasswordActivity extends AppCompatActivity {

    EditText _Email;

    Button Reset;
    Button GoBack;

    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reset_password);

        _Email = (EditText) findViewById(R.id.ETEmail);

        Reset = (Button) findViewById(R.id.BReset);
        GoBack = (Button) findViewById(R.id.BLogIn);

        GoBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getApplicationContext(), LogIn.class);
                startActivity(intent);
            }
        });

        Reset.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(validation())
                {
                    resetPassword();
                }
            }
        });
    }

    private void resetPassword(){

        FirebaseAuth auth = FirebaseAuth.getInstance();
        String emailAddress = _Email.getText().toString().trim();

        auth.sendPasswordResetEmail(emailAddress)
                .addOnCompleteListener(new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        if (task.isSuccessful()) {
                            showPopUp();
                        }else {
                            Toast.makeText(ResetPasswordActivity.this, "We are currently facing some technical issues,\n please try again later", Toast.LENGTH_LONG).show();
                        }
                    }
                });
    }

    public boolean validation(){

        String Email = _Email.getText().toString().trim();

        if(Email.isEmpty()){
            _Email.setError("Email address is required!");
            _Email.requestFocus();
            return false;
        }

        if(!Patterns.EMAIL_ADDRESS.matcher(Email).matches()){
            _Email.setError("Incorrect email!");
            _Email.requestFocus();
            return false;
        }

        return true;
    }

    public void showPopUp(){

        Dialog dialog = new Dialog(this);

        dialog.setContentView(R.layout.reset_password_popup);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

        Button BTConfirm;

        BTConfirm = (Button) dialog.findViewById(R.id.BTConfirm);

        BTConfirm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getApplicationContext(), LogIn.class);
                startActivity(intent);
                dialog.dismiss();
            }
        });

        dialog.show();
    }
}
