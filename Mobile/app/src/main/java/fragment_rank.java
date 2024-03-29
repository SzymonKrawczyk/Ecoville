package com.example.ecoville_app_S;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.example.ecoville_app_S.model.User;
import com.firebase.ui.firestore.FirestoreRecyclerAdapter;
import com.firebase.ui.firestore.FirestoreRecyclerOptions;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

public class fragment_rank extends Fragment {



    public fragment_rank() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }


    RecyclerView rv;
    FirebaseFirestore db;
    FirestoreRecyclerAdapter adapter;
    boolean userFound = false;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_rank, container, false);

        db = FirebaseFirestore.getInstance();
        rv = (RecyclerView) view.findViewById(R.id.RVRank);
        rv.setLayoutManager(new LinearLayoutManager(this.getContext()));


//        Query query = db.collection("user").orderBy("totalPointsSum", Query.Direction.DESCENDING).limit(10);
//
//        FirestoreRecyclerOptions<User> options = new FirestoreRecyclerOptions.Builder<User>()
//                .setQuery(query, User.class).build();


        MainActivity.userDocRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                MainActivity.appUser = documentSnapshot.toObject(User.class);

                Query query = db.collection("user").orderBy("totalPointsSum", Query.Direction.DESCENDING).limit(10);
                FirestoreRecyclerOptions<User> options = new FirestoreRecyclerOptions.Builder<User>()
                        .setQuery(query, User.class).build();


                adapter = new FirestoreRecyclerAdapter<User, RankViewHolder>(options) {

                    @NonNull
                    @Override
                    public RankViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

                        View view = LayoutInflater.from(parent.getContext())
                                .inflate(R.layout.item_rv_rank, parent, false);
                        return new RankViewHolder(view);
                    }

                    @Override
                    protected void onBindViewHolder(@NonNull RankViewHolder holder, int position, @NonNull User model) {

                        holder.TVRankName.setText(model.getFirstName() + " " + model.getLastName());
                        holder.TVRankPointsValue.setText(String.valueOf(model.getTotalPointsSum()));
                        holder.TVRankPosition.setText(String.valueOf(position+1));

                        if (position + 1 > 3)  {
                            holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_white_bg);
                            holder.TVRankPosition.setTextColor(getResources().getColor(R.color.lightGreen));
                        } else {
                            holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_green_bg);
                            holder.TVRankPosition.setTextColor(getResources().getColor(R.color.white));
                        }

                        System.out.println(model.getFirstName() + " " + position);
                        //System.out.println(options.getSnapshots().getSnapshot(position).getId());
                        //System.out.println(options.getSnapshots().getSnapshot(position).getId());

                        if (MainActivity.userDocRef.getId().equals(options.getSnapshots().getSnapshot(position).getId())) {
                            userFound = true;
                            holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_darkgray_bg);
                            holder.TVRankPosition.setTextColor(getResources().getColor(R.color.white));
                        }

                        if (position + 1 == 10 && !userFound) {
                            holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_darkgray_bg);
                            holder.TVRankPosition.setTextColor(getResources().getColor(R.color.white));
                            holder.TVRankName.setText(MainActivity.appUser.getFirstName() + " " + MainActivity.appUser.getLastName());
                            holder.TVRankPointsValue.setText(String.valueOf(MainActivity.appUser.getTotalPointsSum()));
                            holder.TVRankPosition.setText("?");


                            db.collection("user")
                                    .orderBy("totalPointsSum", Query.Direction.DESCENDING)
                                    .get()
                                    .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                        @Override
                                        public void onComplete(@NonNull Task<QuerySnapshot> task) {
                                            if (task.isSuccessful()) {
                                                int i = 1;
                                                for (QueryDocumentSnapshot document : task.getResult()) {
                                                    if (document == null) break;
                                                    if (MainActivity.userDocRef.getId().equals(document.getId())) break;
                                                    ++i;
                                                }
                                                holder.TVRankPosition.setText(String.valueOf(i));
                                            }}});
                        }
                    }
                };

                adapter.startListening();

                //rv.setLayoutManager(new LinearLayoutManager(this.getContext()));
                /*rv.setHasFixedSize(true);*/
                rv.setAdapter(adapter);
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
            }
        });




