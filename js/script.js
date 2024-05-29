$(function(){

    const url = 'https://mazarebadri.com/apitest/admin/admin_GetComplainList.php'
    const url2 = `${window.location.origin}/data.json`

    $("#filterByCompanyArea").multiselect({ multiple: true }); 
    $("#filterByServiceType").multiselect({ multiple: true }); 
  
        // $("form").bind("submit", function () { 
        //     $("#selectResultID").html( 
        //         "<b>Options selected : </b>"  
        //         + $(this).serialize()); 
        //     return false; 
        // });

    // Get values from the form
    var searchKeyword = $('#tableSearch').val();
    // var page = $('#perPageDropdown').val();
    var page = 1;
    var fromDate = $('#startDate').val();
    var toDate = $('#endDate').val();
    var companyArea = $("#filterByCompanyArea").val().map(d => d);
    var serviceType = $("#filterByServiceType").val().map(d => d);

    // 
    var total_page = 5;

    // Prepare the filters
    var filters = () => {
        return {
            data: [
                {
                    filter: 'company_area',
                    values: companyArea
                },
                {
                    filter: 'service_type',
                    values: serviceType
                }
            ]
        }
    };

    // Prepare the payload
    var data = () => {
        return {
            SearchKeyword: searchKeyword,
            page: page,
            fromdate: fromDate,
            todate: toDate,
            filters: JSON.stringify(filters())
        }
    };

    const tableCode = (dataIndex, td1, td2, td3, td4, td5, td6, td7, td8, td9, td10, td11, td12, td13) => {
        return `
        <tr data-index="${dataIndex}" data-complaint-date="${td3}">
            <td>${td1}</td>
            <td>${td2}</td>
            <td>${td3}</td>
            <td>${td4}</td>
            <td>${td5}</td>
            <td>${td6}</td>
            <td data-company-area="${td7}">${td7}</td>
            <td>${td8}</td>
            <td>${td9}</td>
            <td data-service-type="${td10}">${td10}</td>
            <td>${td11}</td>
            <td>${td12}</td>
            <td>${td13}</td>
        </tr>`
    }

    const generatePagination = () => {
        let prevBtn = `<li class="pagination-item" id="paginationPrevBtn"><a class="pagination-link" href="javascript:void(0)">Prev</a></li>`

        let nextBtn = `<li class="pagination-item" id="paginationNextBtn"><a class="pagination-link" href="javascript:void(0)">Next</a></li>`

        let btns = '';
        let activeClass = ''
        for (let i = 1; i <= total_page; i++) {
            i === 1 ? activeClass = 'active' : activeClass = '';
            btns += `<li class="pagination-item pagination-numeric-item ${activeClass}" id="octapro-pagination-item${i}"><a class="pagination-link" href="javascript:void(0)">${i}</a></li>`
        }

        // $("#pagination")[0].innerHTML = `${prevBtn} ${btns} ${nextBtn}`
        $(".octapro-pagination")[0].innerHTML = `${prevBtn} ${btns} ${nextBtn}`

        $(`.octapro-pagination .pagination-numeric-item`).each(function(i,d) {
            $(d).removeClass("active")
        })
        $($(`.octapro-pagination #octapro-pagination-item${page}`)[0]).addClass("active")

        page === 1 ? $($(".octapro-pagination #paginationPrevBtn")[0]).addClass("disabled") : $($(".octapro-pagination #paginationPrevBtn")[0]).removeClass("disabled")
        page === total_page ? $($(".octapro-pagination #paginationNextBtn")[0]).addClass("disabled") : $($(".octapro-pagination #paginationNextBtn")[0]).removeClass("disabled")

        $(".table-list-details")[0].innerText = `Showing ${NaN} to ${NaN} of ${NaN}`

        $("#paginationPrevBtn").on("click", function(){
            if (page === 1) return
            page--
            fetchAPI()
        })
    
        $("#paginationNextBtn").on("click", function(){
            if (page === total_page) return
            page++
            fetchAPI()
        })
    
        $(".pagination-numeric-item").each(function(i,e) {
            $(e).on("click", function(){
                page = parseInt($(this)[0].innerText)
                fetchAPI()
            })
        })
    }

    function fetchAPI() {
        // event.preventDefault();

        // Perform the AJAX request
        $.ajax({
            url: url2,
            // type: 'POST',
            type: 'GET',
            data: data(),
            dataType: 'json',
            success: function(response) {
                if (response.status) {
                $(".octapro-table tbody")[0].innerHTML = ''
                $(response.data).each(function(i,d){
                    $(".octapro-table tbody")[0].innerHTML += tableCode(i, d.id, d.comp_no, d.comp_date, d.inv_type, d.company_name, d.company_add, d.company_area, d.company_mo, d.eng_name, d.service_type, d.servicedate, d.problem, d.status)
                })
                // $('#results').html('<pre>' + JSON.stringify(response.data, null, 2) + '</pre>');
                generatePagination()

            } else {
                $(".octapro-table tbody")[0].innerHTML = "<tr><td colspan='9'>No data found</td></tr>"
            }
            },
            error: function(xhr, status, error) {
            console.error('AJAX Error:', status, error);
            $(".octapro-table tbody")[0].innerHTML = "<tr><td colspan='9'>Error fetching data. Please check console for details.</td></tr>"
            // Log the full error object to the console for debugging
            console.log(xhr, status, error);
            }
        });
    }
    fetchAPI()

    $('#tableSearch').on("keyup", function(){
        searchKeyword = $(this).val();
        fetchAPI()
    })

    $('#startDate').on("change", function(){
        console.log("startDate");
        fromDate = $(this).val();
        fetchAPI()
    })

    $('#endDate').on("change", function(){
        console.log("endDate");
        toDate = $(this).val();
        fetchAPI()
    })

    $("#filterByCompanyArea").on("change", function(){
        console.log("filter by company area");
        companyArea = $(this).val().map(d => d);
        fetchAPI()
    })

    $("#filterByServiceType").on("change", function(){
        console.log("filter by service type");
        serviceType = $(this).val().map(d => d);
        fetchAPI()
    })

    // navigation menu toggle JS
    let toggleBtnToggled = false;
    $(".octapro-menu-toggle").on("click", function(){
        if(!toggleBtnToggled) {
            $(".octapro-sidebar-container").css({"max-width": 0, "width":0})
            $(".octapro-sidebar").fadeOut(100)
            $(".octapro-header-container").css({"max-width": "100%"})
            toggleBtnToggled = true;
        } else {
            $(".octapro-sidebar-container").css({"max-width": "", "width":""})
            $(".octapro-sidebar").fadeIn(100)
            $(".octapro-header-container").css({"max-width": ""})
            toggleBtnToggled = false;
        }
    })


})