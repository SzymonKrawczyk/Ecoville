package com.example.bottomnavigationview;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

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

import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SingUpActivity extends AppCompatActivity {

    private FirebaseAuth mAuth;
    private FirebaseFirestore db;
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

        db = FirebaseFirestore.getInstance();
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
                    bannedUsersValidation();
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

        Date date = MainActivity.getDateFromServer();
        if(date == null){
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
        }else{
            mAuth.createUserWithEmailAndPassword(Email, Password).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                @Override
                public void onComplete(@NonNull Task<AuthResult> task) {
                    if (task.isSuccessful()) {
                        Toast.makeText(SingUpActivity.this, "New account created.\nYou can now use it to log in", Toast.LENGTH_LONG).show();

                        userId = mAuth.getCurrentUser().getUid();
                        DocumentReference docRef = db.collection("user").document(userId);

                        User user = new User( Email, FName, LName, date);
                        docRef.set(user).addOnFailureListener(new OnFailureListener() {
                            @Override
                            public void onFailure(@NonNull Exception e) {
                                Toast.makeText(SingUpActivity.this, "We are currently facing some technical issues,\n please try again later", Toast.LENGTH_LONG).show();
                            }
                        });
                        startActivity(new Intent(getApplicationContext(), LogIn.class));

                    /*
                    Map<String, Object>user = new HashMap<>();
                    user.put("firstName", FName);
                    user.put("lastName", LName);
                    user.put("email", Email);
                    user.put("password", Password);
                    */
                    } else {
                        Toast.makeText(SingUpActivity.this, "We are currently facing some technical issues,\n please try again later", Toast.LENGTH_LONG).show();
                        //Toast.makeText(SingUpActivity.this, "Something went wrong :c \n " + task.getException().getMessage(), Toast.LENGTH_SHORT).show();
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
            _Email.setError("Email address is required!");
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

        if(Password.length() < 8){
            _Password.setError("Password can't have less than 8 characters!");
            _Password.requestFocus();
            return false;
        }

        Pattern letterLower = Pattern.compile("[a-z]");
        Matcher hasLetterLower = letterLower.matcher(Password);
        if(!hasLetterLower.find()){
            _Password.setError("Password must contain at least one lowercase letter");
            _Password.requestFocus();
            return false;
        }

        Pattern letterUpper = Pattern.compile("[A-Z]");
        Matcher hasLetterUpper = letterUpper.matcher(Password);
        if(!hasLetterUpper.find()){
            _Password.setError("Password must contain at least one uppercase letter");
            _Password.requestFocus();
            return false;
        }

        Pattern digit = Pattern.compile("[0-9]");
        Matcher hasDigit = digit.matcher(Password);
        if(!hasDigit.find()){
            _Password.setError("Password must contain at least one digit");
            _Password.requestFocus();
            return false;
        }

        Pattern special = Pattern.compile("[^A-Za-z0-9]");
        Matcher hasSpecial = special.matcher(Password);
        if(!hasSpecial.find()){
            _Password.setError("Password must contain at least one special character");
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

    public void bannedUsersValidation(){

        String Email = _Email.getText().toString().trim();

        CollectionReference emails = db.collection("_appData");
        emails.whereArrayContains("emails", Email).get().addOnSuccessListener(new OnSuccessListener<QuerySnapshot>() {
            @Override
            public void onSuccess(QuerySnapshot queryDocumentSnapshots) {
                if(!queryDocumentSnapshots.isEmpty()){
                    _Email.setError("Given email address was banned,\ncontact your administrator for details");
                    _Email.requestFocus();
                }else {
                    createUser();
                }
            }
        });
    }
}
