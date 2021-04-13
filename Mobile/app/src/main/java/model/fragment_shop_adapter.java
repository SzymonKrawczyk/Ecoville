package com.example.ecoville_app_S.model;

import android.content.Context;
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

import com.example.ecoville_app_S.LogIn;
import com.example.ecoville_app_S.MainActivity;
import com.example.ecoville_app_S.R;
import com.example.ecoville_app_S.fragment_connection_error;
import com.example.ecoville_app_S.fragment_home_tips;
import com.example.ecoville_app_S.fragment_shop;
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

                if( MainActivity.appUser.getCurrentPoints() < trophy.getCost()  ){
                    holder.CLTrophyBackground.setBackgroundResource(R.drawable.round_corners_button_darkgray);
                }else {
                    holder.BTTrophyInteraction.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            //MainActivity.appUser.setCurrentPoints( MainActivity.appUser.getCurrentPoints() - costFinal );
                            docRefArray.get(position).getId();
                            buyATrophy( docRefArray.get(position).getId(), costFinal);
                            fragmentActivity.getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_shop()).addToBackStack(null).commit();
                        }
                    });
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
