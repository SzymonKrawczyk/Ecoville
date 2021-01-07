package com.example.ecoville_app_S;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.example.ecoville_app_S.model.Tip;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

public class fragment_home_tip_details extends Fragment {


    public fragment_home_tip_details() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }


    TextView TVTipsDetailsTitle;
    TextView TVTipsDetailsDate;
    TextView TVTipContent;
    Button BTTipsDtailsLike;


    FirebaseFirestore db;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_home_tip_details, container, false);

        db = FirebaseFirestore.getInstance();

        TVTipsDetailsTitle = (TextView) view.findViewById(R.id.TVTipsDetailsTitle);
        TVTipsDetailsDate = (TextView) view.findViewById(R.id.TVTipsDetailsDate);
        TVTipContent = (TextView) view.findViewById(R.id.TVTipContent);
        BTTipsDtailsLike = (Button) view.findViewById(R.id.BTTipsDtailsLike);


        DocumentReference docRef = db.collection("tips").document(fragment_home_tips.tipDocID);
        docRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                Tip tip = documentSnapshot.toObject(Tip.class);
                if (tip != null){
                    TVTipsDetailsTitle.setText(tip.getTitle().toUpperCase());
                    TVTipsDetailsDate.setText(tip.getDate());
                    TVTipContent.setText(tip.getContent());
                    BTTipsDtailsLike.setVisibility(View.VISIBLE);
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