package com.devcamp.exam.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devcamp.exam.model.Answer;

public interface IAnswerRepository extends JpaRepository<Answer, Long> {
   List<Answer> findByQuestionId(Long id);
}
