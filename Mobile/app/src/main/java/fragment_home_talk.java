package com.example.ecoville_app_S;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.example.ecoville_app_S.model.Post;
import com.example.ecoville_app_S.model.Tip;
import com.firebase.ui.firestore.FirestoreRecyclerAdapter;
import com.firebase.ui.firestore.FirestoreRecyclerOptions;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;

public class fragment_home_talk extends Fragment {



    public fragment_home_talk() {
        // Required empty public constructor
    }



    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    private Button BTHomeMissions;
    private Button BTHomeTips;

    RecyclerView rv;
    FirebaseFirestore db;
    FirestoreRecyclerAdapter adapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_home_talk, container, false);


        BTHomeMissions = (Button) view.findViewById(R.id.BTHomeMissions);
        BTHomeTips = (Button) view.findViewById(R.id.BTHomeTips);

        BTHomeMissions.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_missions()).addToBackStack(null).commit();
            }
        });
        BTHomeTips.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_tips()).addToBackStack(null).commit();
            }
        });



        db = FirebaseFirestore.getInstance();
        rv = (RecyclerView) view.findViewById(R.id.RVTalk);

        Query query = db.collection("post").orderBy("timestamp", Query.Direction.DESCENDING);



        FirestoreRecyclerOptions<Post> options = new FirestoreRecyclerOptions.Builder<Post>()
                .setQuery(query, Post.class).build();

        adapter = new FirestoreRecyclerAdapter<Post, PostViewHolder>(options) {

            @NonNull
            @Override
            public PostViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

                View view = LayoutInflater.from(parent.getContext())
                        .inflate(R.layout.item_rv_post, parent, false);
                return new PostViewHolder(view);
            }

            @Override
            protected void onBindViewHolder(@NonNull PostViewHolder holder, int position, @NonNull Post model) {

                DocumentReference userRef = db.document(model.getId_user().getPath());

                String author = "User user";

                userRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                    @Override
                    public void onSuccess(DocumentSnapshot documentSnapshot) {
                        /*Tip tip = documentSnapshot.toObject(Tip.class);
                        if (tip != null){
                            author =
                        } else {
                            getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                        }*/
                    }
                }).addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                    }
                });

                holder.TVPostAuthor.setText(author);
                holder.TVPostContent.setText(model.getMessage());

            }
        };

        rv.setLayoutManager(new LinearLayoutManager(this.getContext()));
        /*rv.setHasFixedSize(true);*/
        rv.setAdapter(adapter);


        return view;
    }

    public class PostViewHolder extends RecyclerView.ViewHolder {

        TextView TVPostAuthor;
        TextView TVPostContent;

        public PostViewHolder(@NonNull View itemView) {
            super(itemView);


            TVPostAuthor  = (TextView) itemView.findViewById(R.id.TVPostAuthor);
            TVPostContent = (TextView) itemView.findViewById(R.id.TVPostContent);
        }

    }

    @Override
    public void onStart() {
        super.onStart();
        adapter.startListening();
    }

    @Override
    public void onStop() {
        super.onStop();
        adapter.stopListening();
    }
}