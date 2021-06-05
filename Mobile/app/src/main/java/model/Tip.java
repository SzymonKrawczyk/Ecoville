package com.example.bottomnavigationview.model;

import com.example.bottomnavigationview.fragment_home_tips;
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

import java.text.SimpleDateFormat;
import java.util.ArrayList;

public class Tip {

    private String title;
    private String shortDescription;
    private String content;
    private String source;
    private ArrayList<DocumentReference> likedBy;
    private Timestamp added;

    public Tip() { }

    public Tip(String title, String shortDescription, String content, String source, ArrayList<DocumentReference> likedBy, Timestamp added) {
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.source = source;
        this.likedBy = likedBy;
        this.added = added;
    }

    public boolean _isLikedByUser (DocumentReference userDocRef) {
        return likedBy != null && !likedBy.isEmpty() && likedBy.contains(userDocRef);
    }

    public void _addLike(DocumentReference userDocRef, FirebaseFirestore db) {
        if (likedBy == null) likedBy = new ArrayList<>();

        if (!likedBy.contains(userDocRef)){
            likedBy.add(userDocRef);
            _save(db);
        }
    }

    public void _removeLike(DocumentReference userDocRef, FirebaseFirestore db) {
        if (likedBy == null) return;

        if (likedBy.contains(userDocRef)){
            likedBy.remove(userDocRef);
            _save(db);
        }
    }

    public void _save(FirebaseFirestore db) {

        db.collection("tips").document(fragment_home_tips.tipDocID).set(this);
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public ArrayList<DocumentReference> getLikedBy() {
        return likedBy;
    }

    public void setLikedBy(ArrayList<DocumentReference> likedBy) {
        this.likedBy = likedBy;
    }

    public Timestamp getAdded() {
        return added;
    }

    public String _getDate() {
        SimpleDateFormat sfd = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        return sfd.format(added.toDate());
    }

    public void setAdded(Timestamp added) {
        this.added = added;
    }

    public String getSource() { return source; }

    public void setSource(String source) { this.source = source; }
}
