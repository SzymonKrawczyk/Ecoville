package com.example.bottomnavigationview;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.example.bottomnavigationview.model.User;
import com.example.bottomnavigationview.model.fragment_shop_adapter;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.HashMap;



public class fragment_shop extends Fragment {


    public fragment_shop() {
        // Required empty public constructor}
    }

    @Override
    public void onCreate(Bundle savedInstanceState) { super.onCreate(savedInstanceState); }

    public static TextView TotalPoints;

    Button BTShopAwards;
    Button BTShopGadgets;
    Button BTShopGames;

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

        BTShopAwards = (Button) view.findViewById(R.id.BTShopAwards);
        BTShopGadgets = (Button) view.findViewById(R.id.BTShopGadgets);
        BTShopGames = (Button) view.findViewById(R.id.BTShopGames);

        rv = (RecyclerView) view.findViewById(R.id.RVTrophy);


        // setting the colors for buttons
        BTShopAwards.setTextColor(ContextCompat.getColor(getContext(), R.color.lightGreen));
        BTShopGadgets.setTextColor(ContextCompat.getColor(getContext(), R.color.black));
        BTShopGames.setTextColor(ContextCompat.getColor(getContext(), R.color.black));

        BTShopGadgets.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_shop_gadgets()).addToBackStack(null).commit();
            }
        });

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
