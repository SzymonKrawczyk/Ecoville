package com.example.bottomnavigationview;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.example.bottomnavigationview.model.Mission;
import com.example.bottomnavigationview.model.Post;
import com.example.bottomnavigationview.model.Tip;
import com.example.bottomnavigationview.model.User;
import com.firebase.ui.firestore.FirestoreRecyclerAdapter;
import com.firebase.ui.firestore.FirestoreRecyclerOptions;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.ArrayList;
import java.util.Date;

import static com.firebase.ui.auth.AuthUI.getApplicationContext;

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


    TextView TVPostName;
    EditText ETMLPostContent;
    Button BTPostSend;
    ImageView IVPost;

    RecyclerView rv;
    FirebaseFirestore db;
    FirestoreRecyclerAdapter adapter;

    String author = "";

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



        TVPostName = (TextView) view.findViewById(R.id.TVPostName);
        ETMLPostContent = (EditText) view.findViewById(R.id.ETMLPostContent);
        IVPost = (ImageView) view.findViewById(R.id.IVPost);
        BTPostSend = (Button) view.findViewById(R.id.BTPostSend);


        IVPost.setImageResource(R.drawable.ic_person_green);

        TVPostName.setText(MainActivity.appUser.getFirstName() + " " + MainActivity.appUser.getLastName());


        if (MainActivity.appUser.getProfilePic() != null) {
            FirebaseStorage storage = FirebaseStorage.getInstance();
            // Create a storage reference from our app
            StorageReference storageRef = storage.getReference();

            // Create a reference with an initial file path and name
            StorageReference pathReference = storageRef.child("users/" + MainActivity.appUser.getProfilePic());


            Glide.with(fragment_home_talk.this /* context */)
                    .load(pathReference)
                    .into(IVPost);
        }

        BTPostSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if(MainActivity.appUser._isUserBanned()){
                    onStop();
                    Intent intent = new Intent(getActivity(), UserBannedErrorActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                }else{
                    String content = ETMLPostContent.getText().toString().trim();
                    Timestamp time = new Timestamp(new Date());

                    if (content.length() <= 512) {


                        Post post = new Post(MainActivity.userDocRef, content, time);

                        db.collection("post").add(post)
                                .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                                    @Override
                                    public void onSuccess(DocumentReference documentReference) {
                                        getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_talk()).addToBackStack(null).commit();
                                    }
                                })
                                .addOnFailureListener(new OnFailureListener() {
                                    @Override
                                    public void onFailure(@NonNull Exception e) {
                                        getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                                    }
                                });

                    } else {
                        Toast toast = Toast.makeText(getContext(), "Message is too long", Toast.LENGTH_LONG);
                        toast.show();
                    }
                }
            }
        });














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

                author = "";

                userRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                    @Override
                    public void onSuccess(DocumentSnapshot documentSnapshot) {
                        User user = documentSnapshot.toObject(User.class);
                        if (user != null){
                            author = user.getFirstName() + " " + user.getLastName();

                            if (user.getProfilePic() != null) {
                                FirebaseStorage storage = FirebaseStorage.getInstance();
                                // Create a storage reference from our app
                                StorageReference storageRef = storage.getReference();

                                // Create a reference with an initial file path and name
                                StorageReference pathReference = storageRef.child("users/" + user.getProfilePic());


                                Glide.with(fragment_home_talk.this /* context */)
                                        .load(pathReference)
                                        .into(holder.IVPostAvatar);
                            }



                        } else {
                            author = "[deleted]";
                        }
                        holder.TVPostAuthor.setText(author);
                    }
                }).addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                    }
                });

                holder.TVPostContent.setText(model.getMessage());
                holder.TVPostDate.setText(model._getDate());

                holder.IVPostAvatar.setImageResource(R.drawable.ic_person_green);




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
        TextView TVPostDate;
        ImageView IVPostAvatar;

        public PostViewHolder(@NonNull View itemView) {
            super(itemView);


            TVPostAuthor  = (TextView) itemView.findViewById(R.id.TVPostAuthor);
            TVPostContent = (TextView) itemView.findViewById(R.id.TVPostContent);
            TVPostDate = (TextView) itemView.findViewById(R.id.TVPostDate);
            IVPostAvatar = (ImageView) itemView.findViewById(R.id.IVPostAvatar);
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