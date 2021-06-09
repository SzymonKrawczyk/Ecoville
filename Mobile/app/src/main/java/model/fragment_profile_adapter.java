package com.example.ecoville_app_S.model;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.ecoville_app_S.MainActivity;
import com.example.ecoville_app_S.R;
import com.example.ecoville_app_S.fragment_profile;

import java.util.ArrayList;

public class fragment_profile_adapter extends RecyclerView.Adapter<fragment_profile_adapter.Categories> {

    private ArrayList<String>categoryName;
    private ArrayList<Long>categoryPoints;
    private ArrayList<Integer> colors = fragment_profile.colors;
    Context context;

    public fragment_profile_adapter(Context context,   ArrayList<String>categoryName,  ArrayList<Long>categoryPoints){
        this.context = context;
        this.categoryName = categoryName;
        this.categoryPoints = categoryPoints;
    }


    @NonNull
    @Override
    public fragment_profile_adapter.Categories onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.item_rv_category_points, parent, false);
        return new fragment_profile_adapter.Categories(view);
    }

    @Override
    public void onBindViewHolder(@NonNull fragment_profile_adapter.Categories holder, int position) {
        if(categoryName.get(position) != null && categoryPoints.get(position) != null ){
            holder.TVCategoryName.setText( categoryName.get(position));
            //holder.TVCategoryPoints.setText( String.valueOf(categoryPoints.get(position)));
            if( MainActivity.appUser.getTotalPointsSum() != 0 ){
                holder.TVPointsPercent.setText(String.format("%.1f",  ( (categoryPoints.get(position)*100.0) / (double)MainActivity.appUser.getTotalPointsSum()) ) + "%" );
                holder.TVPointsPercent.setTextColor(colors.get(position));
            }else holder.TVPointsPercent.setText("0.0%");
        }
    }

    @Override
    public int getItemCount() {
        return categoryName.size();
    }

    public class Categories extends RecyclerView.ViewHolder {

        TextView TVCategoryName;
        TextView TVCategoryPoints;
        TextView TVPointsPercent;

        public Categories(@NonNull View itemView) {
            super(itemView);
            TVCategoryName  = (TextView) itemView.findViewById(R.id.TVCategoryName);
            TVCategoryPoints = (TextView) itemView.findViewById(R.id.TVCategoryPoints);
            TVPointsPercent = (TextView) itemView.findViewById(R.id.TVPointsPercent);
        }
    }
}
