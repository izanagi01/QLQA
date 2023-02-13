package com.devcamp.exam.controller;

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

import com.devcamp.exam.model.Answer;
import com.devcamp.exam.model.Question;
import com.devcamp.exam.repository.IAnswerRepository;
import com.devcamp.exam.repository.IQuestionRepository;

@RestController
@CrossOrigin
@RequestMapping("/")
public class AnswerController {
   @Autowired
   private IQuestionRepository questionRepository;

   @Autowired
   private IAnswerRepository answerRepository;

   @GetMapping("/answer/all")
   public ResponseEntity<List<Answer>> getAllAnswer() {
      try {
         return new ResponseEntity<>(answerRepository.findAll(), HttpStatus.OK);
      } catch (Exception e) {
         // TODO: handle exception
         System.out.println(e);
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @GetMapping("/question/{id}/answers")
   public ResponseEntity<List<Answer>> getAnswerByQuestionId(@PathVariable("id") long id) {
      try {
         return new ResponseEntity<>(answerRepository.findByQuestionId(id), HttpStatus.OK);
      } catch (Exception e) {
         // TODO: handle exception
         System.out.println(e);
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @GetMapping("/answer/{id}")
   public ResponseEntity<Answer> getAnswerById(@PathVariable("id") long id) {
      try {
         return new ResponseEntity<>(answerRepository.findById(id).get(), HttpStatus.OK);
      } catch (Exception e) {
         // TODO: handle exception
         System.out.println(e);
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @PostMapping("/answer/create/{questionId}")
   public ResponseEntity<Object> createAnswer(@PathVariable("questionId") long id, @Valid @RequestBody Answer pAnswer) {
      try {
         Optional<Question> questionData = questionRepository.findById(id);
         if (questionData.isPresent()) {
            Answer newAnswer = new Answer();

            newAnswer.setAnswerCode(pAnswer.getAnswerCode());
            newAnswer.setAnswerContent(pAnswer.getAnswerContent());
            newAnswer.setCorrect(pAnswer.isCorrect());
            newAnswer.setExplanation(pAnswer.getExplanation());
            newAnswer.setQuestion(questionData.get());

            answerRepository.save(newAnswer);

            return new ResponseEntity<>(newAnswer, HttpStatus.CREATED);
         } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
         }

      } catch (Exception e) {
         // TODO: handle exception
         System.out.println(e);
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @PutMapping("/answer/update/{answerId}")
   public ResponseEntity<Object> updateAnswer(@PathVariable("answerId") long id, @Valid @RequestBody Answer pAnswer) {
      try {
         Optional<Answer> answerData = answerRepository.findById(id);
         if (answerData.isPresent()) {
            Answer updateAnswer = answerData.get();

            updateAnswer.setAnswerContent(pAnswer.getAnswerContent());
            updateAnswer.setCorrect(pAnswer.isCorrect());
            updateAnswer.setExplanation(pAnswer.getExplanation());

            answerRepository.save(updateAnswer);

            return new ResponseEntity<>(updateAnswer, HttpStatus.OK);
         } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
         }
      } catch (Exception e) {
         // TODO: handle exception
         System.out.println(e);
         return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   @DeleteMapping("/answer/delete/{answerId}")
   public ResponseEntity<Object> deleteQuestionById(@PathVariable("answerId") long id) {
      try {
         Optional<Answer> answerData = answerRepository.findById(id);
         if (answerData.isPresent()) {
            answerRepository.deleteById(id);
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
