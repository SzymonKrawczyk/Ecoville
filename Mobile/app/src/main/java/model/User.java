package com.example.bottomnavigationview.model;

import com.example.bottomnavigationview.MainActivity;
import com.example.bottomnavigationview.fragment_home_missions;
import com.example.bottomnavigationview.tcpClient;
import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class User {

    private Timestamp ban;
    private Timestamp created;
    private int currentPoints;
    private String email;
    private String firstName;
    private String lastName;
    private ArrayList<HashMap<String, Object>> totalPoints;
    private Integer totalPointsSum;
    private ArrayList<HashMap<String, Object>> trophies;
    private int confirmedMissions;

    private String profilePic;


    public User(){}

    public User(Timestamp ban, Timestamp created, int currentPoints, String email, String firstName,
                String lastName, ArrayList<HashMap<String, Object>> totalPoints, Integer totalPointsSum,
                ArrayList<HashMap<String, Object>> trophies, int confirmedMissions, String profilePic) {
        this.ban = ban;
        this.created = created;
        this.currentPoints = currentPoints;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.totalPoints = totalPoints;
        this.totalPointsSum = totalPointsSum;
        this.trophies = trophies;
        this.confirmedMissions = confirmedMissions;
        this.profilePic = profilePic;
    }

    public User(String email, String firstName, String lastName, Date date) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.totalPoints = new ArrayList<HashMap<String, Object>>();
        this.totalPointsSum = 0;
        this.trophies = new ArrayList<HashMap<String, Object>>();
        this.currentPoints = 0;
        this.created = new Timestamp(date);
        this.confirmedMissions = 0;
        this.profilePic = null;
    }

    public String getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
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

    public boolean _addTrophy(DocumentReference trophyDocRef, FirebaseFirestore db) {
        if (trophies == null) trophies = new ArrayList<HashMap<String, Object>>();

        boolean already_have_this_trophy=false;
        for(int i=0; i<trophies.size(); i++){
            for ( String key : trophies.get(i).keySet() ) {
                if ( trophies.get(i).get(key) == trophyDocRef ) { already_have_this_trophy=true; }
            }
        }

        if(!already_have_this_trophy)
        {
            Date date = MainActivity.getDateFromServer();

            if(date != null)
            {
                HashMap<String, Object> HM = new HashMap<>();

                HM.put("trophy_id", trophyDocRef);
                HM.put("unlockDate", new Timestamp( date));

                trophies.add( HM );
                _save(db);
                return true;
            }else{
                return false;
            }
        }
        return false;
    }

    public boolean _isUserBanned(){
        if(ban == null)
            return false;

        Date date = MainActivity.getDateFromServer();
        if(date != null)
        {
            long time = date.getTime();
            return time/1000 < ban.getSeconds();
        }
        return true;
    }

    public String _getEndOfBanDate () {
        SimpleDateFormat sfd = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        return sfd.format(ban.toDate());
    }

    public void _save(FirebaseFirestore db) {
        db.collection("user").document(MainActivity.userDocRef.getId()).set(this);
        //db.collection("user").document("123").set(this);
    }

    public Timestamp getBan() { return ban; }

    public void setBan(Timestamp ban) { this.ban = ban; }

    public int getTotalPointsSum() { return totalPointsSum != null ? totalPointsSum : 0; }

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

   public ArrayList<HashMap<String, Object>> getTrophies() {
        return trophies;
    }

    public void setTrophies(ArrayList<HashMap<String, Object>> trophies) {
        this.trophies = trophies;
    }

    public int getConfirmedMissions() {
        return confirmedMissions;
    }

    public void setConfirmedMissions(int confirmedMissions) {
        this.confirmedMissions = confirmedMissions;
    }
}
