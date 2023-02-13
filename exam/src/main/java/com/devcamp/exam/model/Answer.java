package com.devcamp.exam.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "answers")
public class Answer {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private long id;

   @NotEmpty(message = "Nhập mã câu trả lời")
   @Size(min = 2, message = "Mã câu trả lời phải có ít nhất 2 ký tự ")
   @Column(name = "answer_code", unique = true, updatable = false, nullable = false)
   private String answerCode;

   @NotEmpty(message = "Nhập nội dung câu trả lời")
   @Column(name = "answer_content", nullable = false)
   private String answerContent;

   @NotEmpty(message = "Nhập nội dung giải thích câu trả lời")
   @Column(name = "explanation")
   private String explanation;

   @Column(name = "is_correct", nullable = false)
   private boolean isCorrect;

   @ManyToOne
   @JsonIgnore
   private Question question;

   public Answer() {
   }

   public Answer(long id, String answerCode, String answerContent, boolean isCorrect, String explanation,
         Question question) {
      this.id = id;
      this.answerCode = answerCode;
      this.answerContent = answerContent;
      this.isCorrect = isCorrect;
      this.explanation = explanation;
      this.question = question;
   }

   public long getId() {
      return id;
   }

   public void setId(long id) {
      this.id = id;
   }

   public String getAnswerCode() {
      return answerCode;
   }

   public void setAnswerCode(String answerCode) {
      this.answerCode = answerCode;
   }

   public String getAnswerContent() {
      return answerContent;
   }

   public void setAnswerContent(String answerContent) {
      this.answerContent = answerContent;
   }

   public boolean isCorrect() {
      return isCorrect;
   }

   public void setCorrect(boolean isCorrect) {
      this.isCorrect = isCorrect;
   }

   public String getExplanation() {
      return explanation;
   }

   public void setExplanation(String explanation) {
      this.explanation = explanation;
   }

   public Question getQuestion() {
      return question;
   }

   public void setQuestion(Question question) {
      this.question = question;
   }

}
