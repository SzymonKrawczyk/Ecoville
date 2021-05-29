package com.example.bottomnavigationview.model;

import com.example.bottomnavigationview.MainActivity;
import com.google.firebase.firestore.FirebaseFirestore;

public class Gadget {

    int amount;
    int cost;
    String name;
    String pic;

    public Gadget(){
        this.amount = 0;
        this.cost = 0;
        this.name = null;
        this.pic = null;
    }

    public Gadget(int amount, int cost, String name, String pic) {
        this.amount = amount;
        this.cost = cost;
        this.name = name;
        this.pic = pic;
    }

    public Gadget(Gadget g){
        this.amount = g.amount;
        this.cost = g.cost;
        this.name = g.name;
        this.pic = g.pic;
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

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }
}
