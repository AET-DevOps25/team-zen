package com.example.journal_microservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Insights {
    private String analysis;
    private String moodPattern;
    private String suggestion;
    private String achievement;
    private String wellnessTip;
}
