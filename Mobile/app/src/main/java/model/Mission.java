package com.example.bottomnavigationview.model;

import com.example.bottomnavigationview.MainActivity;
import com.example.bottomnavigationview.fragment_home_missions;
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

public class Mission {
    private String name;
    private Timestamp added;
    private Timestamp when;
    private String description;
    private DocumentReference id_category;
    private ArrayList<HashMap<String, Object>> currentParticipants;
    private int requiredParticipants;
    private String location;
    private int points;
    private int durationMinutes;

    public Mission() { }

    public Mission(String name, Timestamp added, Timestamp when, String description, DocumentReference id_category, ArrayList<HashMap<String, Object>> currentParticipants, int requiredParticipants, String location, int points, int durationMinutes) {
        this.name = name;
        this.added = added;
        this.when = when;
        this.description = description;
        this.id_category = id_category;
        this.currentParticipants = currentParticipants;
        this.requiredParticipants = requiredParticipants;
        this.location = location;
        this.points = points;
        this.durationMinutes = durationMinutes;
    }

    public String _getMonth() {
        SimpleDateFormat sfd = new SimpleDateFormat("MMMM");
        return sfd.format(when.toDate());
    }

    public String _getDay() {
        SimpleDateFormat sfd = new SimpleDateFormat("dd");
        return sfd.format(when.toDate());
    }

    public String _getTime() {
        SimpleDateFormat sfd = new SimpleDateFormat("HH:mm");
        return sfd.format(when.toDate());
    }

    public boolean _isNew() {

        Date date = new Date();
        if(date != null)
        {
            long time =date.getTime();
            return _isAvailable() && (time/1000 - added.getSeconds()) < 60*60*24*7;
        }else{
            return false;
        }
    }

    public boolean _isAvailable() {

        Date date = new Date();
        if(date != null){
            long time = date.getTime();
            return time/1000 < when.getSeconds();
        }else{
            return false;
        }
    }

    public boolean _hasUser(DocumentReference userDocRef) {

        if (currentParticipants != null && !currentParticipants.isEmpty()) {

            //System.out.println(userDocRef);
            //System.out.println(currentParticipants);
            for(HashMap<String, Object> currentUser : getCurrentParticipants()) {

                //System.out.println(currentUser);
                //System.out.println((DocumentReference)currentUser.get("id_user"));
                if (currentUser.get("id_user") != null && currentUser.get("id_user").equals(userDocRef)) {
                    return true;
                }
            }
        }
        return false;
    }

    public void _addUser(DocumentReference userDocRef, FirebaseFirestore db) {

        Date date = MainActivity.getDateFromServer();
        if(date != null)
        {
            long time = date.getTime();
            if(time/1000 >= when.getSeconds()){
                return;
            }
        }else { return; }

        boolean userAlreadyIn = false;
        for(HashMap<String, Object> currentUser : getCurrentParticipants()) {

            if (currentUser.get("id_user") != null && currentUser.get("id_user").equals(userDocRef)) {
                userAlreadyIn = true;
                break;
            }
        }
        if (!userAlreadyIn) {
            HashMap<String, Object> tempMap = new HashMap<>();
            tempMap.put("id_user", userDocRef);
            tempMap.put("confirmed", false);
            currentParticipants.add(tempMap);
            _save(db);
        }
    }

    public void _removeUser(DocumentReference userDocRef, FirebaseFirestore db) {
        if (currentParticipants == null) return;

        Date date = MainActivity.getDateFromServer();
        if(date != null)
        {
            long time = date.getTime();
            if(time/1000 >= when.getSeconds()){
                return;
            }
        }else { return; }

        for(HashMap<String, Object> currentUser : getCurrentParticipants()) {


            if (currentUser.get("id_user") != null && currentUser.get("id_user").equals(userDocRef)) {
                if (currentUser.get("confirmed") != null) {
                    if(!((Boolean)currentUser.get("confirmed"))){

                        currentParticipants.remove(currentUser);
                        _save(db);
                    }
                }
                break;
            }
        }
    }

    public void _save(FirebaseFirestore db) {

        db.collection("mission").document(fragment_home_missions.missionDocID).set(this);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Timestamp getAdded() {
        return added;
    }

    public void setAdded(Timestamp added) {
        this.added = added;
    }

    public Timestamp getWhen() {
        return when;
    }

    public void setWhen(Timestamp when) {
        this.when = when;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

     public DocumentReference getId_category() {
         return id_category;
    }

    public void setId_category(DocumentReference id_category) {
        this.id_category = id_category;
    }

    public ArrayList<HashMap<String, Object>> getCurrentParticipants() {

        if (currentParticipants == null) currentParticipants = new ArrayList<HashMap<String, Object>>();

        return currentParticipants;
    }

    public void setCurrentParticipants(ArrayList<HashMap<String, Object>> currentParticipants) {
        this.currentParticipants = currentParticipants;
    }

    public int getRequiredParticipants() {
        return requiredParticipants;
    }

    public void setRequiredParticipants(int requiredParticipants) {
        this.requiredParticipants = requiredParticipants;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }


}
