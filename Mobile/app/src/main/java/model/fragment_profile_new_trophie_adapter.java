package com.example.bottomnavigationview.model;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.bottomnavigationview.R;
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class fragment_profile_new_trophie_adapter extends RecyclerView.Adapter<fragment_profile_new_trophie_adapter.Trophies> {

    ArrayList<Trophy> trophiesList;
    ArrayList<Timestamp> trophiesTimestamp;
    ArrayList<DocumentReference> decRef;
    Context context;

    public fragment_profile_new_trophie_adapter(Context context, ArrayList<Trophy> trophiesList, ArrayList<Timestamp> trophiesTimestamp, ArrayList<DocumentReference> docRef){
        this.context = context;
        this.trophiesList = trophiesList;
        this.trophiesTimestamp = trophiesTimestamp;
        this.decRef = docRef;
    }


    @NonNull
    @Override
    public fragment_profile_new_trophie_adapter.Trophies onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.item_rv_trophy_rich, parent, false);

        return new fragment_profile_new_trophie_adapter.Trophies(view);
    }

    @Override
    public void onBindViewHolder(@NonNull fragment_profile_new_trophie_adapter.Trophies holder, int position) {

        if( trophiesList.get(position) != null){

            String imageName = trophiesList.get(position).getImage();

            holder.IVTrophyMinimalistic.setImageResource(context.getResources().getIdentifier(imageName, "drawable", context.getPackageName()));

            FirebaseStorage storage = FirebaseStorage.getInstance();
            // Create a storage reference from our app
            StorageReference storageRef = storage.getReference();

            // Create a reference with an initial file path and name
            StorageReference pathReference = storageRef.child("trophies/" + decRef.get(position).getId());

            Glide.with(context /* context */)
                    .load(pathReference)
                    .into(holder.IVTrophyMinimalistic);


            holder.TVTrophyTitle.setText(trophiesList.get(position).getName());
            holder.TVTrophyDescription.setText(trophiesList.get(position).getDescription());
            if( isNew(trophiesTimestamp.get(position)) ){
                holder.TVTrophyMinimalistic.setVisibility(View.VISIBLE);
            } else {
                holder.TVTrophyMinimalistic.setVisibility(View.INVISIBLE);
            }
            SimpleDateFormat sfd = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            holder.TVTrophyTimestamp.setText(sfd.format(trophiesTimestamp.get(position).toDate()));
        }
    }

    @Override
    public int getItemCount() {
        //if( trophiesList == null ) return 0;
        return trophiesList.size();
    }

    public class Trophies extends RecyclerView.ViewHolder {

        TextView TVTrophyMinimalistic;
        TextView TVTrophyTitle;
        TextView TVTrophyDescription;
        TextView TVTrophyTimestamp;
        ImageView IVTrophyMinimalistic;

        public Trophies(@NonNull View itemView) {
            super(itemView);

            TVTrophyMinimalistic  = (TextView) itemView.findViewById(R.id.TVTrophyMinimalistic);
            TVTrophyTitle = (TextView) itemView.findViewById(R.id.TVTrophyTitle);
            TVTrophyDescription = (TextView) itemView.findViewById(R.id.TVTrophyDescription);
            TVTrophyTimestamp = (TextView) itemView.findViewById(R.id.TVTrophyTimestamp);
            IVTrophyMinimalistic = (ImageView) itemView.findViewById(R.id.IVTrophyMinimalistic);
        }
    }

    public boolean isNew(Timestamp timestamp) {

        Date date = new Date();
        long time = date.getTime();
        return (time/1000 - timestamp.getSeconds()) < 60*60*24*7;
    }

}
