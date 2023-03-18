package com.fiipractic.pokemoncatalog.model;

public class Pokemon {

    private Integer id;
    private String name;
    private Integer baseTotal;

    public Pokemon(Integer id, String name, Integer baseTotal) {
        this.id = id;
        this.name = name;
        this.baseTotal = baseTotal;
    }

    public Pokemon() {
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getBaseTotal() {
        return baseTotal;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBaseTotal(Integer baseTotal) {
        this.baseTotal = baseTotal;
    }

    @Override
    public String toString() {
        return "Pokemon{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", baseTotal=" + baseTotal +
                '}';
    }
}