//        adapter = new FirestoreRecyclerAdapter<User, RankViewHolder>(options) {
//
//            @NonNull
//            @Override
//            public RankViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
//
//                View view = LayoutInflater.from(parent.getContext())
//                        .inflate(R.layout.item_rv_rank, parent, false);
//                return new RankViewHolder(view);
//            }
//
//            @Override
//            protected void onBindViewHolder(@NonNull RankViewHolder holder, int position, @NonNull User model) {
//
//                holder.TVRankName.setText(model.getFirstName() + " " + model.getLastName());
//                holder.TVRankPointsValue.setText(String.valueOf(model.getTotalPointsSum()));
//                holder.TVRankPosition.setText(String.valueOf(position+1));
//
//                if (position + 1 > 3)  {
//                    holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_white_bg);
//                    holder.TVRankPosition.setTextColor(getResources().getColor(R.color.lightGreen));
//                } else {
//                    holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_green_bg);
//                    holder.TVRankPosition.setTextColor(getResources().getColor(R.color.white));
//                }
//
//                System.out.println(model.getFirstName() + " " + position);
//                //System.out.println(options.getSnapshots().getSnapshot(position).getId());
//                //System.out.println(options.getSnapshots().getSnapshot(position).getId());
//
//                if (MainActivity.userDocRef.getId().equals(options.getSnapshots().getSnapshot(position).getId())) {
//                    userFound = true;
//                    holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_darkgray_bg);
//                    holder.TVRankPosition.setTextColor(getResources().getColor(R.color.white));
//                }
//
//                if (position + 1 == 10 && !userFound) {
//                    holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_darkgray_bg);
//                    holder.TVRankPosition.setTextColor(getResources().getColor(R.color.white));
//                    holder.TVRankName.setText(MainActivity.appUser.getFirstName() + " " + MainActivity.appUser.getLastName());
//                    holder.TVRankPointsValue.setText(String.valueOf(MainActivity.appUser.getTotalPointsSum()));
//                    holder.TVRankPosition.setText("?");
//
//
//                    db.collection("user")
//                            .orderBy("totalPointsSum", Query.Direction.DESCENDING)
//                            .get()
//                            .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
//                                @Override
//                                public void onComplete(@NonNull Task<QuerySnapshot> task) {
//                                    if (task.isSuccessful()) {
//                                        int i = 1;
//                                        for (QueryDocumentSnapshot document : task.getResult()) {
//                                            if (document == null) break;
//                                            if (MainActivity.userDocRef.getId().equals(document.getId())) break;
//                                            ++i;
//                                        }
//                                        holder.TVRankPosition.setText(String.valueOf(i));
//                                    }}});
//
//
//                }
//
//                //model._showMap();
//            }
//        };
//
//        rv.setLayoutManager(new LinearLayoutManager(this.getContext()));
//        /*rv.setHasFixedSize(true);*/
//        rv.setAdapter(adapter);

        return view;
    }

    public void setRecycleView(){

        Query query = db.collection("user").orderBy("totalPointsSum", Query.Direction.DESCENDING).limit(10);
        FirestoreRecyclerOptions<User> options = new FirestoreRecyclerOptions.Builder<User>()
                .setQuery(query, User.class).build();


        adapter = new FirestoreRecyclerAdapter<User, RankViewHolder>(options) {

            @NonNull
            @Override
            public RankViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

                View view = LayoutInflater.from(parent.getContext())
                        .inflate(R.layout.item_rv_rank, parent, false);
                return new RankViewHolder(view);
            }

            @Override
            protected void onBindViewHolder(@NonNull RankViewHolder holder, int position, @NonNull User model) {

                holder.TVRankName.setText(model.getFirstName() + " " + model.getLastName());
                holder.TVRankPointsValue.setText(String.valueOf(model.getTotalPointsSum()));
                holder.TVRankPosition.setText(String.valueOf(position+1));

                if (position + 1 > 3)  {
                    holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_white_bg);
                    holder.TVRankPosition.setTextColor(getResources().getColor(R.color.lightGreen));
                } else {
                    holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_green_bg);
                    holder.TVRankPosition.setTextColor(getResources().getColor(R.color.white));
                }

                System.out.println(model.getFirstName() + " " + position);
                //System.out.println(options.getSnapshots().getSnapshot(position).getId());
                //System.out.println(options.getSnapshots().getSnapshot(position).getId());

                if (MainActivity.userDocRef.getId().equals(options.getSnapshots().getSnapshot(position).getId())) {
                    userFound = true;
                    holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_darkgray_bg);
                    holder.TVRankPosition.setTextColor(getResources().getColor(R.color.white));
                }

                if (position + 1 == 10 && !userFound) {
                    holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_darkgray_bg);
                    holder.TVRankPosition.setTextColor(getResources().getColor(R.color.white));
                    holder.TVRankName.setText(MainActivity.appUser.getFirstName() + " " + MainActivity.appUser.getLastName());
                    holder.TVRankPointsValue.setText(String.valueOf(MainActivity.appUser.getTotalPointsSum()));
                    holder.TVRankPosition.setText("?");


                    db.collection("user")
                            .orderBy("totalPointsSum", Query.Direction.DESCENDING)
                            .get()
                            .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                @Override
                                public void onComplete(@NonNull Task<QuerySnapshot> task) {
                                    if (task.isSuccessful()) {
                                        int i = 1;
                                        for (QueryDocumentSnapshot document : task.getResult()) {
                                            if (document == null) break;
                                            if (MainActivity.userDocRef.getId().equals(document.getId())) break;
                                            ++i;
                                        }
                                        holder.TVRankPosition.setText(String.valueOf(i));
                                    }}});
                }
            }
        };

        rv.setLayoutManager(new LinearLayoutManager(this.getContext()));
        /*rv.setHasFixedSize(true);*/
        rv.setAdapter(adapter);
    }

    public class RankViewHolder extends RecyclerView.ViewHolder {

        TextView TVRankName;
        TextView TVRankPointsValue;
        TextView TVRankPosition;
        ConstraintLayout CLMissionParticipation;

        public RankViewHolder(@NonNull View itemView) {
            super(itemView);


            TVRankName  = (TextView) itemView.findViewById(R.id.TVRankName);
            TVRankPointsValue = (TextView) itemView.findViewById(R.id.TVRankPointsValue);
            TVRankPosition = (TextView) itemView.findViewById(R.id.TVRankPosition);
            CLMissionParticipation = (ConstraintLayout) itemView.findViewById(R.id.CLMissionParticipation);
        }

    }

    @Override
    public void onStart() {
        super.onStart();
        //adapter.startListening();
    }

    @Override
    public void onStop() {
        super.onStop();
        adapter.stopListening();
    }

}