package com.example.ecoville_app_S;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.example.ecoville_app_S.model.User;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.firebase.ui.firestore.FirestoreRecyclerAdapter;
import com.firebase.ui.firestore.FirestoreRecyclerOptions;

public class RecycleActivity extends AppCompatActivity {

    RecyclerView rv;
    FirebaseFirestore db;
    FirestoreRecyclerAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recycle);

        db = FirebaseFirestore.getInstance();
        rv = (RecyclerView) findViewById(R.id.RVUsers);

        Query query = db.collection("users").orderBy("email");

        FirestoreRecyclerOptions<User> options = new FirestoreRecyclerOptions.Builder<User>()
                .setQuery(query, User.class).build();

        adapter = new FirestoreRecyclerAdapter<User, UserViewHolder>(options) {

            @NonNull
            @Override
            public UserViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

                View view = LayoutInflater.from(parent.getContext())
                        .inflate(R.layout.item_rv, parent, false);
                return new UserViewHolder(view);
            }

            @Override
            protected void onBindViewHolder(@NonNull UserViewHolder holder, int position, @NonNull User model) {

                holder.tvRVname.setText(model.getFirstName() + " " + model.getLastName());
                holder.tvRVemail.setText(model.getEmail());
                holder.tvRVdob.setText(String.valueOf(model.getDob()));
            }
        };

        rv.setLayoutManager(new LinearLayoutManager(this));
        rv.setHasFixedSize(true);
        rv.setAdapter(adapter);



    }

    public class UserViewHolder extends RecyclerView.ViewHolder {

        TextView tvRVname;
        TextView tvRVemail;
        TextView tvRVdob;

        public UserViewHolder(@NonNull View itemView) {
            super(itemView);


            tvRVname  = (TextView) itemView.findViewById(R.id.tvRVname);
            tvRVemail = (TextView) itemView.findViewById(R.id.tvRVemail);
            tvRVdob   = (TextView) itemView.findViewById(R.id.tvRVdob);
        }

    }

    @Override
    protected void onStart() {
        super.onStart();
        adapter.startListening();
    }

    @Override
    protected void onStop() {
        super.onStop();
        adapter.stopListening();
    }
}