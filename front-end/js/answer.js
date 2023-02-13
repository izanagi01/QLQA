'use strict';
/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
var gAnswerTable = $('#answer-table').DataTable({
  columns: [
    { data: 'id' },
    { data: 'answerCode' },
    { data: 'answerContent' },
    { data: 'explanation' },
    { data: 'correct' },
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
//bien toan cuc luu answer id
var gAnswerId = 0;
/*** REGION 2 - Vùng gán / thực thi sự kiện cho các elements */
$(document).ready(function () {
  //goi ham xu ly su kien khi load trang
  onPageLoading();
  //gan ham xu ly su kien khi thay doi cau hoi
  $('#select-question').change(onSelectQuestionChange);
  //gan ham xu ly su kien khi an nut them cau tra loi
  $('#btn-create-answer').on('click', function () {
    if (gQuestionId === 0) {
      alert('Vui lòng chọn câu hỏi cần thêm câu trả lời');
    } else {
      onBtnCreateAnswerClick();
    }
  });
  //gan ham xu ly su kien khi an nut detail
  $('#answer-table').on('click', '.btn-detail', function () {
    onBtnDetailClick(this);
  });
  //gan ham xu ly su kien khi an nut cap nhat cau tra loi
  $('#btn-update-answer').on('click', function () {
    onBtnUpdateAnswerClick();
  });
  //gan ham xu ly su kien khi an nut xoa cau hoi
  $('#answer-table').on('click', '.btn-delete', function () {
    onBtnDeleteClick(this);
  });
  //gan ham xu ly su kien khi an nut xoa tren modal xoa cau hoi
  $('#btn-delete-answer-modal').on('click', function () {
    onBtnDeleteAnswerClick();
  });
});
/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
//ham xu ly su kien khi load trang
function onPageLoading() {
  //goi api lay danh sach tat ca cau hoi
  getAllQuestion();
}
// ham xu ly su kien khi thay doi cau hoi
function onSelectQuestionChange(event) {
  gQuestionId = event.target.value;
  console.log(gQuestionId);
  if (gQuestionId === '0') {
    $.get(`http://127.0.0.1:8080/answer/all`, loadAnswerToTable);
  } else {
    $.get(
      `http://127.0.0.1:8080/question/${gQuestionId}/answers`,
      loadAnswerToTable
    );
  }
}
//ham xu ly su kien khi an nut them cau tra loi
function onBtnCreateAnswerClick() {
  gAnswerId = 0;
  //1. thu thap du lieu
  var vAnswerObj = getAnswerData();
  console.log(vAnswerObj);
  //2. kiem tra du lieu
  var isValidate = validateData(vAnswerObj);
  if (isValidate) {
    //3. goi api them cau hoi vao db
    callApiToCreateAnswer(vAnswerObj);
  }
}
//ham xu ly su kien khi an nut detail
function onBtnDetailClick(pElement) {
  var vCurrentRow = $(pElement).closest('tr');
  var vCurrentRowData = gAnswerTable.row(vCurrentRow).data();
  gAnswerId = vCurrentRowData.id;
  $('#input-answer-code').prop('disabled', 'disabled');
  $.get(`http://127.0.0.1:8080/answer/${gAnswerId}`, loadAnswerToInput);
}
//ham xu ly su kien khi an nut cap nhat cau tra loi
function onBtnUpdateAnswerClick() {
  //1. thu thap du lieu
  var vAnswerObj = getAnswerData();
  console.log(vAnswerObj);
  //2. kiem tra du lieu
  var isValidate = validateData(vAnswerObj);
  if (isValidate) {
    //3. goi api them cau hoi vao db
    callApiToUpdateAnswer(gAnswerId, vAnswerObj);
  }
}
//ham xu ly su kien khi an nut xoa cau hoi
function onBtnDeleteClick(pElement) {
  $('#modal-delete-answer').modal('show');
  var vCurrentRow = $(pElement).closest('tr');
  var vCurrentRowData = gAnswerTable.row(vCurrentRow).data();
  gAnswerId = vCurrentRowData.id;
}
//ham xu ly su kien khi an nut xoa tren modal xoa cau hoi
function onBtnDeleteAnswerClick() {
  $.ajax({
    url: `http://127.0.0.1:8080/answer/delete/${gAnswerId}`,
    method: 'DELETE',
    success: function () {
      alert(`Đã xóa thành công câu trả lời với id: ${gAnswerId}`);
      $('#modal-delete-answer').modal('hide');
      $.get(
        `http://127.0.0.1:8080/question/${gQuestionId}/answers`,
        loadAnswerToTable
      );
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
    success: responseData => {
      //load du lieu len select cau hoi
      loadDataToSelectQuestion(responseData);
    },
    error: function (error) {
      console.log(error.responseText);
    },
  });
}
//ham load du lieu len select cau hoi
function loadDataToSelectQuestion(pQuestionList) {
  var vSelectQuestionElement = $('#select-question');
  for (var bIndex = 0; bIndex < pQuestionList.length; bIndex++) {
    var bOption = $(
      `<option value='${pQuestionList[bIndex].id}'>${pQuestionList[bIndex].questionContent}</option>`
    );
    bOption.appendTo(vSelectQuestionElement);
  }
}
//ham load danh sach cau hoi len datatable
function loadAnswerToTable(pAnswerList) {
  console.log(pAnswerList);
  gAnswerTable.clear();
  gAnswerTable.rows.add(pAnswerList);
  gAnswerTable.draw();
}
//ham load du lieu answer len input
function loadAnswerToInput(pAnswerObj) {
  console.log(pAnswerObj);
  $('#input-answer-code').val(pAnswerObj.answerCode);
  $('#input-answer-content').val(pAnswerObj.answerContent);
  $('#input-explanation').val(pAnswerObj.explanation);
  pAnswerObj.correct === true
    ? $('#select-is-correct').val('1')
    : $('#select-is-correct').val('0');
}
//ham thu thap du lieu
function getAnswerData() {
  var vAnswerObj = {
    answerCode: '',
    answerContent: '',
    explanation: '',
    correct: '',
  };
  vAnswerObj.answerCode = $('#input-answer-code').val().trim();
  vAnswerObj.answerContent = $('#input-answer-content').val().trim();
  vAnswerObj.explanation = $('#input-explanation').val().trim();
  vAnswerObj.correct = parseInt($('#select-is-correct').val());

  return vAnswerObj;
}
//ham kiem tra du lieu
function validateData(pAnswerObj) {
  var vResult = true;
  try {
    if (pAnswerObj.answerCode === '') {
      vResult = false;
      throw 'Mã câu trả lời không được để trống';
    }
    if (pAnswerObj.answerCode.length < 2) {
      vResult = false;
      throw 'Mã câu trả lời phải có ít nhất 2 kí tự';
    }
    if (pAnswerObj.answerContent === '') {
      vResult = false;
      throw 'Nội dung câu trả lời không được để trống';
    }
    if (pAnswerObj.explanation === '') {
      vResult = false;
      throw 'Giải thích cho câu trả lời không được để trống';
    }
    if (pAnswerObj.correct === -1) {
      vResult = false;
      throw 'Vui lòng chọn đúng - sai cho câu trả lời';
    }
  } catch (error) {
    alert(error);
  }
  return vResult;
}

//ham goi api them cau tra loi vao db
function callApiToCreateAnswer(pAnswerObj) {
  $.ajax({
    url: 'http://127.0.0.1:8080/answer/create/' + gQuestionId,
    method: 'POST',
    data: JSON.stringify(pAnswerObj),
    contentType: 'application/json',
    success: function () {
      alert(`Đã thêm thành công câu trả lời`);
      $.get(
        `http://127.0.0.1:8080/question/${gQuestionId}/answers`,
        loadAnswerToTable
      );
      resetAnswerInput();
    },
    error: function (err) {
      alert('Đã tồn tại mã câu trả lời, vui lòng chọn mã khác');
      console.log(err.responseText);
    },
  });
}
//ham goi api cap nhat cau tra loi vao db
function callApiToUpdateAnswer(pAnswerId, pAnswerObj) {
  $.ajax({
    url: `http://127.0.0.1:8080/answer/update/${pAnswerId}`,
    method: 'PUT',
    data: JSON.stringify(pAnswerObj),
    contentType: 'application/json',
    success: function () {
      alert(`Đã cập nhật thành công câu trả lời có id: ${pAnswerId}`);
      $.get(
        `http://127.0.0.1:8080/question/${gQuestionId}/answers`,
        loadAnswerToTable
      );
      $('#input-answer-code').prop('disabled', false);
      resetAnswerInput();
    },
    error: function (err) {
      console.log(err.responseText);
    },
  });
}
//ham reset input tren modal quan ly cau hoi
function resetAnswerInput() {
  $('#input-answer-code').val('');
  $('#input-answer-content').val('');
  $('#input-explanation').val('');
  $('#select-is-correct').val('NOT-SELECTED');
}
