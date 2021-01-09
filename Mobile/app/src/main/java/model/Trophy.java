package com.example.ecoville_app_S.model;

public class Trophy {

    private int cost;
    private String image;
    private String name;

    public Trophy(){}

    public Trophy(int cost, String image, String name){
        this.cost = cost;
        this.image = image;
        this.name = name;
    }

    public int getCost() {
        return cost;
    }

    public void setCost(int cost) {
        this.cost = cost;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
