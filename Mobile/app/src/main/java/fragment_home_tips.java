package com.example.bottomnavigationview;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.firebase.ui.firestore.FirestoreRecyclerAdapter;
import com.firebase.ui.firestore.FirestoreRecyclerOptions;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;

import com.example.bottomnavigationview.model.Tip;

public class fragment_home_tips extends Fragment {


    public fragment_home_tips() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }


    private Button BTHomeMissions;
    private Button BTHomeTalk;


    RecyclerView rv;
    FirebaseFirestore db;
    FirestoreRecyclerAdapter adapter;

    public static String tipDocID = null;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_home_tips, container, false);

        BTHomeMissions = (Button) view.findViewById(R.id.BTHomeMissions);
        BTHomeTalk = (Button) view.findViewById(R.id.BTHomeTalk);

        BTHomeMissions.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_missions()).addToBackStack(null).commit();
            }
        });
        BTHomeTalk.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_talk()).addToBackStack(null).commit();
            }
        });
        /*BTTipsReadFull1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_tip_details()).addToBackStack(null).commit();
            }
        });*/


        db = FirebaseFirestore.getInstance();
        rv = (RecyclerView) view.findViewById(R.id.RVTips);

        Query query = db.collection("tips").orderBy("added", Query.Direction.DESCENDING);



        FirestoreRecyclerOptions<Tip> options = new FirestoreRecyclerOptions.Builder<Tip>()
                .setQuery(query, Tip.class).build();

        adapter = new FirestoreRecyclerAdapter<Tip, TipViewHolder>(options) {

            @NonNull
            @Override
            public TipViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

                View view = LayoutInflater.from(parent.getContext())
                        .inflate(R.layout.item_rv_tip, parent, false);
                return new TipViewHolder(view);
            }

            @Override
            protected void onBindViewHolder(@NonNull TipViewHolder holder, int position, @NonNull Tip model) {

                holder.TVTipsTitle.setText(model.getTitle().toUpperCase());
                holder.TVTipsDate.setText(model._getDate());
                holder.TVTipsShort.setText(model.getShortDescription());

                DocumentSnapshot snapshot = options.getSnapshots().getSnapshot(position);
                String tipDocIDTEMP = snapshot.getId();

                holder.BTTipsReadFull.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        //DocumentSnapshot snapshot = options.getSnapshots().getSnapshot(position);
                        tipDocID = tipDocIDTEMP;
                        getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_tip_details()).addToBackStack(null).commit();
                    }
                });
            }
        };

        rv.setLayoutManager(new LinearLayoutManager(this.getContext()));
        /*rv.setHasFixedSize(true);*/
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