package com.example.ecoville_app_S;

        import androidx.annotation.NonNull;
        import androidx.appcompat.app.AppCompatActivity;

        import android.content.Intent;
        import android.os.Bundle;
        import android.os.StrictMode;
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
        import com.google.firebase.firestore.DocumentSnapshot;
        import com.google.firebase.firestore.FirebaseFirestore;

public class LogIn extends AppCompatActivity {

    private FirebaseAuth mAuth;
    private FirebaseFirestore db;

    EditText _Email;
    EditText _Password;
    Button LogIn;
    Button SingUp;
    Button ForgetPassword;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_log_in);

        db = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();

        _Email = (EditText) findViewById(R.id.ETEmail);
        _Password = (EditText) findViewById(R.id.ETPassword);

        LogIn = (Button) findViewById(R.id.BLogIn);
        SingUp = (Button) findViewById(R.id.BSingup);
        ForgetPassword = (Button) findViewById(R.id.BForgetPassword);

        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);

        ForgetPassword.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getApplicationContext(), ResetPasswordActivity.class);
                startActivity(intent);
            }
        });

        SingUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getApplicationContext(), SingUpActivity.class);
                startActivity(intent);
            }
        });

        LogIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                String Email = _Email.getText().toString().trim();
                String Password = _Password.getText().toString().trim();


                if(Email.isEmpty()){
                    _Email.setError("Email adress is required!");
                    _Email.requestFocus();
                    return;
                }

                if(!Patterns.EMAIL_ADDRESS.matcher(Email).matches()){
                    _Email.setError("Incorrect email!");
                    _Email.requestFocus();
                    return;
                }

                if(Password.isEmpty()){
                    _Password.setError("Password is required!");
                    _Password.requestFocus();
                    return;
                }

                mAuth.signInWithEmailAndPassword(Email, Password).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if(task.isSuccessful()){
                            setUser();
                        }else {
                            Toast.makeText(LogIn.this, task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
        });
    }

    public void setUser() {
        FirebaseAuth mAuth;
        FirebaseFirestore FStore;
        String UserId;

        FStore = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();

        UserId = mAuth.getCurrentUser().getUid();
        MainActivity.userDocRef = FStore.collection("user").document(UserId);
        MainActivity.userDocRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                MainActivity.appUser = documentSnapshot.toObject(User.class);

                //Toast.makeText(LogIn.this, "You successfully log in :)", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(getApplicationContext(), MainActivity.class);
                startActivity(intent);
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
            }
        });
    }
}




