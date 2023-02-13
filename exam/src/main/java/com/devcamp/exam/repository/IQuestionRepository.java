package com.devcamp.exam.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devcamp.exam.model.Question;

public interface IQuestionRepository extends JpaRepository<Question, Long> {

}
