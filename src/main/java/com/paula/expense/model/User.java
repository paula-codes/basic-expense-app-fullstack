package com.paula.expense.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Entity
// @Data (lombok) automatically generates getters + setters behind the scenes
@Data
@Table(name="users")
public class User {

    @Id
    private Long id;

    private String name;

    private String email;

    @OneToMany
    private Set<Category> category;
}
