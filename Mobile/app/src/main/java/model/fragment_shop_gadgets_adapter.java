package com.example.bottomnavigationview.model;

import android.app.AlertDialog;
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
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.bottomnavigationview.MainActivity;
import com.example.bottomnavigationview.R;
import com.example.bottomnavigationview.UserBannedErrorActivity;
import com.example.bottomnavigationview.fragment_connection_error;
import com.example.bottomnavigationview.fragment_shop;
import com.example.bottomnavigationview.fragment_shop_gadgets;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.ArrayList;

public class fragment_shop_gadgets_adapter extends RecyclerView.Adapter<fragment_shop_gadgets_adapter.ViewHolder> {


    ArrayList<DocumentReference> docRefArray;
    Context context;
    FragmentActivity fragmentActivity;
    int totalPoints;
    Gadget gadget;

    public fragment_shop_gadgets_adapter(Context context, FragmentActivity fragmentActivity,  ArrayList<DocumentReference> docRefArray, int totalPoints){
        this.context = context;
        this.docRefArray = docRefArray;
        this.totalPoints = totalPoints;
        this.fragmentActivity = fragmentActivity;
    }


    @NonNull
    @Override
    public fragment_shop_gadgets_adapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.item_rv_gadget, parent, false);

        return new fragment_shop_gadgets_adapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull fragment_shop_gadgets_adapter.ViewHolder holder, int position) {

        docRefArray.get(position).get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                gadget = documentSnapshot.toObject(Gadget.class);

                holder.TVGadgetPointsValue.setText(String.valueOf(gadget.getCost()));

                Gadget g = new Gadget(gadget);

                if (gadget.getPic() != null) {
                    FirebaseStorage storage = FirebaseStorage.getInstance();
                    // Create a storage reference from our app
                    StorageReference storageRef = storage.getReference();

                    // Create a reference with an initial file path and name
                    StorageReference pathReference = storageRef.child("gadgets/" + gadget.getPic());

                    Glide.with(context /* context */)
                            .load(pathReference)
                            .into(holder.IVGadget);

                    holder.BTGadgetInteraction.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            showPopUp(g, docRefArray.get(position).getId(), pathReference);
                        }
                    });
                }else{
                    holder.BTGadgetInteraction.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            showPopUp(g, docRefArray.get(position).getId(), null);
                        }
                    });
                }


                if( MainActivity.appUser.getCurrentPoints() < gadget.getCost()  ){
                    holder.CLGadgetBackground.setBackgroundResource(R.drawable.round_corners_button_darkgray);
                }

                if( gadget.getAmount() < 1 ){
                    holder.BTGadgetInteraction.setText("OUT OF STOCK");
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        if( docRefArray == null ) return 0;
        return docRefArray.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {

        TextView TVGadgetPointsValue;
        ImageView IVGadget;
        Button BTGadgetInteraction;
        ConstraintLayout CLGadgetBackground;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            TVGadgetPointsValue  = (TextView) itemView.findViewById(R.id.TVGadgetPointsValue);
            IVGadget = (ImageView) itemView.findViewById(R.id.IVGadget);
            BTGadgetInteraction = (Button) itemView.findViewById(R.id.BTGadgetInteraction);
            CLGadgetBackground = (ConstraintLayout) itemView.findViewById(R.id.CLGadgetBackground);
        }
    }


    public void  showPopUp(Gadget g, String Id, StorageReference sr){

        //Dialog dialog = new Dialog(context);
        //dialog.setContentView(R.layout.shop_popup);

        System.out.println(g.getName() + " : " + Id);

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


        TVTrophyTitle.setText(g.getName());
        TVTrophyDescription.setText("Left: " + g.getAmount());
        TVTrophyPointsValue.setText(String.valueOf(g.getCost()));

        if(sr != null){
            Glide.with(context /* context */)
                    .load(sr)
                    .into(IVTrophyMinimalistic);
        }

        dialogBuilder.setView(contactPopupView);
        dialog = dialogBuilder.create();

        if( MainActivity.appUser.getCurrentPoints() < g.getCost() || g.getAmount() < 1 ){
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
                        buyAGadget( Id, g);
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


    private void buyAGadget(String gadgetId, Gadget g){
        FirebaseFirestore db;
        db = FirebaseFirestore.getInstance();
        MainActivity.userDocRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {

                db.collection("gadget").document(gadgetId).get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                    @Override
                    public void onSuccess(DocumentSnapshot documentSnapshotT) {

                        MainActivity.appUser = documentSnapshot.toObject(User.class);
                        if( MainActivity.appUser.getCurrentPoints() >= g.getCost()  && documentSnapshotT.toObject(Gadget.class) != null){
                            MainActivity.appUser.setCurrentPoints( MainActivity.appUser.getCurrentPoints() - g.getCost() );
                            DocumentReference docRef = db.collection("gadget").document(gadgetId);

                            MainActivity.appUser._addGadget(docRef, db);
                            g._buyGadget(gadgetId, db);

                            fragmentActivity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_shop_gadgets()).addToBackStack(null).commit();
                            Toast.makeText(fragmentActivity, "You have successfully purchased a gadget", Toast.LENGTH_LONG).show();
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
