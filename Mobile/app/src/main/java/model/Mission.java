package com.example.ecoville_app_S.model;

import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;

import java.text.SimpleDateFormat;
import java.util.Date;

public class Mission {
    private String name;
    private Timestamp added;
    private Timestamp when;
    private String description;
    private DocumentReference id_category;
    private int currentParticipants;
    private int requiredParticipants;
    private String location;
    private int points;
    private int durationMinutes;

    public Mission() { }
    public Mission(String name, Timestamp added, Timestamp when, String description, DocumentReference id_category, int currentParticipants, int requiredParticipants, String location, int points, int durationMinutes) {
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

    public String getMonth() {
        SimpleDateFormat sfd = new SimpleDateFormat("MMMM");
        return sfd.format(when.toDate());
    }

    public String getDay() {
        SimpleDateFormat sfd = new SimpleDateFormat("dd");
        return sfd.format(when.toDate());
    }

    public String getTime() {
        SimpleDateFormat sfd = new SimpleDateFormat("HH:mm");
        return sfd.format(when.toDate());
    }

    public boolean isNew() {

        Date date = new Date();
        long time = date.getTime();
        return (time/1000 - added.getSeconds()) < 60*60*24*7;
    }

    public boolean isAvailable() {

        Date date = new Date();
        long time = date.getTime();
        return time/1000 < when.getSeconds();
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

    public void setCategory_id(DocumentReference id_category) {
        this.id_category = id_category;
    }

    public int getCurrentParticipants() {
        return currentParticipants;
    }

    public void setCurrentParticipants(int currentParticipants) {
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
