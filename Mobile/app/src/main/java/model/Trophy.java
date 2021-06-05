package com.example.bottomnavigationview.model;

public class Trophy {

    private int cost;
    private String image;
    private String name;
    private String description;

    public Trophy(){}

    public Trophy(Trophy t){
        this.cost = t.getCost();
        this.name = t.getName();
        this.description = t.getDescription();
        this.image = t.getImage();
    }

    public Trophy(int cost, String image, String name, String description){
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
        if(this.image == null) return "trophy_1";
        return image;
    }

    public void setImage(String image) { this.image = image; }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }
}
