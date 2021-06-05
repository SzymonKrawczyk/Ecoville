package com.example.bottomnavigationview.model;

import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;

import java.text.SimpleDateFormat;

public class Post {

    private DocumentReference id_user;
    private String message;
    private Timestamp timestamp;

    public Post() { }

    public Post(DocumentReference id_user, String message, Timestamp timestamp) {
        this.id_user = id_user;
        this.message = message;
        this.timestamp = timestamp;
    }

    public DocumentReference getId_user() {
        return id_user;
    }

    public void setId_user(DocumentReference id_user) {
        this.id_user = id_user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public String _getDate () {
        SimpleDateFormat sfd = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        return sfd.format(timestamp.toDate());
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
}
