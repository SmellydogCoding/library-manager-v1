"use strict()";

// select the student html containers and count them
var item = $('.item');
var initialNumber = item.length;

// sets whether pagination is the result of a search
var search = false;

// display the correct students when page numbers are clicked (or on page load)
// also sets active class on correct page number link
// after a search, only items that match the search will be paginated
function paginate(pageNumber) {
  var endIndex = pageNumber * 5 - 1;
  var startIndex = endIndex - 4;

  if (search){
    $('li.match:gt(' + endIndex + ')').addClass('hidden');
    if (pageNumber > 1) {
      $('li.match:lt(' + startIndex + ')').addClass('hidden');
    }
  } else {
    $('.item:gt(' + endIndex + ')').addClass('hidden');
    if (pageNumber > 1) {
      $('.item:lt(' + startIndex + ')').addClass('hidden');
    }
  }
  active(pageNumber);
}

var pageLinks;
function buildPageLinks(numberOfItems) {
  // set number of pages
  var pages = Math.ceil(numberOfItems / 5);

  //build the pagination navigation code block
  var pagination = $('.pagination');
  var paginationContent = '<td>Page: ';

  //create number of list items === number of pages
  for (var p = 1; p <= pages; ++p) {
    paginationContent += '<a class="pagelink"';
    // if (p === 1){ paginationContent += ' active';}
    paginationContent += ' href="#">' + p + '</a>';
  }

  // finish the pagination code block and fill the .pagination div with it
  paginationContent += '</td>';
  pagination.html(paginationContent);

  // select page number links and add event handler
  // show all students and then call the pagination function on click or
  // show all search matches and then call the pagination function on click
  // use a fade-in/fade-out transition
  pageLinks = $('.pagelink');
  pageLinks.click(function() {
    var pageNumber = $(this).text();
    $('.itemList').fadeOut(200, function(){
      if (search) {
        $('item').removeClass('hidden');
      } else {
        item.removeClass('hidden');
      }
      paginate(pageNumber);
    });
    $('.itemList').fadeIn();
  });
}

// set active class on current page
function active(pageNumber) {
  var page = pageNumber;
  pageLinks.each(function() {
    $(this).removeClass('active');
    if ($(this).text() === page) {
      $(this).addClass('active');
    }
  });
}

// set initial view to the first 10 students (initial view is page 1)
$(document).ready(function(){
  buildPageLinks(initialNumber);
  paginate('1');
  // show student search if the user's brower supports javascript
  var search = '<input placeholder="Search for students...">';
  search += '<button>Search</button>';
  $('.student-search').html(search);
  // attach click event to the search button and keyup event for dynamic searching to the search box
  $('.student-search button').click(studentSearch);
  $('.student-search input').keyup(studentSearch);
});

//search function
function studentSearch() {
  // get the text string from the search box, set search to true, initialize a counter for matches
  var query = ($('.student-search input').prop('value')).toLowerCase();
  search = true;
  var studentsFound = 0;
  // iteriate through each student
  $('.student-details').each(function(){
    // search resets:
      // hide the student (they will be shown if there is a match)
      // remove match flag in case of multiple searches (it will be added back if they are a match)
      // remove error message if last search had no matches
    $(this).parent().addClass('hidden');
    $(this).parent().removeClass('match');
    if ($('.student-item:first').hasClass('error')) {
      $('.student-item:first').detach();
    }
    // get the name and email
    var name = ($(this).children('h3').html()).toLowerCase();
    var email = ($(this).children('span.email').html()).toLowerCase();
    // create a new regular expression based on input from the search box and compare it to the name and email
    var re = new RegExp(query);
    var result1 = re.exec(name);
    var result2 = re.exec(email);
    // if there is a match, show student, make them as a match, and tick counter
    if (result1 !== null || result2 !== null) {
      $(this).parent().removeClass('hidden');
      $(this).parent().addClass('match');
      studentsFound += 1;
    }
  });
  // rebuild page links and repaginate after search
  buildPageLinks(studentsFound);
  paginate('1');

  // display message if there are no matches
  if (studentsFound === 0) {
    $('.student-list').prepend('<li class="student-item error">No Matches Found</li>');
  }
}