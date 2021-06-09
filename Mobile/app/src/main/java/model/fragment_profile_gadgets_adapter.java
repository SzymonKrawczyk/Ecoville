package com.example.ecoville_app_S.model;

import android.content.Context;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.ecoville_app_S.R;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.ArrayList;

public class fragment_profile_gadgets_adapter extends RecyclerView.Adapter<fragment_profile_gadgets_adapter.ViewHolder> {

    ArrayList<Gadget> gadgetsList;
    ArrayList<Boolean> isGadgetCollected;
    ArrayList<String> gadgetId;
    Context context;

    public fragment_profile_gadgets_adapter(Context context,  ArrayList<Gadget> gadgetsList, ArrayList<Boolean> isGadgetCollected, ArrayList<String> gadgetId){
        this.context = context;
        this.gadgetsList = gadgetsList;
        this.isGadgetCollected = isGadgetCollected;
        this.gadgetId = gadgetId;
    }


    @NonNull
    @Override
    public fragment_profile_gadgets_adapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.item_rv_gadget_rich, parent, false);

        return new fragment_profile_gadgets_adapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull fragment_profile_gadgets_adapter.ViewHolder holder, int position) {

        if( gadgetsList.get(position) != null && gadgetId.get(position) != null){

            int gadget_position = position;
            String Id = gadgetId.get(position);
            Gadget g = new Gadget(gadgetsList.get(position));

            System.out.println("pozycja: " + gadget_position + ", " + g.getName() + ": " + Id);

            FirebaseStorage storage = FirebaseStorage.getInstance();
            // Create a storage reference from our app
            StorageReference storageRef = storage.getReference();

            // Create a reference with an initial file path and name
            StorageReference pathReference = storageRef.child("gadgets/" + Id);

            pathReference.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                @Override
                public void onSuccess(Uri uri) {
                    Glide.with(context /* context */)
                            .load(pathReference)
                            .into(holder.IVGadgetRich);
                }
            }).addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(@NonNull Exception e) {
                    holder.IVGadgetRich.setImageResource(context.getResources().getIdentifier("trophy_4", "drawable", context.getPackageName()));
                }
            });

            holder.TVGadgetName.setText(gadgetsList.get(gadget_position).getName());

            if(!isGadgetCollected.get(gadget_position)){
                holder.TVGadgetInfo.setText("To pick up the gadget, go to the collection point");
                holder.CLGadgetItem.setBackgroundResource(R.drawable.round_corners_left_green_bg);
                holder.CLGadgetItem.setVisibility(View.VISIBLE);
            }else{
                holder.TVGadgetInfo.setText("You have already picked up this gadget");
                holder.CLGadgetItem.setBackgroundResource(R.drawable.round_corners_left_darkgray_bg);
                holder.CLGadgetItem.setVisibility(View.VISIBLE);
            }
        }
    }

    @Override
    public int getItemCount() {
        //if( trophiesList == null ) return 0;
        return gadgetsList.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {

        TextView TVGadgetName;
        TextView TVGadgetInfo;
        ImageView IVGadgetRich;
        ConstraintLayout CLGadgetItem;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            TVGadgetName = (TextView) itemView.findViewById(R.id.TVGadgetName);
            TVGadgetInfo = (TextView) itemView.findViewById(R.id.TVGadgetInfo);
            IVGadgetRich = (ImageView) itemView.findViewById(R.id.IVGadgetRich);
            CLGadgetItem = (ConstraintLayout) itemView.findViewById(R.id.CLGadgetItem);
        }
    }
}
