package com.example.ecoville_app_S.model;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.FragmentActivity;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.ecoville_app_S.MainActivity;
import com.example.ecoville_app_S.R;
import com.example.ecoville_app_S.UserBannedErrorActivity;
import com.example.ecoville_app_S.fragment_connection_error;
import com.example.ecoville_app_S.fragment_shop;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.ArrayList;

public class fragment_shop_adapter extends RecyclerView.Adapter<fragment_shop_adapter.ShopViewHolder> {

    ArrayList<DocumentReference> docRefArray;
    Context context;
    FragmentActivity fragmentActivity;
    int totalPoints;
    Trophy trophy;

    public fragment_shop_adapter(Context context, FragmentActivity fragmentActivity,  ArrayList<DocumentReference> docRefArray, int totalPoints){
        this.context = context;
        this.docRefArray = docRefArray;
        this.totalPoints = totalPoints;
        this.fragmentActivity = fragmentActivity;
    }


    @NonNull
    @Override
    public fragment_shop_adapter.ShopViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.item_rv_trophy, parent, false);

        return new ShopViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull fragment_shop_adapter.ShopViewHolder holder, int position) {

        docRefArray.get(position).get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                trophy = documentSnapshot.toObject(Trophy.class);

                holder.TVTrophyPointsValue.setText(String.valueOf(trophy.getCost()));
                String imageName = trophy.getImage();
                holder.IVTrophy.setImageResource(context.getResources().getIdentifier(imageName, "drawable", context.getPackageName()));

                final int costFinal = trophy.getCost();

                Trophy t = new Trophy(trophy);

                FirebaseStorage storage = FirebaseStorage.getInstance();
                // Create a storage reference from our app
                StorageReference storageRef = storage.getReference();

                // Create a reference with an initial file path and name
                StorageReference pathReference = storageRef.child("trophies/" + documentSnapshot.getId());

                System.out.println("path ref w store trophy: " + pathReference);


                try{
                    Glide.with(context /* context */)
                            .load(pathReference)
                            .into(holder.IVTrophy);

                }catch (Exception e){
                    System.err.println("###################################################################");
                }

                holder.BTTrophyInteraction.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        //MainActivity.appUser.setCurrentPoints( MainActivity.appUser.getCurrentPoints() - costFinal );

                        showPopUp(t, docRefArray.get(position).getId(), pathReference);
                    }
                });

                if( MainActivity.appUser.getCurrentPoints() < trophy.getCost()  ){
                    holder.CLTrophyBackground.setBackgroundResource(R.drawable.round_corners_button_darkgray);
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        if( docRefArray == null ) return 0;
        return docRefArray.size();
    }

    public class ShopViewHolder extends RecyclerView.ViewHolder {

        TextView TVTrophyPointsValue;
        ImageView IVTrophy;
        Button BTTrophyInteraction;
        ConstraintLayout CLTrophyBackground;

        public ShopViewHolder(@NonNull View itemView) {
            super(itemView);

            TVTrophyPointsValue  = (TextView) itemView.findViewById(R.id.TVTrophyPointsValue);
            IVTrophy = (ImageView) itemView.findViewById(R.id.IVTrophy);
            BTTrophyInteraction = (Button) itemView.findViewById(R.id.BTTrophyInteraction);
            CLTrophyBackground = (ConstraintLayout) itemView.findViewById(R.id.CLTrophyBackground);
        }
    }

    public void showPopUp(Trophy t, String Id, StorageReference sr){

        Dialog dialog = new Dialog(context);

        dialog.setContentView(R.layout.shop_popup_2);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

        TextView TVTrophyMinimalistic;
        TextView TVTrophyTitle;
        TextView TVTrophyDescription;
        TextView TVTrophyPointsValue;

        ImageView IVTrophyMinimalistic;

        Button BTShopBuy;
        Button BTShopNotBuy;

        TVTrophyTitle = (TextView) dialog.findViewById(R.id.TVTrophyTitle);
        TVTrophyDescription = (TextView) dialog.findViewById(R.id.TVTrophyDescription);
        TVTrophyPointsValue = (TextView) dialog.findViewById(R.id.TVTrophyPointsValue);
        IVTrophyMinimalistic = (ImageView) dialog.findViewById(R.id.IVTrophyMinimalistic);
        BTShopBuy = (Button) dialog.findViewById(R.id.BTShopBuy);
        BTShopNotBuy = (Button) dialog.findViewById(R.id.BTShopNotBuy);


        TVTrophyTitle.setText(t.getName());
        TVTrophyDescription.setText(t.getDescription());
        TVTrophyPointsValue.setText(String.valueOf(t.getCost()));

        try{
            Glide.with(context /* context */)
                    .load(sr)
                    .into(IVTrophyMinimalistic);
        }catch (Exception e){
            System.err.println("###################################################################");
        }

        if( MainActivity.appUser.getCurrentPoints() < t.getCost()  ){
            dialog.findViewById(R.id.CLShopPopUpBuy).setBackgroundResource(R.drawable.round_corners_button_darkgray);
        }else {

            BTShopBuy.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(MainActivity.appUser == null || MainActivity.appUser._isUserBanned()){
                        dialog.dismiss();
                        Intent intent = new Intent(context.getApplicationContext(), UserBannedErrorActivity.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        context.startActivity(intent);
                    }else{
                        buyATrophy( Id, t.getCost());
                        //fragmentActivity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_shop()).addToBackStack(null).commit();
                        dialog.dismiss();
                    }
                }
            });
        }

        BTShopNotBuy.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });

        dialog.show();
    }


    public void buyATrophy(String trophyId, int cost){
        FirebaseFirestore db;
        db = FirebaseFirestore.getInstance();
        MainActivity.userDocRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {

                db.collection("trophy").document(trophyId).get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                    @Override
                    public void onSuccess(DocumentSnapshot documentSnapshotT) {

                        MainActivity.appUser = documentSnapshot.toObject(User.class);

                        if(MainActivity.appUser == null || MainActivity.appUser._isUserBanned()){
                            Intent intent = new Intent(context.getApplicationContext(), UserBannedErrorActivity.class);
                            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                            context.startActivity(intent);
                        }else {
                            if( MainActivity.appUser.getCurrentPoints() >= cost  && documentSnapshotT.toObject(Trophy.class) != null){
                                MainActivity.appUser.setCurrentPoints( MainActivity.appUser.getCurrentPoints() - cost );
                                DocumentReference docRef = db.collection("trophy").document(trophyId);
                                if(!MainActivity.appUser._addTrophy(docRef, db)){
                                    fragmentActivity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                                }else{
                                    fragment_shop.TotalPoints.setText(String.valueOf(MainActivity.appUser.getCurrentPoints()));
                                    fragmentActivity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_shop()).addToBackStack(null).commit();
                                    Toast.makeText(fragmentActivity, "Thank you for your purchase", Toast.LENGTH_LONG).show();
                                }
                            }else{
                                //fragment_shop.TotalPoints.setText(String.valueOf(MainActivity.appUser.getCurrentPoints()));
                                //Toast.makeText(fragmentActivity, "Error, try again.", Toast.LENGTH_LONG).show();
                                fragmentActivity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                            }
                        }
                    }
                }).addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        fragmentActivity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                    }
                });
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                fragmentActivity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
            }
        });
    }
}
