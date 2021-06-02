package com.example.ecoville_app_S;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.example.ecoville_app_S.model.Mission;
import com.firebase.ui.firestore.FirestoreRecyclerAdapter;
import com.firebase.ui.firestore.FirestoreRecyclerOptions;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;

import java.util.Date;


public class fragment_home_missions extends Fragment {



    public fragment_home_missions() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    private Date date;

    private Button BTHomeTalk;
    private Button BTHomeTips;

    RecyclerView rv;
    FirebaseFirestore db;
    FirestoreRecyclerAdapter adapter;

    public static String missionDocID = null;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_home_missions, container, false);

        //date = MainActivity.getDateFromServer();
        date = new Date();
        //if(date == null) {
        //    getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
        //}

        BTHomeTalk = (Button) view.findViewById(R.id.BTHomeTalk);
        BTHomeTips = (Button) view.findViewById(R.id.BTHomeTips);

        BTHomeTalk.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_talk()).addToBackStack(null).commit();
            }
        });

        BTHomeTips.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_tips()).addToBackStack(null).commit();
            }
        });

        /*CVMission1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_mission_details()).addToBackStack(null).commit();
            }
        });*/


        db = FirebaseFirestore.getInstance();
        rv = (RecyclerView) view.findViewById(R.id.RVMissions);
        //System.out.println("here 0");

        Query query = db.collection("mission").orderBy("when", Query.Direction.DESCENDING);

        //System.out.println("here 1");

        FirestoreRecyclerOptions<Mission> options = new FirestoreRecyclerOptions.Builder<Mission>()
                .setQuery(query, Mission.class).build();

        //System.out.println("here 2");
        adapter = new FirestoreRecyclerAdapter<Mission, MissionViewHolder>(options) {

            @NonNull
            @Override
            public MissionViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
                //System.out.println("here 3");

                View view = LayoutInflater.from(parent.getContext())
                        .inflate(R.layout.item_rv_mission, parent, false);
                return new MissionViewHolder(view);
            }


            @Override
            protected void onBindViewHolder(@NonNull MissionViewHolder holder, int position, @NonNull Mission model) {
                // System.out.println("here 4");

                holder.TVMissionName.setText(model.getName().toUpperCase());

                //System.out.println("here 9");
                //System.out.println(model.getName() + " | " + model._isAvailable());
                //System.out.println("here 10");

                //if (model._isAvailable()) {
                if (date.getTime()/1000 < model.getWhen().getSeconds() ){

                    //if (model._isNew()) holder.TVMissionNew.setVisibility(View.VISIBLE);
                    if((date.getTime()/1000 - model.getAdded().getSeconds()) < 60*60*24*7){
                        holder.TVMissionNew.setVisibility(View.VISIBLE);
                    }
                    holder.CVMission.setBackgroundColor(getResources().getColor(R.color.white));
                    holder.TVMissionName.setTextColor(getResources().getColor(R.color.black));
                    holder.TVMissionPointsValue.setTextColor(getResources().getColor(R.color.lightGreen));
                    holder.TVMissionPointsValueLabel.setTextColor(getResources().getColor(R.color.lightGreen));

                    if (model._hasUser(MainActivity.userDocRef)) {
                        holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_green_bg);
                        holder.CLMissionParticipation.setVisibility(View.VISIBLE);
                    }
                    else holder.CLMissionParticipation.setVisibility(View.INVISIBLE);
                } else {
                    holder.TVMissionNew.setVisibility(View.INVISIBLE);
                    holder.CVMission.setBackgroundColor(getResources().getColor(R.color.lightGray));
                    holder.TVMissionName.setTextColor(getResources().getColor(R.color.darkGray));
                    holder.TVMissionPointsValue.setTextColor(getResources().getColor(R.color.darkGray));
                    holder.TVMissionPointsValueLabel.setTextColor(getResources().getColor(R.color.darkGray));


                    if (model._hasUser(MainActivity.userDocRef)) {
                        holder.CLMissionParticipation.setBackgroundResource(R.drawable.round_corners_left_darkgray_bg);
                        holder.CLMissionParticipation.setVisibility(View.VISIBLE);
                    }
                    else holder.CLMissionParticipation.setVisibility(View.INVISIBLE);
                }

                holder.TVMissionName.setText(model.getName().toUpperCase());
                holder.TVMissionPointsValue.setText(String.valueOf(model.getPoints()));

                DocumentSnapshot snapshot = options.getSnapshots().getSnapshot(position);
                String missionDocIDTEMP = snapshot.getId();


                holder.CVMission.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        //DocumentSnapshot snapshot = options.getSnapshots().getSnapshot(position);
                        //DocumentSnapshot snapshot = options.getSnapshots().getSnapshot(position);
                        //missionDocID = snapshot.getId();
                        missionDocID = missionDocIDTEMP;
                        getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_mission_details()).addToBackStack(null).commit();
                    }
                });

                // System.out.println("here 6");
            }
        };

        //System.out.println("here 7");
        rv.setLayoutManager(new LinearLayoutManager(this.getContext()));
        //rv.setHasFixedSize(true);
        rv.setAdapter(adapter);
        //System.out.println("here 8");

        return view;
    }

    public class MissionViewHolder extends RecyclerView.ViewHolder {

        TextView TVMissionNew;
        TextView TVMissionName;
        TextView TVMissionPointsValue;
        TextView TVMissionPointsValueLabel;
        ConstraintLayout CLMissionParticipation;
        CardView CVMission;

        public MissionViewHolder(@NonNull View itemView) {
            super(itemView);

            // System.out.println("here 5");

            TVMissionNew  = (TextView) itemView.findViewById(R.id.TVMissionNew);
            TVMissionName = (TextView) itemView.findViewById(R.id.TVMissionName);
            TVMissionPointsValue = (TextView) itemView.findViewById(R.id.TVMissionPointsValue);
            TVMissionPointsValueLabel = (TextView) itemView.findViewById(R.id.TVMissionPointsValueLabel);
            CLMissionParticipation = (ConstraintLayout) itemView.findViewById(R.id.CLMissionParticipation);
            CVMission = (CardView) itemView.findViewById(R.id.CVMission);
            //System.out.println("here 5.5");
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