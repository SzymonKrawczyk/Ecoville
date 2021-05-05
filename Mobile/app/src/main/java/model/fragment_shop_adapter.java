package com.example.bottomnavigationview.model;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
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
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.bottomnavigationview.LogIn;
import com.example.bottomnavigationview.MainActivity;
import com.example.bottomnavigationview.R;
import com.example.bottomnavigationview.UserBannedErrorActivity;
import com.example.bottomnavigationview.fragment_connection_error;
import com.example.bottomnavigationview.fragment_home_tips;
import com.example.bottomnavigationview.fragment_shop;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

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

                holder.BTTrophyInteraction.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        //MainActivity.appUser.setCurrentPoints( MainActivity.appUser.getCurrentPoints() - costFinal );

                        showPopUp(t, docRefArray.get(position).getId());

//                            docRefArray.get(position).getId();
//                            buyATrophy( docRefArray.get(position).getId(), costFinal);
//                            fragmentActivity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_shop()).addToBackStack(null).commit();
                    }
                });

                if( MainActivity.appUser.getCurrentPoints() < trophy.getCost()  ){
                    holder.CLTrophyBackground.setBackgroundResource(R.drawable.round_corners_button_darkgray);
                }else {
//                    holder.BTTrophyInteraction.setOnClickListener(new View.OnClickListener() {
//                        @Override
//                        public void onClick(View view) {
//                            //MainActivity.appUser.setCurrentPoints( MainActivity.appUser.getCurrentPoints() - costFinal );
//
//                            showPopUp(t);
//
////                            docRefArray.get(position).getId();
////                            buyATrophy( docRefArray.get(position).getId(), costFinal);
////                            fragmentActivity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_shop()).addToBackStack(null).commit();
//                        }
//                    });
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

    public void  showPopUp(Trophy t, String Id){

        //Dialog dialog = new Dialog(context);
        //dialog.setContentView(R.layout.shop_popup);

        System.out.println(t.getName() + " : " + Id);

        AlertDialog.Builder dialogBuilder;
        AlertDialog dialog;

        dialogBuilder = new AlertDialog.Builder(context);
        LayoutInflater inflater = LayoutInflater.from(context);
        View contactPopupView = inflater.inflate(R.layout.shop_popup, null, false);

        TextView TVTrophyMinimalistic;
        TextView TVTrophyTitle;
        TextView TVTrophyDescription;
        TextView TVTrophyPointsValue;

        ImageView IVTrophyMinimalistic;

        Button BTShopBuy;
        Button BTShopNotBuy;

        TVTrophyTitle = (TextView) contactPopupView.findViewById(R.id.TVTrophyTitle);
        TVTrophyDescription = (TextView) contactPopupView.findViewById(R.id.TVTrophyDescription);
        TVTrophyPointsValue = (TextView) contactPopupView.findViewById(R.id.TVTrophyPointsValue);
        IVTrophyMinimalistic = (ImageView) contactPopupView.findViewById(R.id.IVTrophyMinimalistic);
        BTShopBuy = (Button) contactPopupView.findViewById(R.id.BTShopBuy);
        BTShopNotBuy = (Button) contactPopupView.findViewById(R.id.BTShopNotBuy);


        TVTrophyTitle.setText(t.getName());
        TVTrophyDescription.setText(t.getDescription());
        TVTrophyPointsValue.setText(String.valueOf(t.getCost()));
        String imageName = t.getImage();
        IVTrophyMinimalistic.setImageResource(context.getResources().getIdentifier(imageName, "drawable", context.getPackageName()));

        dialogBuilder.setView(contactPopupView);
        dialog = dialogBuilder.create();

        if( MainActivity.appUser.getCurrentPoints() < t.getCost()  ){
            contactPopupView.findViewById(R.id.CLShopPopUpBuy).setBackgroundResource(R.drawable.round_corners_button_darkgray);
        }else {

            BTShopBuy.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                    if(MainActivity.appUser._isUserBanned()){
                        dialog.dismiss();
                        Intent intent = new Intent(context.getApplicationContext(), UserBannedErrorActivity.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        context.startActivity(intent);
                    }else{
                        buyATrophy( Id, t.getCost());
                        fragmentActivity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_shop()).addToBackStack(null).commit();
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
                        if( MainActivity.appUser.getCurrentPoints() >= cost  && documentSnapshotT.toObject(Trophy.class) != null){
                            MainActivity.appUser.setCurrentPoints( MainActivity.appUser.getCurrentPoints() - cost );
                            DocumentReference docRef = db.collection("trophy").document(trophyId);
                            MainActivity.appUser._addTrophy(docRef, db);

                            fragment_shop.TotalPoints.setText(String.valueOf(MainActivity.appUser.getCurrentPoints()));
                            fragmentActivity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_shop()).addToBackStack(null).commit();
                            Toast.makeText(fragmentActivity, "You have successfully purchased a trophy", Toast.LENGTH_LONG).show();
                        }else{
                            fragment_shop.TotalPoints.setText(String.valueOf(MainActivity.appUser.getCurrentPoints()));
                            Toast.makeText(fragmentActivity, "Error, try again.", Toast.LENGTH_LONG).show();
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
