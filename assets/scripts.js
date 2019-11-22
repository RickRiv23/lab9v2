/*global $*/

//      FUNCTIONS
function selectAuthor(authorID){
    $.ajax({
        method: "GET",
        url: "/authorInfo",
        dataType: "json",
        data: { "authorId": authorID},
        success: function(result,status) {
          //alert(result[0].firstName);
          $("#authorName").html(result[0].firstName + " " + result[0].lastName);
          $("#bio").html(result[0].biography);
          $("#authorImg").attr("src", result[0].portrait);
          
          $('#authorModal').modal("show");
          
        }

    });//ajax
};

function searchQuotes(){
    let keyword = $("#searchTerm").val() ? $("#searchTerm").val() : "";
    let category = $("#searchCategory").val() ? $("#searchCategory").val() : "";
    let gender = $("#searchGender").val() ? $("#searchGender").val() : "";
    let author = $("#searchAuthor").val() ? $("#searchAuthor").val() : "";
    $.ajax({
        method: "GET",
        url: "/quotes",
        dataType: "json",
        data:{
            "searchTerm": keyword,
            "category": category,
            "gender": gender,
            "authorId": author
        },
        success: function(data){
            // alert(JSON.stringify(data));
            $(".js-quotes").html("");       //  Clear quotes
            if(data != ""){
                let quotes = buildQuotes(data);
                printQuotes(quotes);
            }
            else
                $(".js-quotes").html("<p>No Quotes Found</p>");
        }
    });
}

function buildQuotes(quotes){
    let createdQuotes = [];
    
    for(let i = 0; i < quotes.length; i++){
        createdQuotes[i] = `
            <div class="quote-wrapper">
                <i>${quotes[i].quote}"</i> <br>
                <a href="#" class="js-select-quote" id="${quotes[i].authorId}">-${quotes[i].firstName} ${quotes[i].lastName} </a>
            </div>
            <br><br>
        `;
    }
    
    return createdQuotes;
}

function printQuotes(quotes){
    // quotes.forEach( function(i, quote){
        $(".js-quotes").append(quotes);
    // });
}


//      HANDLERS
$(".js-search-btn").on("click", function(e){
    e.preventDefault();
    searchQuotes();
});

$(document).on("click", ".js-select-quote", function(){
    let authorID = $(this).attr("id");
    selectAuthor(authorID);
});