package com.example.ecoville_app_S;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.ecoville_app_S.model.User;
import com.example.ecoville_app_S.model.fragment_shop_gadgets_adapter;
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

public class fragment_shop_gadgets extends Fragment {

    public fragment_shop_gadgets() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) { super.onCreate(savedInstanceState); }

    public static TextView TotalPoints;

    TextView TVNoContentInfo;

    Button BTShopAwards;
    Button BTShopGadgets;
    Button BTShopGames;

    RecyclerView rv;
    FirebaseFirestore db;

    ArrayList<DocumentReference> userGadgetsDocRef;
    ArrayList<DocumentReference> allGadgetsDocRef;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_shop, container, false);

        db = FirebaseFirestore.getInstance();

        TVNoContentInfo = (TextView) view.findViewById(R.id.TVNoContentInfo);

        BTShopAwards = (Button) view.findViewById(R.id.BTShopAwards);
        BTShopGadgets = (Button) view.findViewById(R.id.BTShopGadgets);
        BTShopGames = (Button) view.findViewById(R.id.BTShopGames);

        rv = (RecyclerView) view.findViewById(R.id.RVTrophy);

        // setting the colors for buttons
        BTShopAwards.setTextColor(ContextCompat.getColor(getContext(), R.color.black));
        BTShopGadgets.setTextColor(ContextCompat.getColor(getContext(), R.color.lightGreen));
        BTShopGames.setTextColor(ContextCompat.getColor(getContext(), R.color.black));


        BTShopAwards.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_shop()).addToBackStack(null).commit();
            }
        });


        // why did i write that abomination?
        MainActivity.userDocRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                MainActivity.appUser = documentSnapshot.toObject(User.class);
                TotalPoints = (TextView) view.findViewById(R.id.TVShopTotalPointsValue);
                TotalPoints.setText(String.valueOf(MainActivity.appUser.getCurrentPoints()));

                ArrayList<HashMap<String, Object>> hashMaps = new ArrayList<>();
                hashMaps = MainActivity.appUser.getGadgets();

                userGadgetsDocRef = new ArrayList<>();
                allGadgetsDocRef = new ArrayList<>();

                if(hashMaps != null)
                {
                    for(int i=0; i<hashMaps.size(); i++){
                        userGadgetsDocRef.add( (DocumentReference) hashMaps.get(i).get("ref") );
                    }
                }

                loadAllTrophies( allGadgetsDocRef );
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
            }
        });

        return view;
    }

    private void loadAllTrophies(ArrayList<DocumentReference> allGadgetsDocRef) {
        db.collection("gadget").orderBy("cost", Query.Direction.DESCENDING).get().addOnSuccessListener(new OnSuccessListener<QuerySnapshot>() {
            @Override
            public void onSuccess(QuerySnapshot queryDocumentSnapshots) {
                for(QueryDocumentSnapshot querySnapshot : queryDocumentSnapshots){
                    String gadget_id = querySnapshot.getId();
                    DocumentReference dr = db.collection("gadget").document(gadget_id);
                    allGadgetsDocRef.add(dr);
                }
                setRecycleViewContent();
            }
        });
    }

    private void setRecycleViewContent(){
        for(int i=0; i<allGadgetsDocRef.size(); i++) {
            for(int j=0; j<userGadgetsDocRef.size(); j++){
                if( allGadgetsDocRef.get(i).getId().equals(userGadgetsDocRef.get(j).getId()) ){
                    allGadgetsDocRef.remove(i);
                    i--;
                    break;
                }
            }
        }

        if(allGadgetsDocRef.size() == 0 || allGadgetsDocRef == null)
        {
            TVNoContentInfo.setText("You have purchased all available gadgets.");
            TVNoContentInfo.setVisibility(View.VISIBLE);
        }else{
            fragment_shop_gadgets_adapter adapter = new fragment_shop_gadgets_adapter(this.getContext(), getActivity(), allGadgetsDocRef, MainActivity.appUser.getCurrentPoints());

            GridLayoutManager gridLayoutManager = new GridLayoutManager(this.getContext(), 3, GridLayoutManager.VERTICAL, false);   //getActivity();
            rv.setLayoutManager(gridLayoutManager);
            rv.setAdapter(adapter);
        }
    }
}
