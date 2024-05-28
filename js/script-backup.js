$(function(){

    const url = "http://192.168.1.9:1000/apitest/admin/admin_GetComplainList.php"
    const url2 = "http://octaprosolution.com/apitest/admin/admin_GetComplainList.php"
    const url3 = "https://dargahakimi.org/apitest/admin/admin_GetComplainList.php"
    const url4 = `${window.location.origin}/data.json`

    const postOptions = {
        method:"POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            test: "test"
        })
    }

    const fetchAPI = async () => {
        const api = axios.get(url4)
        try {
            let response = await api
            let data = response.data

            // table JS
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

            $(data.data).each(function(i,d){
                $(".octapro-table tbody")[0].innerHTML += tableCode(i, d.id, d.comp_no, d.comp_date, d.inv_type, d.company_name, d.company_add, d.company_area, d.company_mo, d.eng_name, d.service_type, d.servicedate, d.problem, d.status)
            })

            // Date filter JS
            const startDateInput = document.getElementById('startDate');
            const endDateInput = document.getElementById('endDate');

            startDateInput.addEventListener('input', filterList);
            endDateInput.addEventListener('input', filterList);

            function filterList() {
                const startDate = startDateInput.value;
                const endDate = endDateInput.value;

                $(".octapro-table tbody tr[data-complaint-date]").filter(function() {
                    const itemDate = $(this)[0].dataset.complaintDate
                    $(this).toggle(itemDate >= startDate && itemDate <= endDate)
                });

            }

            // pagination JS
            let itemsPerPage = $("#perPageDropdown")[0].value;
            let page_number = 1;
            const totalListItems = $(".octapro-table tbody tr").length;
            const totalTableRows = document.querySelectorAll(".octapro-table tbody tr");
            let total_page = Math.ceil(totalListItems / itemsPerPage)
            

            function generatePagination() {

                let prevBtn = `<li class="pagination-item" id="paginationPrevBtn"><a class="pagination-link" href="javascript:void(0)">Prev</a></li>`

                let nextBtn = `<li class="pagination-item" id="paginationNextBtn"><a class="pagination-link" href="javascript:void(0)">Next</a></li>`

                let btns = '';
                let activeClass = ''
                for (let i = 1; i <= total_page; i++) {
                    i === 1 ? activeClass = 'active' : activeClass = '';
                    btns += `<li class="pagination-item pagination-numeric-item ${activeClass}" id="octapro-pagination-item${i}"><a class="pagination-link" href="javascript:void(0)">${i}</a></li>`
                }

                $("#pagination")[0].innerHTML = `${prevBtn} ${btns} ${nextBtn}`
            }

            function displayListItems() {
                let start_index = (page_number - 1) * itemsPerPage
                let end_index = start_index + (itemsPerPage - 1)
                if (end_index >= totalListItems) end_index = totalListItems - 1
                let statement = ''
                for (let i = start_index; i <= end_index; i++) {
                    statement += `<tr data-index="${i+1}">${totalTableRows[i].innerHTML}</tr>`
                }
                $(".octapro-table tbody")[0].innerHTML = statement

                $(`.octapro-pagination .pagination-numeric-item`).each(function(i,d) {
                    $(d).removeClass("active")
                })
                $($(`.octapro-pagination #octapro-pagination-item${page_number}`)[0]).addClass("active")

                page_number === 1 ? $($(".octapro-pagination #paginationPrevBtn")[0]).addClass("disabled") : $($(".octapro-pagination #paginationPrevBtn")[0]).removeClass("disabled")
                page_number === total_page ? $($(".octapro-pagination #paginationNextBtn")[0]).addClass("disabled") : $($(".octapro-pagination #paginationNextBtn")[0]).removeClass("disabled")

                $(".table-list-details")[0].innerText = `Showing ${start_index + 1} to ${end_index + 1} of ${totalListItems}`
            }
            generatePagination()
            displayListItems()

            $("#paginationPrevBtn").on("click", function(){
                if (page_number === 1) return
                page_number--
                displayListItems()
            })
            $("#paginationNextBtn").on("click", function(){
                if (page_number === total_page) return
                page_number++
                displayListItems()
            })

            $(".pagination-numeric-item").each(function(i,e) {
                $(e).on("click", function(){
                    page_number = parseInt($(this)[0].innerText)
                    displayListItems()
                })
            })

            $("#perPageDropdown").on("change", function(e){
                itemsPerPage = parseInt($(this).val())
                total_page = Math.ceil(totalListItems / itemsPerPage)
                page_number = 1;
                generatePagination()
                displayListItems()
            })
            
            
        } catch(error){
            console.log(error);
        }
    }
    fetchAPI()

    let toggleBtnToggled = false;
    $(".octapro-menu-toggle").on("click", function(){
        if(!toggleBtnToggled) {
            $(".octapro-sidebar-container").removeClass("col-3").css({"width":0})
            $(".octapro-sidebar").fadeOut(100)
            // $(".octapro-sidebar").css({"padding":0, "display": "none"})
            $(".octapro-header-container").removeClass("col-9").addClass("col-12")
            $(".octapro-header-container .octapro-header-wrapper").removeClass("octapro-wrapper").addClass("common-wrapper")
            toggleBtnToggled = true;
        } else {
            $(".octapro-sidebar-container").addClass("col-3").css({"width":""})
            // $(".octapro-sidebar").css({"padding":"", "display": ""})
            $(".octapro-sidebar").fadeIn(650)
            $(".octapro-header-container").removeClass("col-12").addClass("col-9")
            $(".octapro-header-container .octapro-header-wrapper").removeClass("common-wrapper").addClass("octapro-wrapper")
            toggleBtnToggled = false;
        }
    })

    $("#tableSearch").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".octapro-table tbody tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $("#filterByCompanyArea").on("change", function() {
        var value = $(this).val().toLowerCase();
        $(".octapro-table tbody tr").filter(function() {
            if(value !== "default") {
                $(this).toggle($(this).find('[data-company-area]').text().toLowerCase().indexOf(value) > -1)
            } else {
                $(this).toggle(true)
            }
        });
    });

    $("#filterByServiceType").on("change", function() {
        var value = $(this).val().toLowerCase();
        $(".octapro-table tbody tr").filter(function() {
            if(value !== "default") {
                console.log($(this).find('[data-service-type]').text().toLowerCase() === value);
                $(this).toggle($(this).find('[data-service-type]').text().toLowerCase().indexOf(value) > -1)
            } else {
                $(this).toggle(true)
            }
        });
    });
    
})