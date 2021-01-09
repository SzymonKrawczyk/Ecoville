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
import android.widget.Button;
import android.widget.TextView;

import com.example.ecoville_app_S.model.Tip;
import com.example.ecoville_app_S.model.User;
import com.firebase.ui.firestore.FirestoreRecyclerAdapter;
import com.firebase.ui.firestore.FirestoreRecyclerOptions;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;

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


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_rank, container, false);


        db = FirebaseFirestore.getInstance();
        rv = (RecyclerView) view.findViewById(R.id.RVRank);

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
                }

                System.out.println(MainActivity.userDocRef.getId());
                System.out.println(options.getSnapshots().getSnapshot(position).getId());

                if (MainActivity.userDocRef.getId().equals(options.getSnapshots().getSnapshot(position).getId())) {
                    holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_darkgray_bg);
                    holder.TVRankPosition.setTextColor(getResources().getColor(R.color.white));
                }

                model._showMap();
            }
        };

        rv.setLayoutManager(new LinearLayoutManager(this.getContext()));
        /*rv.setHasFixedSize(true);*/
        rv.setAdapter(adapter);

        return view;
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
        adapter.startListening();
    }

    @Override
    public void onStop() {
        super.onStop();
        adapter.stopListening();
    }

}