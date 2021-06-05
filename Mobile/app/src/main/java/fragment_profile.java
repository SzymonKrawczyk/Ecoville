package com.example.bottomnavigationview;

import android.app.ProgressDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import android.graphics.Color;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

//import com.bumptech.glide.Glide;


import com.bumptech.glide.Glide;
import com.example.bottomnavigationview.model.User;
import com.example.bottomnavigationview.model.fragment_profile_adapter;
import com.github.mikephil.charting.charts.PieChart;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.PieDataSet;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.listener.OnChartValueSelectedListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.github.mikephil.charting.animation.Easing;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.data.PieData;
import com.github.mikephil.charting.data.PieEntry;
import com.github.mikephil.charting.formatter.PercentFormatter;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.OnProgressListener;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;


public class fragment_profile extends Fragment implements OnChartValueSelectedListener {

    private ArrayList<String>categoryName;
    private ArrayList<Long>categoryPoints;
    private Integer numberOfItems;

    public static ArrayList<Integer> colors = new ArrayList<>();
    private ArrayList<Integer> colorsGrey = new ArrayList<>();
    private ArrayList<Integer> colorsGreen = new ArrayList<>();

    private PieDataSet dataSet;

    TextView TVFullName;
    TextView TVFullNameWithNoSpacesInBetween;
    TextView TVMemberSince;
    TextView TVMissionsValidate;
    TextView TVMissionsValidateValue;
    TextView TVRank;
    TextView TVRankValue;
    TextView TVScore;
    TextView TVScoreValue;
    TextView TVNewTrophyUnlocked;
    TextView TVCheckYourCollection;

    ImageView IVProfile;
    ImageView IVTrophyInProfile;
    Button BProfileGoToCollection;
    Button BTProfileLogOut;

    PieChart PieChartProfile;

    RecyclerView rv;

    FirebaseFirestore db;

    int userRank;
    Uri imageURL;

