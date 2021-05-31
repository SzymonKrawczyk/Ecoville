package com.example.bottomnavigationview.model;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.widget.LinearLayoutCompat;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.bottomnavigationview.MainActivity;
import com.example.bottomnavigationview.R;
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class fragment_profile_gadgets_adapter extends RecyclerView.Adapter<fragment_profile_gadgets_adapter.ViewHolder> {

    ArrayList<Gadget> gadgetsList;
    ArrayList<Boolean> isGadgetCollected;
    ArrayList<DocumentReference> decRef;
    Context context;

    public fragment_profile_gadgets_adapter(Context context,  ArrayList<Gadget> gadgetsList, ArrayList<Boolean> isGadgetCollected, ArrayList<DocumentReference> docRef){
        this.context = context;
        this.gadgetsList = gadgetsList;
        this.isGadgetCollected = isGadgetCollected;
        this.decRef = docRef;
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

        if( gadgetsList.get(position) != null){

            Gadget g = new Gadget(gadgetsList.get(position));

            FirebaseStorage storage = FirebaseStorage.getInstance();
            // Create a storage reference from our app
            StorageReference storageRef = storage.getReference();

            // Create a reference with an initial file path and name
            StorageReference pathReference = storageRef.child("gadgets/" + decRef.get(position).getId());

            Glide.with(context /* context */)
                    .load(pathReference)
                    .into(holder.IVGadgetRich);


            holder.TVGadgetName.setText(gadgetsList.get(position).getName());

            if(!isGadgetCollected.get(position)){
                holder.TVGadgetInfo.setText("To pick up the gadget, go to the collection point");
                holder.CLGadgetItem.setBackgroundResource(R.drawable.round_corners_left_green_bg);
                holder.CLGadgetItem.setVisibility(View.VISIBLE);
            }else{
                holder.TVGadgetInfo.setText("You already picked up this gadget");
                holder.CLGadgetItem.setVisibility(View.INVISIBLE);
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
