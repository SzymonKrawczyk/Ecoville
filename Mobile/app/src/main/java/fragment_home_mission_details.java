package com.example.bottomnavigationview;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.example.bottomnavigationview.model.Mission;
import com.example.bottomnavigationview.model.User;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.ArrayList;
import java.util.HashMap;

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
                System.out.println(documentSnapshot);
                System.out.println(documentSnapshot.toObject(Mission.class));
                Mission mission = documentSnapshot.toObject(Mission.class);
                if (mission != null){

                    CLHide.setVisibility(View.GONE);
                    TVMissionDetailsTitleDate.setText(mission._getMonth() + ", " + mission._getDay());
                    TVDay.setText(mission._getDay());
                    TVMonth.setText(mission._getMonth());
                    TVTime.setText(mission._getTime());
                    TVDuration.setText(String.valueOf(mission.getDurationMinutes()));
                    TVParticipants.setText(mission.getCurrentParticipants().size() + " / " + mission.getRequiredParticipants());
                    TVLocation.setText(mission.getLocation());
                    TVMissionDetailsDescription.setText(mission.getDescription());
                    TVPointsValue.setText(String.valueOf(mission.getPoints()));

                    if (mission._isAvailable()) {

                        TVMissionDetailsTitle.setText(mission.getName().toUpperCase());
                        BTMissionDetailsSubmit.setVisibility(View.VISIBLE);

                        if (mission._hasUser(MainActivity.userDocRef)) {
                            BTMissionDetailsSubmit.setText("REMOVE ME");
                            BTMissionDetailsSubmit.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {

                                    MainActivity.userDocRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                                        @Override
                                        public void onSuccess(DocumentSnapshot documentSnapshot) {
                                            MainActivity.appUser = documentSnapshot.toObject(User.class);

                                            if(MainActivity.appUser == null || MainActivity.appUser._isUserBanned()){
                                                Intent intent = new Intent(getActivity(), UserBannedErrorActivity.class);
                                                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                                startActivity(intent);
                                            }else{
                                                mission._removeUser(MainActivity.userDocRef, db);
                                                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_mission_details()).addToBackStack(null).commit();
                                            }

                                        }
                                    }).addOnFailureListener(new OnFailureListener() {
                                        @Override
                                        public void onFailure(@NonNull Exception e) {
                                            getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                                        }
                                    });

                                }
                            });
                        } else {

                            BTMissionDetailsSubmit.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {

                                    MainActivity.userDocRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                                        @Override
                                        public void onSuccess(DocumentSnapshot documentSnapshot) {
                                            MainActivity.appUser = documentSnapshot.toObject(User.class);

                                            if(MainActivity.appUser == null || MainActivity.appUser._isUserBanned()){
                                                Intent intent = new Intent(getActivity(), UserBannedErrorActivity.class);
                                                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                                startActivity(intent);
                                            }else{
                                                mission._addUser(MainActivity.userDocRef, db);
                                                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_mission_details()).addToBackStack(null).commit();
                                            }
                                        }
                                    }).addOnFailureListener(new OnFailureListener() {
                                        @Override
                                        public void onFailure(@NonNull Exception e) {
                                            getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                                        }
                                    });
                                }
                            });
                        }

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