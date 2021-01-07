package com.example.ecoville_app_S;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.example.ecoville_app_S.model.Mission;
import com.example.ecoville_app_S.model.Tip;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

public class fragment_home_mission_details extends Fragment {



    public fragment_home_mission_details() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    TextView TVMissionDetailsTitleDate;
    TextView TVMissionDetailsTitle;
    TextView TVDay;
    TextView TVMonth;
    TextView TVTime;
    TextView TVDuration;
    TextView TVParticipants;
    TextView TVLocation;
    TextView TVMissionDetailsDescription;
    TextView TVPointsValue;
    Button BTMissionDetailsSubmit;
    ConstraintLayout CLHide;


    FirebaseFirestore db;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_home_mission_details, container, false);

        db = FirebaseFirestore.getInstance();

        TVMissionDetailsTitleDate = (TextView) view.findViewById(R.id.TVMissionDetailsTitleDate);
        TVMissionDetailsTitle = (TextView) view.findViewById(R.id.TVMissionDetailsTitle);
        TVDay = (TextView) view.findViewById(R.id.TVDay);
        TVMonth = (TextView) view.findViewById(R.id.TVMonth);
        TVTime = (TextView) view.findViewById(R.id.TVTime);
        TVDuration = (TextView) view.findViewById(R.id.TVDuration);
        TVParticipants = (TextView) view.findViewById(R.id.TVParticipants);
        TVLocation = (TextView) view.findViewById(R.id.TVLocation);
        TVMissionDetailsDescription = (TextView) view.findViewById(R.id.TVMissionDetailsDescription);
        TVPointsValue = (TextView) view.findViewById(R.id.TVPointsValue);
        BTMissionDetailsSubmit = (Button) view.findViewById(R.id.BTMissionDetailsSubmit);
        CLHide = (ConstraintLayout) view.findViewById(R.id.CLHide);



        DocumentReference docRef = db.collection("mission").document(fragment_home_missions.missionDocID);
        docRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                Mission mission = documentSnapshot.toObject(Mission.class);
                if (mission != null){

                    CLHide.setVisibility(View.GONE);
                    TVMissionDetailsTitleDate.setText(mission.getMonth() + ", " + mission.getDay());
                    TVDay.setText(mission.getDay());
                    TVMonth.setText(mission.getMonth());
                    TVTime.setText(mission.getTime());
                    TVDuration.setText(String.valueOf(mission.getDurationMinutes()));
                    TVParticipants.setText(mission.getCurrentParticipants() + " / " + mission.getRequiredParticipants());
                    TVLocation.setText(mission.getLocation());
                    TVMissionDetailsDescription.setText(mission.getDescription());
                    TVPointsValue.setText(String.valueOf(mission.getPoints()));

                    if (mission.isAvailable()) {

                        TVMissionDetailsTitle.setText(mission.getName().toUpperCase());
                        BTMissionDetailsSubmit.setVisibility(View.VISIBLE);

                        boolean userIsParticipating = true;
                        if (userIsParticipating) BTMissionDetailsSubmit.setText("REMOVE ME");

                    } else {
                        TVMissionDetailsTitle.setText(mission.getName().toUpperCase() + " [ARCHIVE]");
                    }

                } else {
                    getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                }
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
            }
        });

        return view;
    }
}