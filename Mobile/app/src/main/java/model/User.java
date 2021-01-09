package com.example.ecoville_app_S.model;

import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class User {

    private Timestamp created;
    private int currentPoints;
    private String email;
    private String firstName;
    private String lastName;
    private ArrayList<HashMap<String, Object>> totalPoints;
    private Integer totalPointsSum;
    //private ArrayList<TreeMap<DocumentReference, Timestamp>> trophies;

    public User(){}

    public User(Timestamp created, int currentPoints, String email, String firstName, String lastName, ArrayList<HashMap<String, Object>> totalPoints, Integer totalPointsSum/*, ArrayList<TreeMap<DocumentReference, Timestamp>> trophies*/) {
        this.created = created;
        this.currentPoints = currentPoints;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.totalPoints = totalPoints;
        this.totalPointsSum = totalPointsSum;
        //this.trophies = trophies;
    }

    public User(String email, String firstName, String lastName, String password) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public void _showMap () {
        if (totalPoints != null)
        for (HashMap<String, Object> map : totalPoints) {
            for (String key : map.keySet()) {

                if (key.equals("points")) System.out.println(key + ": " + (Long)map.get(key));
                else System.out.println(key + ": " + (DocumentReference)map.get(key));

            }
        }
    }

    public int getTotalPointsSum() {

        return totalPointsSum != null ? totalPointsSum : 0;
    }

    public void setTotalPointsSum(Integer totalPointsSum) {
        this.totalPointsSum = totalPointsSum;
    }

    public Timestamp getCreated() {
        return created;
    }

    public void setCreated(Timestamp created) {
        this.created = created;
    }

    public int getCurrentPoints() {
        return currentPoints;
    }

    public void setCurrentPoints(int currentPoints) {
        this.currentPoints = currentPoints;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public ArrayList<HashMap<String, Object>> getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(ArrayList<HashMap<String, Object>> totalPoints) {
        this.totalPoints = totalPoints;
    }

   /* public ArrayList<TreeMap<DocumentReference, Timestamp>> getTrophies() {
        return trophies;
    }

    public void setTrophies(ArrayList<TreeMap<DocumentReference, Timestamp>> trophies) {
        this.trophies = trophies;
    }*/
}
