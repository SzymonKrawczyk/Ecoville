package com.example.ecoville_app_S;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.ecoville_app_S.model.User;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;

public class SingUpActivity extends AppCompatActivity {

    private FirebaseAuth mAuth;
    private FirebaseFirestore FStore;
    String userId;

    EditText _FirstName;
    EditText _LastName;
    EditText _Email;
    EditText _Password;
    EditText _ConfirmPassword;

    Button SingUp;
    Button LogIn;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sing_up);

        FStore = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();

        _FirstName = (EditText) findViewById(R.id.ETFirstName);
        _LastName = (EditText) findViewById(R.id.ETLastName);
        _Email = (EditText) findViewById(R.id.ETEmail);
        _Password = (EditText) findViewById(R.id.ETPassword);
        _ConfirmPassword = (EditText) findViewById(R.id.ETConfirmPassword);


        SingUp = (Button) findViewById(R.id.BSingUp);
        LogIn = (Button) findViewById(R.id.BTLogIn);

        LogIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getApplicationContext(), LogIn.class);
                startActivity(intent);
            }
        });

        SingUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(validation())
                {
                    createUser();
                }
            }
        });
    }

    public void createUser()
    {
        String FName = _FirstName.getText().toString().trim();
        String LName = _LastName.getText().toString().trim();
        String Email = _Email.getText().toString().trim();
        String Password = _Password.getText().toString().trim();

        if(validation()) {
            mAuth.createUserWithEmailAndPassword(Email, Password).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                @Override
                public void onComplete(@NonNull Task<AuthResult> task) {
                    if (task.isSuccessful()) {
                        Toast.makeText(SingUpActivity.this, "User created", Toast.LENGTH_SHORT).show();

                        userId = mAuth.getCurrentUser().getUid();
                        DocumentReference docRef = FStore.collection("user").document(userId);

                        User user = new User( Email, FName, LName);
                    /*
                    Map<String, Object>user = new HashMap<>();
                    user.put("firstName", FName);
                    user.put("lastName", LName);
                    user.put("email", Email);
                    user.put("password", Password);
                    */


                        docRef.set(user).addOnFailureListener(new OnFailureListener() {
                            @Override
                            public void onFailure(@NonNull Exception e) {
                                Toast.makeText(SingUpActivity.this, "Something went wrong :c \n " + e.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        });
                        startActivity(new Intent(getApplicationContext(), LogIn.class));
                    } else {
                        Toast.makeText(SingUpActivity.this, "Something went wrong :c \n " + task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                    }
                }
            });
        }
    }

    public boolean validation(){

        String FName = _FirstName.getText().toString().trim();
        String LName = _LastName.getText().toString().trim();
        String Email = _Email.getText().toString().trim();
        String Password = _Password.getText().toString().trim();
        String CPassword = _ConfirmPassword.getText().toString().trim();

        if(FName.isEmpty()){
            _FirstName.setError("Name is required!");
            _FirstName.requestFocus();
            return false;
        }

        if(LName.isEmpty()){
            _LastName.setError("Last name is required!");
            _LastName.requestFocus();
            return false;

        }

        if(Email.isEmpty()){
            _Email.setError("Email adress is required!");
            _Email.requestFocus();
            return false;
        }

        if(!Patterns.EMAIL_ADDRESS.matcher(Email).matches()){
            _Email.setError("Incorrect email!");
            _Email.requestFocus();
            return false;
        }

        if(Password.isEmpty()){
            _Password.setError("Password is required!");
            _Password.requestFocus();
            return false;
        }

        if(Password.length() < 6){
            _Password.setError("Password can't have less than 6 characters!");
            _Password.requestFocus();
            return false;
        }

        if(CPassword.isEmpty()){
            _ConfirmPassword.setError("You have to confirm password!");
            _ConfirmPassword.requestFocus();
            return false;
        }

        if(!Password.equals(CPassword)){
            _ConfirmPassword.setError("Password confirmation doesn't match password");
            _ConfirmPassword.requestFocus();
            return false;
        }

        return true;
    }

}
