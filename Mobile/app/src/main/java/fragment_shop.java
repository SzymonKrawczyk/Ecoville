package com.example.ecoville_app_S;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.example.ecoville_app_S.model.Mission;
import com.example.ecoville_app_S.model.Trophy;
import com.example.ecoville_app_S.model.User;
import com.example.ecoville_app_S.model.fragment_shop_adapter;
import com.firebase.ui.firestore.FirestoreRecyclerAdapter;
import com.firebase.ui.firestore.FirestoreRecyclerOptions;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.concurrent.ThreadLocalRandom;


public class fragment_shop extends Fragment {


    public fragment_shop() {
        // Required empty public constructor}
    }

    @Override
    public void onCreate(Bundle savedInstanceState) { super.onCreate(savedInstanceState); }

    public static TextView TotalPoints;

    RecyclerView rv;
    FirebaseFirestore db;

    ArrayList <DocumentReference> userTrophiesDocRef;
    ArrayList <DocumentReference> allTrophiesDocRef;


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {



        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_shop, container, false);

        db = FirebaseFirestore.getInstance();
        rv = (RecyclerView) view.findViewById(R.id.RVTrophy);

        MainActivity.userDocRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                MainActivity.appUser = documentSnapshot.toObject(User.class);
                TotalPoints = (TextView) view.findViewById(R.id.TVShopTotalPointsValue);
                TotalPoints.setText(String.valueOf(MainActivity.appUser.getCurrentPoints()));



                ArrayList<HashMap<String, Object>> hashMaps = new ArrayList<>();
                hashMaps = MainActivity.appUser.getTrophies();

                userTrophiesDocRef = new ArrayList<>();
                allTrophiesDocRef = new ArrayList<>();

                if(hashMaps != null)
                {
                    for(int i=0; i<hashMaps.size(); i++){
                        userTrophiesDocRef.add( (DocumentReference) hashMaps.get(i).get("trophy_id") );
                    }
                }

                loadAllTrophies( allTrophiesDocRef );
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
            }
        });

        //TotalPoints = (TextView) view.findViewById(R.id.TVShopTotalPointsValue);
        //TotalPoints.setText(String.valueOf(MainActivity.appUser.getCurrentPoints()));



        return view;
    }

    private void loadAllTrophies(ArrayList<DocumentReference> allTrophiesDocRef) {
        db.collection("trophy").orderBy("cost", Query.Direction.DESCENDING).get().addOnSuccessListener(new OnSuccessListener<QuerySnapshot>() {
            @Override
            public void onSuccess(QuerySnapshot queryDocumentSnapshots) {
                for(QueryDocumentSnapshot querySnapshot : queryDocumentSnapshots){
                    String trophy_id = querySnapshot.getId();
                    DocumentReference dr = db.collection("trophy").document(trophy_id);
                    allTrophiesDocRef.add(dr);
                }
                setRecycleViewContent();
            }
        });
    }

    private void setRecycleViewContent(){
        for(int i=0; i<allTrophiesDocRef.size(); i++) {
            for(int j=0; j<userTrophiesDocRef.size(); j++){
                if( allTrophiesDocRef.get(i).getId().equals(userTrophiesDocRef.get(j).getId()) ){
                    allTrophiesDocRef.remove(i);
                    i--;
                    break;
                }
            }
        }

        fragment_shop_adapter adapter = new fragment_shop_adapter(this.getContext(), getActivity(), allTrophiesDocRef, MainActivity.appUser.getCurrentPoints());

        GridLayoutManager gridLayoutManager = new GridLayoutManager(this.getContext(), 3, GridLayoutManager.VERTICAL, false);   //getActivity();
        rv.setLayoutManager(gridLayoutManager);
        rv.setAdapter(adapter);
    }
}