package com.paula.expense.model;


import com.sun.istack.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@NoArgsConstructor
@Data
@Entity
@Table(name="category")
public class Category {

    @Id
    private Long id;

    @NotNull
    //Travel, Grocery, etc...
    private String name;

}