    public fragment_profile() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        categoryName = new ArrayList<String>();
        categoryPoints = new ArrayList<Long>();
        //userRank = 1;

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_profile, container, false);
        db = FirebaseFirestore.getInstance();
        rv = (RecyclerView) view.findViewById(R.id.RVProfileTotalPoints);

        colorsGreen.add(Color.parseColor("#2FB454"));
        colorsGreen.add(Color.parseColor("#7FBD2E"));
        colorsGreen.add(Color.parseColor("#76BB6B"));
        colorsGreen.add(Color.parseColor("#0f8a17"));

        colorsGreen.add(Color.parseColor("#60bd66"));
        colorsGreen.add(Color.parseColor("#2c916c"));
        colorsGreen.add(Color.parseColor("#166b4c"));
        colorsGreen.add(Color.parseColor("#127075"));

        colorsGreen.add(Color.parseColor("#0399a1"));
        colorsGreen.add(Color.parseColor("#1a73a3"));
        colorsGreen.add(Color.parseColor("#1a4ca3"));
        colorsGreen.add(Color.parseColor("#6133a6"));

        colorsGrey.add(Color.parseColor("#D3D3D3"));

        colors = new ArrayList<>(colorsGreen);

        IVProfile = view.findViewById(R.id.IVProfile);

        if (MainActivity.appUser.getProfilePic() != null) {
            FirebaseStorage storage = FirebaseStorage.getInstance();
            // Create a storage reference from our app
            StorageReference storageRef = storage.getReference();

            // Create a reference with an initial file path and name
            StorageReference pathReference = storageRef.child("users/" + MainActivity.appUser.getProfilePic());


            Glide.with(fragment_profile.this /* context */)
                    .load(pathReference)
                    .into(IVProfile);
        }

        IVProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(MainActivity.appUser._isUserBanned()){
                    Intent intent = new Intent(getActivity(), UserBannedErrorActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                }else{
                    uploadProfilePicture();
                }
            }
        });

        MainActivity.userDocRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                MainActivity.appUser = documentSnapshot.toObject(User.class);

                TVFullName = (TextView) view.findViewById(R.id.TVFullName);
                TVFullName.setText(MainActivity.appUser.getFirstName() + " " + MainActivity.appUser.getLastName());

                TVFullNameWithNoSpacesInBetween = (TextView) view.findViewById(R.id.TVFullNameWithNoSpacesInBetween);
                TVFullNameWithNoSpacesInBetween.setText("@" + MainActivity.appUser.getFirstName() + MainActivity.appUser.getLastName());

                BTProfileLogOut = (Button) view.findViewById(R.id.BTProfileLogout);

                BTProfileLogOut.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        MainActivity.logout();
                        Intent intent = new Intent(getActivity(), LogIn.class);
                        // Uwaga: wyczyszczenie flag zablokuje mozliwosc powrotu do poprzedniego ekranu, ale w zamian korzystajac z przycisku
                        // powrotu wywali uzytkownika do ekranu (zminimalizuje apke)
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        startActivity(intent);
                    }
                });

                BProfileGoToCollection = (Button) view.findViewById(R.id.BProfileGoToCollection);
                BProfileGoToCollection.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_profile_new_trophie()).addToBackStack(null).commit();
                    }
                });

                TVMemberSince = (TextView) view.findViewById(R.id.TVMemberSince);
                Date javaDate = MainActivity.appUser.getCreated().toDate();
                TVMemberSince.setText("member since " + (javaDate.getYear()+1900));

                TVMissionsValidate = (TextView) view.findViewById(R.id.TVMissionsValidate);
                TVMissionsValidateValue = (TextView) view.findViewById(R.id.TVMissionsValidateValue);
                TVMissionsValidateValue.setText(String.valueOf(MainActivity.appUser.getConfirmedMissions()));

                TVRank = (TextView) view.findViewById(R.id.TVRank);
                TVRankValue = (TextView) view.findViewById(R.id.TVRankValue);
                getRank();
                TVRankValue.setText(String.valueOf(userRank));

                TVScore = (TextView) view.findViewById(R.id.TVScore);
                TVScoreValue = (TextView) view.findViewById(R.id.TVScoreValue);
                TVScoreValue.setText(String.valueOf(MainActivity.appUser.getCurrentPoints() + " / " + String.valueOf(MainActivity.appUser.getTotalPointsSum())));
                TVNewTrophyUnlocked = (TextView) view.findViewById(R.id.TVNewTrophyUnlocked);
                TVCheckYourCollection = (TextView) view.findViewById(R.id.TVCheckYourCollection);

                IVTrophyInProfile = (ImageView) view.findViewById(R.id.IVTrophyInProfile);

                PieChartProfile = (PieChart) view.findViewById(R.id.PieChartProfile);
                if(MainActivity.appUser.getTotalPointsSum()==0)
                {
                    PieChartProfile.setVisibility(View.INVISIBLE);
                }
                //setUpPieChart();
                //populatePieChart();

                setRecycleViewContent();
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
            }
        });

        return view;
    }

    public void uploadProfilePicture(){
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(intent, 1);
    }



    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {

        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode==1 && resultCode==getActivity().RESULT_OK && data != null && data.getData() != null){
            imageURL = data.getData();
            uploadToFirebaseStorage();
        }
    }

    public void uploadToFirebaseStorage(){
        ProgressDialog pd = new ProgressDialog(getContext());
        pd.setTitle("Uploading new Profile picture");
        pd.show();

        FirebaseStorage storage = FirebaseStorage.getInstance();
        StorageReference storageRef = storage.getReference();

        StorageReference riversRef = storageRef.child("users/"+MainActivity.userDocRef.getId());
        UploadTask uploadTask = riversRef.putFile(imageURL);

        // Register observers to listen for when the download is done or if it fails
        uploadTask.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception exception) {
                // Handle unsuccessful uploads
                pd.dismiss();
                Toast.makeText(getContext(), "Failed to upload profile picture", Toast.LENGTH_LONG).show();
            }
        }).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
            @Override
            public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                // taskSnapshot.getMetadata() contains file metadata such as size, content-type, etc.
                // ...
                pd.dismiss();
                //Snackbar.make(getActivity().findViewById(R.id.content), "new profile image uploaded", Snackbar.LENGTH_LONG);
                IVProfile.setImageURI(imageURL);
                MainActivity.appUser.setProfilePic(MainActivity.userDocRef.getId());
                MainActivity.appUser._save(db);
            }
        }).addOnProgressListener(new OnProgressListener<UploadTask.TaskSnapshot>() {
            @Override
            public void onProgress(@NonNull UploadTask.TaskSnapshot snapshot) {
                double progressPercent = 100.0 * snapshot.getBytesTransferred() / snapshot.getTotalByteCount();
                pd.setMessage("Progress: " + (int)progressPercent + " %");
            }
        });
    }

    private void getRank()
    {
        //Query query =  db.collection("user").whereGreaterThan("totalPointsSum", MainActivity.appUser.getTotalPointsSum());
        db.collection("user").orderBy("totalPointsSum", Query.Direction.DESCENDING).get().addOnSuccessListener(new OnSuccessListener<QuerySnapshot>() {
            @Override
            public void onSuccess(QuerySnapshot queryDocumentSnapshots) {
                int i=1;
                for(QueryDocumentSnapshot querySnapshot : queryDocumentSnapshots){
                    if( MainActivity.userDocRef.getId().equals(querySnapshot.getId())){
                        userRank = i;
                        TVRankValue.setText(String.valueOf(userRank));
                        break;
                    }
                    i++;
                }
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                System.out.println(e);
            }
        });
    }

    private void setRecycleViewContent(){

        ArrayList<HashMap<String, Object>> hashMaps = new ArrayList<>();
        categoryName = new ArrayList<>();
        categoryPoints = new ArrayList<>();

        DocumentReference docRef;

        hashMaps = MainActivity.appUser.getTotalPoints();
        numberOfItems = hashMaps.size();

        if(hashMaps != null)
        {
            for(int i=0; i<hashMaps.size(); i++){
                categoryPoints.add((Long) hashMaps.get(i).get("points"));
                docRef = (DocumentReference) hashMaps.get(i).get("id_category");
                docRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                    @Override
                    public void onSuccess(DocumentSnapshot documentSnapshot) {
                        categoryName.add( (String) documentSnapshot.get("name"));
                        if( numberOfItems == categoryName.size() ){
                            setRecycleView();
                            setUpPieChart();
                            populatePieChart();
                        }
                    }
                }).addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                    }
                });
            }
        }
    }

    private void setRecycleView(){
        fragment_profile_adapter adapter = new fragment_profile_adapter(this.getContext(), categoryName, categoryPoints);
        rv.setLayoutManager(new LinearLayoutManager(this.getContext()));
        rv.setAdapter(adapter);
    }

    private void setUpPieChart(){
        PieChartProfile.setDrawHoleEnabled(false);
        PieChartProfile.setDrawSlicesUnderHole(true);
        PieChartProfile.setUsePercentValues(true);
        PieChartProfile.setEntryLabelTextSize(12);
        PieChartProfile.setEntryLabelColor(Color.BLACK);
        //PieChartProfile.setCenterText("XD");
        //PieChartProfile.setCenterTextSize(24);
        PieChartProfile.getDescription().setEnabled(false);
        PieChartProfile.setOnChartValueSelectedListener(this);

        Legend legend = PieChartProfile.getLegend();
        legend.setVerticalAlignment(Legend.LegendVerticalAlignment.CENTER);
        legend.setHorizontalAlignment(Legend.LegendHorizontalAlignment.RIGHT);
        legend.setOrientation(Legend.LegendOrientation.VERTICAL);
        legend.setTextSize(14);
        legend.setDrawInside(false);
        //legend.setEnabled(true);
        legend.setEnabled(false);
    }

    private void populatePieChart()
    {
        ArrayList<PieEntry> entries = new ArrayList<>();
        for(int i=0; i < categoryName.size(); i++){
            colors.add(colorsGreen.get(i));

            String temp = String.format("%.1f",  ( (categoryPoints.get(i)*100.0) / (double)MainActivity.appUser.getTotalPointsSum()) ) + "%";
            entries.add(new PieEntry(categoryPoints.get(i), categoryName.get(i) + " " + temp));
        }

        /*
        for(int color: ColorTemplate.MATERIAL_COLORS){
            colors.add(color);
        }
        for(int color: ColorTemplate.VORDIPLOM_COLORS){
            colors.add(color);
        }
        */

        dataSet = new PieDataSet(entries, "");
        dataSet.setColors(colors);

        /*ArrayList<Integer> colors2 = new ArrayList<>();
        for (int c : ColorTemplate.COLORFUL_COLORS)
            colors2.add(c);
        dataSet.setColors(colors2);*/

        dataSet.setSliceSpace(2f);

        PieData pieData = new PieData(dataSet);
        pieData.setDrawValues(false);
        //pieData.setValueFormatter(new PercentFormatter(PieChartProfile));
        //pieData.setValueTextSize(12f);
        //pieData.setValueTextColor(Color.BLACK);

        PieChartProfile.setData(pieData);
        PieChartProfile.invalidate();

        PieChartProfile.setDrawEntryLabels(false);
        PieChartProfile.animateY(1400, Easing.EaseInOutQuad);

        PieChartProfile.getDescription().setEnabled(false);
    }

    @Override
    public void onValueSelected(Entry e, Highlight h) {

        if (e == null)
            return;
        Log.i("VAL SELECTED",
                "Value: " + e.getY() + ", index: " + h.getX()
                        + ", DataSet index: " + h.getDataSetIndex());

        colors = new ArrayList<>();
        for(int i=0; i<numberOfItems; i++)
        {
            colors.add(colorsGrey.get(0));
        }
        colors.set((int)h.getX(), colorsGreen.get((int)h.getX()));

        dataSet.setColors(colors);

        PieData data = new PieData(dataSet);
        data.setValueFormatter(new PercentFormatter());
        data.setValueTextSize(11f);
        data.setValueTextColor(Color.WHITE);
        PieChartProfile.setData(data);

        PieChartProfile.setNoDataText("Get points to see the chart");
        PieChartProfile.setNoDataTextColor(Color.parseColor("#ffffff"));

        setRecycleView();
    }

    @Override
    public void onNothingSelected() {
        colors = new ArrayList<>(colorsGreen);
        dataSet.setColors(colors);

        PieData data = new PieData(dataSet);
        data.setValueFormatter(new PercentFormatter());
        data.setValueTextSize(11f);
        data.setValueTextColor(Color.WHITE);
        PieChartProfile.setData(data);

        setRecycleView();
    }
}