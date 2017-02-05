$('.update').submit(function(event) {
  event.preventDefault();
  let data = $('.update').serialize();
  $.ajax({
    url: "/books/update",
    method: "put",
    data: data,
    success: function(data) {
      console.log(data);
      window.location.href = '/books';
    }
  });
});