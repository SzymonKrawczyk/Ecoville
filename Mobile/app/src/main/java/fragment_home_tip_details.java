package com.example.ecoville_app_S;

import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextPaint;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.example.ecoville_app_S.model.Tip;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

public class fragment_home_tip_details extends Fragment {


    public fragment_home_tip_details() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }


    TextView TVTipsDetailsTitle;
    TextView TVTipsDetailsDate;
    TextView TVTipContent;
    TextView TVSource;
    Button BTTipsDtailsLike;


    FirebaseFirestore db;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_home_tip_details, container, false);

        db = FirebaseFirestore.getInstance();

        TVTipsDetailsTitle = (TextView) view.findViewById(R.id.TVTipsDetailsTitle);
        TVTipsDetailsDate = (TextView) view.findViewById(R.id.TVTipsDetailsDate);
        TVTipContent = (TextView) view.findViewById(R.id.TVTipContent);
        TVSource = (TextView) view.findViewById(R.id.TVSource);
        BTTipsDtailsLike = (Button) view.findViewById(R.id.BTTipsDtailsLike);


        DocumentReference docRef = db.collection("tips").document(fragment_home_tips.tipDocID);
        docRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                Tip tip = documentSnapshot.toObject(Tip.class);
                if (tip != null){
                    TVTipsDetailsTitle.setText(tip.getTitle().toUpperCase());
                    TVTipsDetailsDate.setText(tip._getDate());
                    TVTipContent.setText(tip.getContent());
                    TVSource.setText(tip.getSource());
                    BTTipsDtailsLike.setVisibility(View.VISIBLE);

                    // Working example: "https://pl.wikipedia.org/wiki/Ziemniak AAAAAAAAAA
                    // https://pl.wikipedia.org/wiki/Pietruszka_zwyczajna\nwww.google.com\nhttps://pl.wikipedia.org/wiki/Ziemniak";
                    // www.google.com is not recognized as valid address and so, it's not treated as such

                    if(tip.getSource() != null) {

                        String s = tip.getSource();

                        SpannableString sss = new SpannableString(s);
                        int start = 0;
                        int end = 0;

                        for ( int i = 0; i < s.length(); ++i) {

                            start = s.indexOf("http", start);

                            if (start == -1) break;
                            end = s.indexOf(" ", start);
                            int end2 = s.indexOf("\n", start);

                            if (end == -1) end = end2;
                            if (end == -1 && end2 == -1) end = s.length();


                            String ss = s.substring(start, end);

                            ClickableSpan clickableSpan = new ClickableSpan() {
                                @Override
                                public void onClick(@NonNull View widget) {
                                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(ss));
                                    startActivity(intent);
                                }

                                @Override
                                public void updateDrawState(@NonNull TextPaint ds) {
                                    super.updateDrawState(ds);
                                    ds.setColor(Color.BLUE);
                                }
                            };
                            sss.setSpan(clickableSpan, start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

                            start = end + 1;
                        }
                        TVSource.setText(sss);
                        TVSource.setMovementMethod(LinkMovementMethod.getInstance());
                    }

                    if (tip._isLikedByUser(MainActivity.userDocRef)) {
                        BTTipsDtailsLike.setText("Not my cup of tea");
                        BTTipsDtailsLike.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                tip._removeLike(MainActivity.userDocRef, db);
                                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_tip_details()).addToBackStack(null).commit();
                            }
                        });

                    } else {

                        BTTipsDtailsLike.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                tip._addLike(MainActivity.userDocRef, db);
                                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_tip_details()).addToBackStack(null).commit();
                            }
                        });
                    }

                } else {
                    getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
                }
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_connection_error()).addToBackStack(null).commit();
            }
        });

        return view;
    }
}