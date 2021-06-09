package com.example.ecoville_app_S.model;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.FragmentActivity;
import androidx.recyclerview.widget.RecyclerView;

import com.example.ecoville_app_S.MainActivity;
import com.example.ecoville_app_S.R;
import com.example.ecoville_app_S.fragment_shop;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.ArrayList;
import java.util.Date;

public class fragment_profile_all_trophies_adapter extends RecyclerView.Adapter<fragment_profile_all_trophies_adapter.Trophies> {


    ArrayList<Trophy> trophiesList;
    ArrayList<Timestamp> trophiesTimestamp;
    Context context;

    public fragment_profile_all_trophies_adapter(Context context,  ArrayList<Trophy> trophiesList,  ArrayList<Timestamp> trophiesTimestamp){
        this.context = context;
        this.trophiesList = trophiesList;
        this.trophiesTimestamp = trophiesTimestamp;
    }


    @NonNull
    @Override
    public fragment_profile_all_trophies_adapter.Trophies onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.item_rv_trophy_minimalistic, parent, false);

        return new fragment_profile_all_trophies_adapter.Trophies(view);
    }

    @Override
    public void onBindViewHolder(@NonNull fragment_profile_all_trophies_adapter.Trophies holder, int position) {

        if(trophiesList.get(position) != null){
            String imageName = trophiesList.get(position).getImage();
            holder.IVTrophyMinimalistic.setImageResource(context.getResources().getIdentifier(imageName, "drawable", context.getPackageName()));

            if( isNew(trophiesTimestamp.get(position)) ){
                holder.TVTrophyMinimalistic.setVisibility(View.VISIBLE);
            } else {
                holder.TVTrophyMinimalistic.setVisibility(View.INVISIBLE);
            }
        }
    }

    @Override
    public int getItemCount() {
        //if( trophiesList == null ) return 0;
        return trophiesList.size();
    }

    public class Trophies extends RecyclerView.ViewHolder {

        TextView TVTrophyMinimalistic;
        ImageView IVTrophyMinimalistic;

        public Trophies(@NonNull View itemView) {
            super(itemView);

            TVTrophyMinimalistic  = (TextView) itemView.findViewById(R.id.TVTrophyMinimalistic);
            IVTrophyMinimalistic = (ImageView) itemView.findViewById(R.id.IVTrophyMinimalistic);
        }
    }

    public boolean isNew(Timestamp timestamp) {

        Date date = new Date();
        long time = date.getTime();
        return (time/1000 - timestamp.getSeconds()) < 60*60*24*7;
    }
}
