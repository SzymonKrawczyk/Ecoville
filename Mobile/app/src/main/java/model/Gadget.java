package com.example.bottomnavigationview.model;

import com.example.bottomnavigationview.MainActivity;
import com.google.firebase.firestore.FirebaseFirestore;

public class Gadget {

    int amount;
    int cost;
    String name;

    public Gadget(){
        this.amount = 0;
        this.cost = 0;
        this.name = null;
    }

    public Gadget(int amount, int cost, String name) {
        this.amount = amount;
        this.cost = cost;
        this.name = name;
    }

    public Gadget(Gadget g){
        this.amount = g.amount;
        this.cost = g.cost;
        this.name = g.name;
    }

    public void _buyGadget(String gadgetId, FirebaseFirestore db){
        amount--;
        _save(gadgetId, db);
    }

    public void _save(String gadgetId, FirebaseFirestore db) {
        db.collection("gadget").document(gadgetId).set(this);
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public int getCost() {
        return cost;
    }

    public void setCost(int cost) {
        this.cost = cost;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
