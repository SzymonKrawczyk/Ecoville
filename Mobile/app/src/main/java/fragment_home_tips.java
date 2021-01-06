package com.example.ecoville_app_S;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

public class fragment_home_tips extends Fragment {


    public fragment_home_tips() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }


    private Button BTHomeMissions;
    private Button BTHomeTalk;
    private Button BTTipsReadFull1;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.fragment_home_tips, container, false);

        BTHomeMissions = (Button) view.findViewById(R.id.BTHomeMissions);
        BTHomeTalk = (Button) view.findViewById(R.id.BTHomeTalk);
        BTTipsReadFull1 = (Button) view.findViewById(R.id.BTTipsReadFull1);

        BTHomeMissions.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_missions()).addToBackStack(null).commit();
            }
        });
        BTHomeTalk.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_talk()).addToBackStack(null).commit();
            }
        });
        BTTipsReadFull1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragment, new fragment_home_tip_details()).addToBackStack(null).commit();
            }
        });


        return view;
    }
}