'use strict';
/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
var gQuestionTable = $('#question-table').DataTable({
  columns: [
    { data: 'id' },
    { data: 'questionCode' },
    { data: 'questionContent' },
    { data: 'subject' },
    { data: 'mark' },
    { data: 5 },
  ],
  columnDefs: [
    {
      //xu ly cot action co nut xoa
      targets: 5,
      className: 'text-center',
      defaultContent: `
          <i title="Chi tiết" class="fas fa-edit text-info btn-detail" style="cursor: pointer"></i>
          &nbsp;
          <i title="Xóa" class="fas fa-trash text-danger btn-delete" style="cursor: pointer"></i>
       `,
    },
  ],
});
//bien toan cuc luu question id
var gQuestionId = 0;
/*** REGION 2 - Vùng gán / thực thi sự kiện cho các elements */
$(document).ready(function () {
  //goi ham xu ly su kien khi load trang
  onPageLoading();
  //gan ham xu ly su kien khi an nut them cau hoi
  $('#btn-create-question').on('click', function () {
    gQuestionId = 0;
    onBtnCreateQuestionClick();
  });
  //gan ham xu ly su kien khi an nut cap nhat cau hoi
  $('#btn-update-question').on('click', function () {
    if (gQuestionId === 0) {
      alert('Vui lòng chọn câu hỏi để cập nhật');
    } else {
      onBtnUpdateQuestionClick();
    }
  });
  //gan ham xu ly su kien khi an nut detail
  $('#question-table').on('click', '.btn-detail', function () {
    onBtnDetailClick(this);
  });
  //gan ham xu ly su kien khi an nut xoa cau hoi
  $('#question-table').on('click', '.btn-delete', function () {
    onBtnDeleteClick(this);
  });
  //gan ham xu ly su kien khi an nut xoa tren modal xoa cau hoi
  $('#btn-delete-question-modal').on('click', function () {
    onBtnDeleteQuestionClick();
  });
});
/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
//ham xu ly su kien khi load trang
function onPageLoading() {
  //goi api lay danh sach tat ca cau hoi
  getAllQuestion();
}
//ham xu ly su kien khi an nut them cau hoi
function onBtnCreateQuestionClick() {
  //1. thu thap du lieu
  var vQuestionObj = getQuestionData();
  console.log(vQuestionObj);
  //2. kiem tra du lieu
  var isValidate = validateData(vQuestionObj);
  if (isValidate) {
    //3. goi api them cau hoi vao db
    callApiToCreateQuestion(vQuestionObj);
  }
}
//ham xu ly su kien khi an nut detail
function onBtnDetailClick(pElement) {
  var vCurrentRow = $(pElement).closest('tr');
  var vCurrentRowData = gQuestionTable.row(vCurrentRow).data();
  gQuestionId = vCurrentRowData.id;
  $.get(`http://127.0.0.1:8080/question/${gQuestionId}`, loadQuestionToInput);
}
//ham xu ly su kien khi an nut cap nhat cau hoi
function onBtnUpdateQuestionClick() {
  //1. thu thap du lieu
  var vQuestionObj = getQuestionData();
  console.log(vQuestionObj);
  //2. kiem tra du lieu
  var isValidate = validateData(vQuestionObj);
  if (isValidate) {
    //3. goi api them cau hoi vao db
    callApiToUpdateQuestion(gQuestionId, vQuestionObj);
  }
}
//ham xu ly su kien khi an nut xoa cau hoi
function onBtnDeleteClick(pElement) {
  $('#modal-delete-question').modal('show');
  var vCurrentRow = $(pElement).closest('tr');
  var vCurrentRowData = gQuestionTable.row(vCurrentRow).data();
  gQuestionId = vCurrentRowData.id;
}
//ham xu ly su kien khi an nut xoa tren modal xoa cau hoi
function onBtnDeleteQuestionClick() {
  $.ajax({
    url: `http://127.0.0.1:8080/question/delete/${gQuestionId}`,
    method: 'DELETE',
    success: function () {
      alert(`Đã xóa thành công câu hỏi với id: ${gQuestionId}`);
      $('#modal-delete-question').modal('hide');
      $.get(`http://127.0.0.1:8080/question/all`, loadDataToTable);
    },
    error: function (err) {
      console.log(err.responseText);
      alert('Cần xóa toàn bộ câu trả lời của câu hỏi này trước');
    },
  });
}
/*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/
//ham goi api lay danh sach tat ca cau hoi
function getAllQuestion() {
  $.ajax({
    url: 'http://127.0.0.1:8080/question/all',
    method: 'GET',
    dataType: 'JSON',
    success: function (responseData) {
      //load du lieu len bang
      loadDataToTable(responseData);
    },
    error: function (error) {
      console.log(error.responseText);
    },
  });
}
//ham load du lieu len bang
function loadDataToTable(pQuestionList) {
  gQuestionTable.clear();
  gQuestionTable.rows.add(pQuestionList);
  gQuestionTable.draw();
}
//ham load du lieu answer len input
function loadQuestionToInput(pQuestionObj) {
  $('#input-question-code').val(pQuestionObj.questionCode);
  $('#input-question-content').val(pQuestionObj.questionContent);
  $('#input-subject').val(pQuestionObj.subject);
  $('#input-mark').val(pQuestionObj.mark);
}
//ham thu thap du lieu
function getQuestionData() {
  var vQuestionObj = {
    questionCode: '',
    questionContent: '',
    subject: '',
    mark: -1,
  };

  vQuestionObj.questionCode = $('#input-question-code').val().trim();
  vQuestionObj.questionContent = $('#input-question-content').val().trim();
  vQuestionObj.subject = $('#input-subject').val().trim();
  vQuestionObj.mark = parseInt($('#input-mark').val());

  return vQuestionObj;
}
//ham kiem tra du lieu
function validateData(pQuestionObj) {
  var vResult = true;
  try {
    if (pQuestionObj.questionCode === '') {
      vResult = false;
      throw 'Mã câu hỏi không được để trống';
    }
    if (pQuestionObj.questionCode.length < 2) {
      vResult = false;
      throw 'Mã câu hỏi phải có ít nhất 2 kí tự';
    }
    if (pQuestionObj.questionContent === '') {
      vResult = false;
      throw 'Nội dung câu hỏi không được để trống';
    }
    if (pQuestionObj.subject === '') {
      vResult = false;
      throw 'Môn học không được để trống';
    }
    if (isNaN(pQuestionObj.mark)) {
      vResult = false;
      throw 'Điểm số phải là số';
    }
    if (pQuestionObj.mark < 1 || pQuestionObj.mark > 10) {
      vResult = false;
      throw 'Điểm số phải là số từ 1 đến 10';
    }
  } catch (error) {
    alert(error);
  }
  return vResult;
}

//ham goi api them cau hoi vao db
function callApiToCreateQuestion(pQuestionObj) {
  $.ajax({
    url: 'http://127.0.0.1:8080/question/create',
    method: 'POST',
    data: JSON.stringify(pQuestionObj),
    contentType: 'application/json',
    success: function (responseData) {
      //4. xu ly hien thi front-end
      alert(`Đã thêm thành công câu hỏi`);
      resetQuestionInput();
      $.get(`http://127.0.0.1:8080/question/all`, loadDataToTable);
    },
    error: function (err) {
      alert('Đã tồn tại mã câu hỏi, vui lòng chọn mã khác');
      console.log(err.responseText);
    },
  });
}
//ham goi api cap nhat cau hoi vao db
function callApiToUpdateQuestion(pQuestionId, pQuestionObj) {
  $.ajax({
    url: `http://127.0.0.1:8080/question/update/${pQuestionId}`,
    method: 'PUT',
    data: JSON.stringify(pQuestionObj),
    contentType: 'application/json',
    success: function () {
      //4. xu ly hien thi front-end
      alert(`Đã cập nhât thành công câu hỏi với id: ${pQuestionId}`);
      resetQuestionInput();
      $.get(`http://127.0.0.1:8080/question/all`, loadDataToTable);
    },
    error: function (err) {
      console.log(err.responseText);
    },
  });
}
//ham reset input tren modal quan ly cau hoi
function resetQuestionInput() {
  $('#input-question-code').val('');
  $('#input-question-content').val('');
  $('#input-subject').val('');
  $('#input-mark').val('');
}
