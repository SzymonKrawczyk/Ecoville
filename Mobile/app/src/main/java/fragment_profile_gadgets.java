package com.example.ecoville_app_S;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.ecoville_app_S.model.Gadget;
import com.example.ecoville_app_S.model.Trophy;
import com.example.ecoville_app_S.model.fragment_profile_gadgets_adapter;
import com.example.ecoville_app_S.model.fragment_profile_new_trophie_adapter;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

public class fragment_profile_gadgets extends Fragment {

    TextView TVFullName;
    TextView TVMemberSince;

    TextView TVNoContentInfo;

    Button BTProfileTrophies;
    Button BTProfileGadgets;
    Button BTProfileGames;

    RecyclerView rv;
    FirebaseFirestore db;

    ArrayList<DocumentReference> userGadgetsDocRef;
    ArrayList<Gadget> gadgetsList;
    ArrayList<Boolean> isCollected;
    ArrayList<String> gadgetId;

    ArrayList<HashMap<String, Object>> hashMaps;

    public fragment_profile_gadgets() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) { super.onCreate(savedInstanceState); }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_profile_new_trophie, container, false);

        TVFullName = (TextView) view.findViewById(R.id.TVFullName);
        TVFullName.setText(MainActivity.appUser.getFirstName() + " " + MainActivity.appUser.getLastName());

        TVMemberSince = (TextView) view.findViewById(R.id.TVMemberSince);
        Date javaDate = MainActivity.appUser.getCreated().toDate();
        TVMemberSince.setText("member since " + (javaDate.getYear()+1900));

        TVNoContentInfo = (TextView) view.findViewById(R.id.TVNoContentInfo);

        BTProfileTrophies = (Button) view.findViewById(R.id.BTProfileTrophies);
        BTProfileGadgets = (Button) view.findViewById(R.id.BTProfileGadgets);
        BTProfileGames = (Button) view.findViewById(R.id.BTProfileGames);

        ImageView IVProfile = view.findViewById(R.id.IVProfile);

        if (MainActivity.appUser.getProfilePic() != null) {
            FirebaseStorage storage = FirebaseStorage.getInstance();
            // Create a storage reference from our app
            StorageReference storageRef = storage.getReference();

            // Create a reference with an initial file path and name
            StorageReference pathReference = storageRef.child("users/" + MainActivity.appUser.getProfilePic());

            Glide.with(fragment_profile_gadgets.this /* context */)
                    .load(pathReference)
                    .into(IVProfile);
        }

        BTProfileTrophies.setTextColor(ContextCompat.getColor(getContext(), R.color.black));
        BTProfileGadgets.setTextColor(ContextCompat.getColor(getContext(), R.color.lightGreen));
        BTProfileGames.setTextColor(ContextCompat.getColor(getContext(), R.color.black));


        BTProfileTrophies.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_profile_new_trophie()).addToBackStack(null).commit();
            }
        });

        BTProfileGames.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //TODO: wiadomo co
                //getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_profile_new_trophie()).addToBackStack(null).commit();
            }
        });

        db = FirebaseFirestore.getInstance();
        rv = (RecyclerView) view.findViewById(R.id.RVProfileAll);

        hashMaps = MainActivity.appUser.getGadgets();


        ArrayList<HashMap<String, Object>> hashMaps2 = new ArrayList<>();

        ArrayList<String> allGadgets = new ArrayList<>();

        db.collection("gadget")
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            for (QueryDocumentSnapshot document : task.getResult()) {
                                allGadgets.add(document.getId());
                            }


                            for (int i = 0; i < hashMaps.size(); ++i) {

                                    HashMap<String, Object> hashmap_ = hashMaps.get(i);
                                    try {

                                        if (!allGadgets.contains(((DocumentReference)hashmap_.get("ref")).getId())) continue;

                                        hashMaps2.add(hashmap_);

                                    } catch (Exception e) {
                                        System.err.println(e);
                                    }


                            }

                            System.err.println(hashMaps2.size());
                            System.err.println(hashMaps.size());
                            //for (HashMap<String, Object> hashmap_ : hashMaps2) {
                            //    System.err.println("a2222a");
                            //}

                            //for (HashMap<String, Object> hashmap_ : hashMaps) {
                            //    System.err.println("aa");
                            //}

                            hashMaps = hashMaps2;

                            MainActivity.appUser.setGadgets(hashMaps);

                            userGadgetsDocRef = new ArrayList<>();
                            isCollected = new ArrayList<>();


                            if(hashMaps != null && !hashMaps.isEmpty())
                            {
                                TVNoContentInfo.setVisibility(View.GONE);
                                for(int i=0; i<hashMaps.size(); i++){
                                    if(! (Boolean) hashMaps.get(i).get("collected") ){
                                        userGadgetsDocRef.add( (DocumentReference) hashMaps.get(i).get("ref") );
                                        isCollected.add( (Boolean) hashMaps.get(i).get("collected") );
                                    }
                                }

                                for(int i=0; i<hashMaps.size(); i++){
                                    if( (Boolean) hashMaps.get(i).get("collected") ){
                                        userGadgetsDocRef.add( (DocumentReference) hashMaps.get(i).get("ref") );
                                        isCollected.add( (Boolean) hashMaps.get(i).get("collected") );
                                    }
                                }
                                loadTrophies(userGadgetsDocRef);

                            }else {
                                TVNoContentInfo.setVisibility(View.VISIBLE);
                            }


                        }
                    }
                });

        return view;
    }

    private void loadTrophies(ArrayList<DocumentReference> userTrophiesDocRef){

        gadgetsList = new ArrayList<>();
        gadgetId = new ArrayList<>();

        for(int i=0; i<userTrophiesDocRef.size(); i++)
        {
            userTrophiesDocRef.get(i).get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                @Override
                public void onSuccess(DocumentSnapshot documentSnapshot) {
                    Gadget gadget = documentSnapshot.toObject(Gadget.class);
                    //if (gadget != null) {
                        gadgetId.add(documentSnapshot.getId());
                        gadgetsList.add(gadget);

                    for(int i=0; i<hashMaps.size(); i++){
                        if(((DocumentReference) hashMaps.get(i).get("ref")).getId().equals(gadgetId.get(gadgetId.size()-1)))
                        {
                            isCollected.set(gadgetId.size()-1, (Boolean) hashMaps.get(i).get("collected"));
                        }
                    }
                    //}
                }
            }).addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(@NonNull Exception e) {
                    getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                }
            }).addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                @Override
                public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                    setRecycleViewContent();
                }
            });
        }
        setRecycleViewContent();
    }

    private void setRecycleViewContent(){

        if(gadgetsList.size() == userGadgetsDocRef.size()) {

            ArrayList<Gadget> gadgetsList2 = new ArrayList<>();
            ArrayList<Boolean> isCollected2 = new ArrayList<>();
            ArrayList<String> gadgetId2 = new ArrayList<>();

            for (int i = 0; i < isCollected.size(); ++i) {
                if (!isCollected.get(i)) {
                    gadgetsList2.add(gadgetsList.get(i));
                    isCollected2.add(isCollected.get(i));
                    gadgetId2.add(gadgetId.get(i));
                }
            }
            for (int i = 0; i < isCollected.size(); ++i) {
                if (isCollected.get(i)) {
                    gadgetsList2.add(gadgetsList.get(i));
                    isCollected2.add(isCollected.get(i));
                    gadgetId2.add(gadgetId.get(i));
                }
            }

            gadgetsList = gadgetsList2;
            isCollected = isCollected2;
            gadgetId = gadgetId2;


            fragment_profile_gadgets_adapter adapter = new fragment_profile_gadgets_adapter(this.getContext(), gadgetsList, isCollected, gadgetId);
            rv.setLayoutManager(new LinearLayoutManager(this.getContext()));
            rv.setAdapter(adapter);
        }
    }
}
