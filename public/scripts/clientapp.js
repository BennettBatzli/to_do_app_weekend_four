$(document).ready(function() {
  getData();
  $('#submit-task').on('click', createNewTask);
  $('.container').on('click', '.delete-task', deleteTask);
  $('.container').on('click', '.complete-task', completeTask);
});

function createNewTask(){

  event.preventDefault();
  var values = {};

  $.each($('#create-task-form').serializeArray(), function (i, field) {
    values[field.name] = field.value;
  });

  $.ajax({
    type: 'POST',
    url: '/taskRoute',
    data: values,
    success: function (data) {
      if(data) {
        getData();
      } else {
        console.log('error');
      }
    }

  });
console.log(values);

  $('#task_name').val('');

}

function getData() {
  $.ajax({
    type: 'GET',
    url: '/taskRoute',
    success: function (data) {
      console.log("here's data::: ", data);
      appendDOM(data);

    }

  });
}

function appendDOM(data){

  $('.container').empty();
  for (var i = 0; i < data.length; i++) {
    $('.container').append('<div class="active-task"></div>');
    var $el = $('.container').children().last();
    $el.append('<p>' + data[i].id + ' ' + data[i].task_name + '</p><br>' +
      '<button class="complete-task" data-id="' + data[i].id + '">Complete</button><br>' +
      '<button class="delete-task" data-id="' + data[i].id + '">Delete</button>');
    if(data[i].complete == false ){
    console.log('hi');
    } else {
      $el.toggleClass('completed');
      $el.toggleClass('active-task');

      $el.find('.complete-task').remove();
    }
  }
}


function completeTask() {
  var completeID = {};
  completeID.id = $(this).data('id');
  var $el = $(this).parent();
  console.log('this is completeID:: ', completeID);
  $.ajax({
    type: 'PUT',
    url: '/taskRoute',
    data: completeID,
    success: function (data) {
      if(data) {
        console.log("data after complete button:: ", data);
        $el.toggleClass('completed');
        $el.toggleClass('active-task');

        $el.find('.complete-task').remove();
      } else {
        console.log('error');
      }
    }

  });
}

function deleteTask() {
  var deleteID = {};
  deleteID.id = $(this).data('id');
  console.log('this is the delete ID: ' + deleteID);

  $(this).parent().fadeOut(500, function () {
    $(this).remove();
  });

  $.ajax({
    type: 'DELETE',
    url: '/taskRoute',
    data: deleteID,
    success: function (data) {
      if(data) {
        return data;
      } else {
        console.log('error');
      }
    }

  });

}
