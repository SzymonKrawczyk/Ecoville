package com.example.ecoville_app_S;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.example.ecoville_app_S.model.Trophy;
import com.example.ecoville_app_S.model.User;
import com.example.ecoville_app_S.model.fragment_profile_new_trophie_adapter;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class fragment_profile_new_trophie extends Fragment {

    TextView TVFullName;
    TextView TVFullNameWithNoSpacesInBetween;
    TextView TVMemberSince;

    TextView TVNoContentInfo;

    Button BTProfileTrophies;
    Button BTProfileGadgets;
    Button BTProfileGames;

    RecyclerView rv;
    FirebaseFirestore db;

    ArrayList<DocumentReference> userTrophiesDocRef;
    ArrayList<Timestamp> trophiesTimestamp;
    ArrayList<Trophy>trophiesList;
    ArrayList<String>trophiesId;
    ArrayList<HashMap<String, Object>> hashMaps;

    int numberOfTrophies;

    public fragment_profile_new_trophie() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) { super.onCreate(savedInstanceState); }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        MainActivity.userDocRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                MainActivity.appUser = documentSnapshot.toObject(User.class);
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
            }
        });
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_profile_new_trophie, container, false);

        TVFullName = (TextView) view.findViewById(R.id.TVFullName);
        TVFullName.setText(MainActivity.appUser.getFirstName() + " " + MainActivity.appUser.getLastName());

        //TVFullNameWithNoSpacesInBetween = (TextView) view.findViewById(R.id.TVFullNameWithNoSpacesInBetween);
        //TVFullNameWithNoSpacesInBetween.setText("@" + MainActivity.appUser.getFirstName() + MainActivity.appUser.getLastName());

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

            Glide.with(fragment_profile_new_trophie.this /* context */)
                    .load(pathReference)
                    .into(IVProfile);
        }

        BTProfileTrophies.setTextColor(ContextCompat.getColor(getContext(), R.color.lightGreen));
        BTProfileGadgets.setTextColor(ContextCompat.getColor(getContext(), R.color.black));
        BTProfileGames.setTextColor(ContextCompat.getColor(getContext(), R.color.black));




        BTProfileGadgets.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_profile_gadgets()).addToBackStack(null).commit();
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

        hashMaps = MainActivity.appUser.getTrophies();

        userTrophiesDocRef = new ArrayList<>();
        trophiesTimestamp = new ArrayList<>();
        trophiesList = new ArrayList<>();


        ArrayList<HashMap<String, Object>> hashMaps2 = new ArrayList<>();
        ArrayList<String> allGadgets = new ArrayList<>();

        db.collection("trophy")
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

                                    if (!allGadgets.contains(((DocumentReference)hashmap_.get("trophy_id")).getId())) continue;

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

                            MainActivity.appUser.setTrophies(hashMaps);



                            if(hashMaps != null && !hashMaps.isEmpty())
                            {
                                TVNoContentInfo.setVisibility(View.GONE);
                                Collections.sort (hashMaps, new MapComparator("unlockDate"));

                                for(int i=0; i<hashMaps.size(); i++){
                                    userTrophiesDocRef.add( (DocumentReference) hashMaps.get(i).get("trophy_id") );
                                    trophiesTimestamp.add( (Timestamp) hashMaps.get(i).get("unlockDate") );
                                }
                                loadTrophies(userTrophiesDocRef);
                            }else{
                                TVNoContentInfo.setVisibility(View.VISIBLE);
                            }


                        }
                    }
                });





        return view;
    }

    public boolean isNew(Timestamp timestamp) {
        Date date = new Date();
        long time = date.getTime();
        return (time/1000 - timestamp.getSeconds()) < 60*60*24*7;
    }

    private void loadTrophies(ArrayList<DocumentReference> userTrophiesDocRef) {

        trophiesId = new ArrayList<>();
        numberOfTrophies = userTrophiesDocRef.size();

        for(int i=0; i<userTrophiesDocRef.size(); i++)
        {

            userTrophiesDocRef.get(i).get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                @Override
                public void onSuccess(DocumentSnapshot documentSnapshot) {
                    Trophy trophy = documentSnapshot.toObject(Trophy.class);
                    if( trophy != null ){
                        trophiesList.add(trophy);
                        trophiesId.add(documentSnapshot.getId());
                    }else {
                        numberOfTrophies--;
                    }
                    //trophiesList.add(trophy);
                    setRecycleViewContent();
                }
            }).addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(@NonNull Exception e) {
                    getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                }
            });
        }
    }

    private void setRecycleViewContent(){
        if(trophiesList.size() == numberOfTrophies){
            fragment_profile_new_trophie_adapter adapter = new fragment_profile_new_trophie_adapter(this.getContext(), trophiesList, trophiesTimestamp, trophiesId);
            rv.setLayoutManager(new LinearLayoutManager(this.getContext()));
            rv.setAdapter(adapter);
        }
    }

    class MapComparator implements Comparator<Map<String, Object>>
    {
        private final String key;

        public MapComparator(String key)
        {
            this.key = key;
        }

        public int compare(Map<String, Object> first,
                           Map<String, Object> second)
        {
            Timestamp firstValue = (Timestamp) first.get(key);
            Timestamp secondValue = (Timestamp) second.get(key);
            return secondValue.compareTo(firstValue);
        }
    }


}

