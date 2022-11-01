$(function () {
    var root = "../../../";
    var controller = "Home/";
    var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });
    var how = buildIbans('Netherlands');
    $(".txt_iban").val(how);

    function clearbank() {
        $(".txt_amt").val('');
        $(".txt_accountno").val('');
        $(".txt_accountname").val('');
        $(".ddl_bank").val('');
    }
    function checkaddbank() {
        var rbool = false;
        if ($(".txt_amt").val() != "" && $(".txt_accountno").val() != "" && $(".txt_accountname").val() != "" && $(".ddl_bank").val() != "" ) {
            rbool = true;
        }
        return rbool;
    }
    function checknotexistingbank() {
        var rbool = true;
        $(".tbl_bank tbody tr").each(function () {
            var bank = $(this).find(".iddl_bank").text();
            var accountname = $(this).find(".itxt_accountname").text();
            var accountno = $(this).find(".itxt_accountno").text();
            if ($(".txt_accountno").val() == accountno && $(".txt_accountname").val() == accountname && $(".ddl_bank").val() == bank) {
                rbool = false;
                return rbool;
            }
        });
        return rbool;
    }
    function addbank() {
        var str = "";
        str = str + "<tr>";
        str = str + "<td class='iddl_bank'>" + $(".ddl_bank").val()+"</td>";
        str = str + "<td class='itxt_accountname'>" + $(".txt_accountname").val() + "</td>";
        str = str + "<td class='itxt_accountno'>" + $(".txt_accountno").val() + "</td>";
        str = str + "<td class='itxt_amt'>" + $(".txt_amt").val() + "</td>";
        str = str + "<td><input type='button' class='btn btn-link btn_deletebank' value='Delete'/></td>";
        str = str + "</tr>";

        $(".tbl_bank tbody").append(str);
    }
    function checksave() {
        var rbool = false;
        if ($(".txt_fullname").val() != "" && $(".txt_iban").val() != "" ) {
            var i = 0;
            $(".tbl_bank tbody tr").each(function () {
                i++;
            });
            if (i > 0) {
                rbool = true;
            }
        }
        return rbool;
    }
    
    

    $(document).on("click", ".btn_addbank", function () {
        $(".div_bank").show();
    });

    $(document).on("click", ".btn_cancelbank", function () {
        clearbank();
        $(".div_bank").hide();
    });
    $(document).on("click", ".btn_insertbank", function () {
        if (checkaddbank()) {
            if (checknotexistingbank()) {
                addbank();
            } else {
                PopInfo('addbankwarn', 'You have bank account data please use other bank account.');
            }
        } else {
            PopInfo('addbankwarn', 'You must fill all bank account data before add new bank account.');
        }
    });
    $(document).on("click", ".btn_deletebank", function () {
        $(this).parent().parent().remove();
    });

    $(document).on("click", ".btn_save", function () {
        if (checksave()) {
            save();
        } else {
            PopInfo('addbankwarn', 'You must fill customer name or have bank data before create new customer.');
        }
    });
    
   
    $(document).on("input", ".decimal", function () {
        this.value = this.value.replace(/[^\d.]/g, '');
    });
    $(document).on("keyup", ".decimal", function () {
        $(this).val(format($(this).val()));
    });
    $(document).on("blur", ".decimal", function () {
        if ($(this).val() != "") {
            $(this).val(currencyFormat(removeComma($(this).val())));
        }

    });

    function save() {
        var iban = "";
        var accounts = [];
        $(".tbl_bank tbody tr").each(function () {
            accounts.push({ bankname: $(this).find(".iddl_bank").text(), accountname: $(this).find(".itxt_accountname").text(), accountno: $(this).find(".itxt_accountno").text(), amt: $(this).find(".itxt_amt").text()});
        });
        var data = {
            iban: $(".txt_iban").val(),
            fullname: $(".txt_fullname").val(),
            accounts: accounts,
        }

        $.ajax({
            url: root + controller + 'CreateCustomer',
            type: 'POST',
            data: data,
            async: true,
            success: function (data) {
                //Goto Index Page
                if (data.status) {
                    PopSuccess('save', 'บันทึก ' + $(".txt_iban").val() + ' เรียบร้อย');
                    cleardata();
                } 
            },
            error: function (e) {
                if (e.status == 401) {
                    var sessionTimeOut = '' + $("#prefix_path").val() + '/Login/Login';
                    document.location.href = sessionTimeOut;
                }
                else {
                }
            },
            complete: function () {
            }
        });

    }
    function cleardata() {
        $(".txt_iban").val(buildIbans('Netherlands'));
        $(".txt_fullname").val('');
        $(".tbl_bank tbody").empty();
        clearbank();
        $(".div_bank").hide();
    }
    
    function currencyFormat(num) {
        if (num != null) {
            return parseFloat(removeComma(num.toString())).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        } else {
            return num
        }

    }
    function removeComma(str) {
        if (str != "" && str != null) {
            return str.replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "");
        } else {
            return str;
        }

    }
    function PopInfo(type, word) {
        if (type == "addbankwarn") {
            Swal.fire(
                'Please fill data before add bank!',
                word,
            )
        } 
    }
    function PopSuccess(type, word) {
        if (type == "save") {
            Swal.fire(
                'Created customer success!',
                word,
                'success'
            )
        } 
        //Swal.fire({
        //    position: 'top-end',
        //    icon: 'success',
        //    title: word,
        //    showConfirmButton: false,
        //    timer: 1500
        //});
    }
    function format(num) {
        var str = num.toString().replace("$", ""), parts = false, output = [], i = 1, formatted = null;
        if (str.indexOf(".") > 0) {
            parts = str.split(".");
            str = parts[0];
        }
        str = str.split("").reverse();
        for (var j = 0, len = str.length; j < len; j++) {
            if (str[j] != ",") {
                output.push(str[j]);
                if (i % 3 == 0 && j < (len - 1)) {
                    output.push(",");
                }
                i++;
            }
        }
        formatted = output.reverse().join("");
        return (formatted + ((parts) ? "." + parts[1].substr(0, 2) : ""));
    }
});


