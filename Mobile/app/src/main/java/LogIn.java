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
        import com.google.android.gms.tasks.Task;
        import com.google.firebase.auth.AuthResult;
        import com.google.firebase.auth.FirebaseAuth;
        import com.google.firebase.firestore.FirebaseFirestore;

public class LogIn extends AppCompatActivity {

    private FirebaseAuth mAuth;
    private FirebaseFirestore db;

    EditText _Email;
    EditText _Password;
    Button LogIn;
    Button SingUp;
    Button ForgetPassword;

    User AppUser = null;    //TODO: zminić nazwę na coś bardziej sensownego


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
                            Toast.makeText(LogIn.this, "You successfully log in :)", Toast.LENGTH_SHORT).show();
                            Intent intent = new Intent(getApplicationContext(), MainActivity.class);
                            startActivity(intent);
                        }else {
                            Toast.makeText(LogIn.this, "Something went wrong :c \n " + task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
        });
    }
}
    /*
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


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

    public void showToast(String msg) {
        Toast toast = Toast.makeText(getApplicationContext(), msg, Toast.LENGTH_LONG);
        toast.show();
    }*/



