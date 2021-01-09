package com.example.ecoville_app_S;

import android.graphics.drawable.Drawable;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.GridLayout;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.ecoville_app_S.model.Tip;
import com.example.ecoville_app_S.model.Trophy;
import com.firebase.ui.firestore.FirestoreRecyclerAdapter;
import com.firebase.ui.firestore.FirestoreRecyclerOptions;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;

import com.example.ecoville_app_S.model.Trophy;


public class fragment_shop extends Fragment {


    public fragment_shop() {
        // Required empty public constructor}
        System.out.println("construktor empty ###################################################################");

    }

    @Override
    public void onCreate(Bundle savedInstanceState) { super.onCreate(savedInstanceState); }

    TextView TotalPoints;

    RecyclerView rv;
    FirebaseFirestore db;
    FirestoreRecyclerAdapter adapter;

    public static String trophyDocID = null;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        System.out.println("on create view 1 ###################################################################");


        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_shop, container, false);

        //TODO jak będzie użytkownik to dodać wczytywanie punktów
        TotalPoints = (TextView) view.findViewById(R.id.TVShopTotalPointsValue);

        db = FirebaseFirestore.getInstance();
        rv = (RecyclerView) view.findViewById(R.id.RVTrophy);

        System.out.println("on create view 2 ###################################################################");



        Query query = db.collection("trophy");


        FirestoreRecyclerOptions<Trophy> options = new FirestoreRecyclerOptions.Builder<Trophy>()
                .setQuery(query, Trophy.class).build();


        adapter = new FirestoreRecyclerAdapter<Trophy, TrophyViewHolder>(options) {


            @NonNull
            @Override
            public TrophyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

                View view = LayoutInflater.from(parent.getContext())
                        .inflate(R.layout.item_rv_trophy, parent, false);
                return new fragment_shop.TrophyViewHolder(view);
            }

            @Override
            protected void onBindViewHolder(@NonNull TrophyViewHolder holder, int position, @NonNull Trophy model) {


                holder.TVTrophyPointsValue.setText(String.valueOf(model.getCost()));
                //#TODO wczytać odpowiedni image
                String imageName = model.getImage().toLowerCase();
                //holder.IVTrophy.setImageResource(getResources().getIdentifier(imageName, "drawable", getActivity().getPackageName()));    //#TODO dodać pliki trophy.png
                holder.IVTrophy.setImageResource(R.drawable.menu_home_icon);


                holder.BTThropyInteraction.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        //#TODO dodać trophy do gracza i odjąć punkty od całości
                    }
                });
            }
        };


        System.out.println("on create view 3 ###################################################################");


        /*Query query = db.collection("tips").orderBy("added", Query.Direction.DESCENDING);

        FirestoreRecyclerOptions<Tip> options = new FirestoreRecyclerOptions.Builder<Tip>()
                .setQuery(query, Tip.class).build();

        System.out.println("on create view 4 ###################################################################");

        adapter = new FirestoreRecyclerAdapter<Tip, fragment_shop.TipViewHolder>(options) {


            @NonNull
            @Override
            public fragment_shop.TipViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

                System.out.println("onCreateViewHolder 1 ###################################################################");


                View view = LayoutInflater.from(parent.getContext())
                        .inflate(R.layout.item_rv_tip, parent, false);

                System.out.println("onCreateViewHolder 2 ###################################################################");

                return new fragment_shop.TipViewHolder(view);
            }

            @Override
            protected void onBindViewHolder(@NonNull fragment_shop.TipViewHolder holder, int position, @NonNull Tip model) {

                System.out.println("onBindViewHolder 1 ###################################################################");

                holder.TVTipsTitle.setText(model.getTitle().toUpperCase());
                holder.TVTipsDate.setText(model._getDate());
                holder.TVTipsShort.setText(model.getShortDescription());

                System.out.println("onBindViewHolder 2 ###################################################################");

                holder.BTTipsReadFull.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        DocumentSnapshot snapshot = options.getSnapshots().getSnapshot(position);
                        trophyDocID = snapshot.getId();
                        getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_tip_details()).addToBackStack(null).commit();
                    }
                });
            }
        };*/


        System.out.println("###################################################################"+String.valueOf(adapter.getItemCount()));

        GridLayoutManager gridLayoutManager = new GridLayoutManager(this.getContext(), 2, GridLayoutManager.VERTICAL, false);   //getActivity();
        rv.setLayoutManager(gridLayoutManager);
        rv.setAdapter(adapter);

        return view;
    }


    public class TipViewHolder extends RecyclerView.ViewHolder {

        TextView TVTipsTitle;
        TextView TVTipsDate;
        TextView TVTipsShort;
        Button BTTipsReadFull;

        public TipViewHolder(@NonNull View itemView) {
            super(itemView);


            TVTipsTitle  = (TextView) itemView.findViewById(R.id.TVTipsTitle);
            TVTipsDate = (TextView) itemView.findViewById(R.id.TVTipsDate);
            TVTipsShort = (TextView) itemView.findViewById(R.id.TVTipsShort);
            BTTipsReadFull = (Button) itemView.findViewById(R.id.BTTipsReadFull);
        }

    }


    public class TrophyViewHolder extends RecyclerView.ViewHolder {

        TextView TVTrophyPointsValue;
        ImageView IVTrophy;
        Button BTThropyInteraction;

        public TrophyViewHolder(@NonNull View itemView) {
            super(itemView);

            TVTrophyPointsValue  = (TextView) itemView.findViewById(R.id.TVTrophyPointsValue);
            IVTrophy = (ImageView) itemView.findViewById(R.id.IVTrophy);
            BTThropyInteraction = (Button) itemView.findViewById(R.id.BTThropyInteraction);
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