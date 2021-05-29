package com.example.bottomnavigationview;

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
import com.example.bottomnavigationview.model.Gadget;
import com.example.bottomnavigationview.model.Trophy;
import com.example.bottomnavigationview.model.fragment_profile_gadgets_adapter;
import com.example.bottomnavigationview.model.fragment_profile_new_trophie_adapter;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

public class fragment_profile_gadgets extends Fragment {

    TextView TVFullName;
    TextView TVMemberSince;

    Button BTProfileTrophies;
    Button BTProfileGadgets;
    Button BTProfileGames;

    RecyclerView rv;
    FirebaseFirestore db;

    ArrayList<DocumentReference> userGadgetsDocRef;
    ArrayList<Gadget> gadgetsList;
    ArrayList<Boolean> isCollected;

    int numberOfGadgets;

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

        ArrayList<HashMap<String, Object>> hashMaps = new ArrayList<>();
        hashMaps = MainActivity.appUser.getGadgets();

        userGadgetsDocRef = new ArrayList<>();
        isCollected = new ArrayList<>();

        if(hashMaps != null)
        {
            for(int i=0; i<hashMaps.size(); i++){
                userGadgetsDocRef.add( (DocumentReference) hashMaps.get(i).get("ref") );
                isCollected.add( (Boolean) hashMaps.get(i).get("collected") );
            }
        }

        loadTrophies(userGadgetsDocRef);

        return view;
    }

    private void loadTrophies(ArrayList<DocumentReference> userTrophiesDocRef) {

        gadgetsList = new ArrayList<>();

        for(int i=0; i<userTrophiesDocRef.size(); i++)
        {
            userTrophiesDocRef.get(i).get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                @Override
                public void onSuccess(DocumentSnapshot documentSnapshot) {
                    Gadget gadget = documentSnapshot.toObject(Gadget.class);
                    if( gadget != null ){
                        gadgetsList.add(gadget);
                    }
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
    }

    private void setRecycleViewContent(){
        fragment_profile_gadgets_adapter adapter = new fragment_profile_gadgets_adapter(this.getContext(), gadgetsList, isCollected);
        rv.setLayoutManager(new LinearLayoutManager(this.getContext()));
        rv.setAdapter(adapter);
    }
}
