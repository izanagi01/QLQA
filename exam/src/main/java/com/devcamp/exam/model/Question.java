package com.devcamp.exam.model;

import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.PreRemove;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Range;
import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "questions")
public class Question {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private long id;

   @NotEmpty(message = "Nhập mã câu hỏi")
   @Size(min = 2, message = "Mã câu hỏi phải có ít nhất 2 ký tự ")
   @Column(name = "question_code", unique = true, updatable = false, nullable = false)
   private String questionCode;

   @NotEmpty(message = "Nhập nội dung câu hỏi")
   @Column(name = "question_content", nullable = false)
   private String questionContent;

   @NotEmpty(message = "Nhập tên môn học")
   @Column(name = "subject", nullable = false)
   private String subject;

   @NotNull(message = "Nhập số điểm")
   @Range(min = 1, max = 10, message = "Nhập điểm từ 1 đến 10")
   @Column(name = "mark", nullable = false)
   private int mark;

   @Temporal(TemporalType.TIMESTAMP)
   @CreatedDate
   @Column(name = "created_at", nullable = true, updatable = false)
   @JsonFormat(pattern = "dd-MM-yyyy")
   private Date createdAt;

   @OneToMany(targetEntity = Answer.class, cascade = CascadeType.ALL)
   @JoinColumn(name = "question_id")
   private Set<Answer> answers;

   @PreRemove
   public void checkAnswerAssociationBeforeRemoval() {
      if (!this.answers.isEmpty()) {
         throw new RuntimeException("Can't remove a question that has answer.");
      }
   }

   public Question() {
   }

   public Question(long id, @NotEmpty(message = "Nhập mã câu hỏi") String questionCode,
         @NotEmpty(message = "Nhập nội dung câu hỏi") String questionContent, String subject,
         @NotEmpty(message = "Nhập số điểm") @Size(min = 1, max = 10, message = "Nhập điểm từ 1 đến 10") int mark,
         Date createdAt, Set<Answer> answers) {
      this.id = id;
      this.questionCode = questionCode;
      this.questionContent = questionContent;
      this.subject = subject;
      this.mark = mark;
      this.createdAt = createdAt;
      this.answers = answers;
   }

   public long getId() {
      return id;
   }

   public void setId(long id) {
      this.id = id;
   }

   public String getQuestionCode() {
      return questionCode;
   }

   public void setQuestionCode(String questionCode) {
      this.questionCode = questionCode;
   }

   public String getQuestionContent() {
      return questionContent;
   }

   public void setQuestionContent(String questionContent) {
      this.questionContent = questionContent;
   }

   public int getMark() {
      return mark;
   }

   public void setMark(int mark) {
      this.mark = mark;
   }

   public String getSubject() {
      return subject;
   }

   public void setSubject(String subject) {
      this.subject = subject;
   }

   public Date getCreatedAt() {
      return createdAt;
   }

   public void setCreatedAt(Date createdAt) {
      this.createdAt = createdAt;
   }

   public Set<Answer> getAnswers() {
      return answers;
   }

   public void setAnswers(Set<Answer> answers) {
      this.answers = answers;
   }

}
