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
    url: '/to_do',
    data: values,
    success: function (data) {
      if(data) {
        //$('#container').empty();
        getData();
      } else {
        console.log('error');
      }
    }

  });
console.log(values);


}

function getData() {
  $.ajax({
    type: 'GET',
    url: '/to_do',
    success: function (data) {
      appendDOM(data);

    }

  });
}

function appendDOM(data){
  $('.container').empty();
  for (var i = 0; i < data.length; i++) {

    $('.container').prepend('<div class="active-task"><p>' + data[i].id + ' ' + data[i].task_name + '</p><br>' +
      '<button class="complete-task" data-id="' + data[i].id + '">Complete</button><br>' +
      '<button class="delete-task" data-id="' + data[i].id + '">Delete</button></div>');

  }
}


function completeTask() {
  var completeID = {};
  completeID.id = $(this).data('id');

  $.ajax({
    type: 'PUT',
    url: '/complete',
    data: completeID,
    success: function (data) {
      if(data) {
        //$('#container').empty();
        getData();
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

  //$(this).parent().fadeOut().remove();
  $(this).parent().fadeOut(500, function () {
    $(this).remove();
  });

  $.ajax({
    type: 'POST',
    url: '/remove',
    data: deleteID,
    success: function (data) {
      if(data) {
        //$('#container').empty();
        getData();
      } else {
        console.log('error');
      }
    }

  });

}

function doAThing() {
  $.ajax({
    type: 'GET',
    url: '/to_do',
    success: function (data) {


      return data.id;
    }
  });
}