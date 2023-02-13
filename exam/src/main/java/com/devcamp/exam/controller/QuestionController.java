package com.devcamp.exam.controller;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devcamp.exam.model.Question;
import com.devcamp.exam.repository.IQuestionRepository;

@RestController
@CrossOrigin
@RequestMapping("/")
public class QuestionController {
   @Autowired
   private IQuestionRepository questionRepository;

   @GetMapping("/question/all")
   public ResponseEntity<List<Question>> getAllQuestion() {
      try {
         return new ResponseEntity<>(questionRepository.findAll(), HttpStatus.OK);
      } catch (Exception e) {
         // TODO: handle exception
         System.out.println(e);
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @GetMapping("/question/{id}")
   public ResponseEntity<Object> getQuestionById(@PathVariable("id") long id) {
      try {
         return new ResponseEntity<>(questionRepository.findById(id), HttpStatus.OK);
      } catch (Exception e) {
         // TODO: handle exception
         System.out.println(e);
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @PostMapping("/question/create")
   public ResponseEntity<Object> createQuestion(@Valid @RequestBody Question pQuestion) {
      try {
         Question newQuestion = new Question();
         newQuestion.setQuestionCode(pQuestion.getQuestionCode());
         newQuestion.setQuestionContent(pQuestion.getQuestionContent());
         newQuestion.setSubject(pQuestion.getSubject());
         newQuestion.setMark(pQuestion.getMark());
         newQuestion.setCreatedAt(new Date());
         questionRepository.save(newQuestion);

         return new ResponseEntity<>(newQuestion, HttpStatus.OK);
      } catch (Exception e) {
         // TODO: handle exception
         System.out.println(e);
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @PutMapping("/question/update/{id}")
   public ResponseEntity<Object> updateQuestion(@PathVariable("id") long id,
         @Valid @RequestBody Question pQuestion) {
      try {
         Optional<Question> questionData = questionRepository.findById(id);
         if (questionData.isPresent()) {
            Question updateQuestion = questionData.get();
            updateQuestion.setQuestionContent(pQuestion.getQuestionContent());
            updateQuestion.setSubject(pQuestion.getSubject());
            updateQuestion.setMark(pQuestion.getMark());
            questionRepository.save(updateQuestion);

            return new ResponseEntity<>(updateQuestion, HttpStatus.OK);
         } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
         }
      } catch (Exception e) {
         // TODO: handle exception
         System.out.println(e);
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @DeleteMapping("/question/delete/{id}")
   public ResponseEntity<Object> deleteQuestionById(@PathVariable("id") long id) {
      try {
         Optional<Question> questionData = questionRepository.findById(id);
         if (questionData.isPresent()) {
            questionRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
         } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
         }
      } catch (Exception e) {
         // TODO: handle exception
         System.out.println(e);
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}
