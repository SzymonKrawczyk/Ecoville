package com.example.ecoville_app_S.model;

import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentId;
import com.google.firebase.firestore.DocumentReference;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class Tip {

    private String title;
    private String shortDescription;
    private String content;
    private List<DocumentReference> likedBy;
    private Timestamp added;

    public Tip() { }

    public Tip(String title, String shortDescription, String content,List<DocumentReference> likedBy, Timestamp added) {
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.likedBy = likedBy;
        this.added = added;
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

    public List<DocumentReference> getLikedBy() {
        return likedBy;
    }

    public void setLikedBy(List<DocumentReference> likedBy) {
        this.likedBy = likedBy;
    }

    public Timestamp getAdded() {
        return added;
    }

    public String getDate() {
        SimpleDateFormat sfd = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        return sfd.format(added.toDate());
    }

    public void setAdded(Timestamp added) {
        this.added = added;
    }
}
