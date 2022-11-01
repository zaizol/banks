$(function () {
    var root = "../../../";
    var controller = "Home/";
    var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });

    getCustomer();
    getTXN();

    $(document).on("click", ".btn_deposit", function () {
        $(".div_withdraw").hide();
        $(".div_transfer").hide();
        $(".div_deposit").show();
        cleardeposit();
        var iban = $(this).data("iban");
        getBank(iban);
    });
    $(document).on("click", ".btn_canceldeposit", function () {
        cleardeposit();
    });

    $(document).on("click", ".btn_savedeposit", function () {
        if (checkdeposit()) {
            save("deposit");
        } else {
            PopInfo('deposit', 'You must select bank or fill deposit amount before.');
        }
    });


    $(document).on("click", ".btn_withdraw", function () {
        $(".div_deposit").hide();
        $(".div_transfer").hide();
        $(".div_withdraw").show();
        clearwithdraw();
        var iban = $(this).data("iban");
        getBank(iban);
    });
    $(document).on("click", ".btn_cancelwithdraw", function () {
        clearwithdraw();
    });

    $(document).on("click", ".btn_savewithdraw", function () {
        if (checkwithdraw()) {
            save("withdraw");
        } else {
            PopInfo('withdraw', 'You must select bank or fill withdraw amount before.');
        }
    });

    $(document).on("click", ".btn_transfer", function () {
        var iban = $(this).data("iban");
        $(".div_deposit").hide();
        $(".div_withdraw").hide();
        $(".div_transfer").show();
        cleartransfer();
        $(".div_customer").show();
        $(".chk_owner").prop("checked", false);
        chk_owner(false, iban);
        $(".chk_owner").data("iban", iban);
        $(".fddl_bank").data("iban", iban);
       
        getBank(iban);
    });
    $(document).on("click", ".btn_canceltransfer", function () {
        cleartransfer();
    });

    $(document).on("click", ".btn_savetransfer", function () {
        if (checktransfer()) {
            save("transfer");
        } else {
            PopInfo('transfer', 'You must select bank or fill transfer amount before.');
        }
    });

    $(document).on("change", ".ddl_bank", function () {
        if ($(this).find("option:selected").val() != "") {
            var amt = $(this).find("option:selected").data("amt");
            $(".daccount").text(currencyFormat(amt));
            caldeposit();
        } else {
            cleardeposit();
        }
    });
    $(document).on("change", ".wddl_bank", function () {
        if ($(this).find("option:selected").val() != "") {
            var amt = $(this).find("option:selected").data("amt");
            $(".waccount").text(currencyFormat(amt));
            calwithdraw();
        } else {
            clearwithdraw();
        }

    });


    $(document).on("change", ".fddl_bank", function () {

        var isowner = $(".chk_owner").is(":checked");
        var iban = $(this).data("iban");
        if (isowner) {
            $(".div_customer").hide();
            getOwnerBankWithoutSelect(iban);
        } else {
            $(".div_customer").show();
            resettddl_bank();
        }
        cleartargetcus();
        if ($(this).find("option:selected").val() != "") {
            var amt = $(this).find("option:selected").data("amt");
            $(".taccount").text(currencyFormat(amt));
            caltransfer();
        } else {
            clearfbank();
        }
    });
    $(document).on("change", ".ddl_cus", function () {
        if ($(this).find("option:selected").val() != "") {
            var iban = $(this).val();
            getTargetBank(iban);
            caltransfer();
        } else {
            cleartargetcus();
        }
        
    });
    $(document).on("change", ".tddl_bank", function () {
        if ($(this).find("option:selected").val() != "") {
            var amt = $(this).find("option:selected").data("amt");
            $(".ttaccount").text(currencyFormat(amt));
            caltransfer();
        } else {
            cleartbank();
        }
    });


    $(document).on("blur", ".txt_deposit", function () {
        caldeposit();
    });
    $(document).on("keyup", ".txt_deposit", function () {
        caldeposit();
    });

    $(document).on("blur", ".txt_withdraw", function () {
        calwithdraw();
    });
    $(document).on("keyup", ".txt_withdraw", function () {
        calwithdraw();
    });

    $(document).on("blur", ".txt_transfer", function () {
        if (parseFloat(removeComma($(".txt_transfer").val())) > parseFloat(removeComma($(".taccount").text()))) {
            $(".txt_transfer").val($(".taccount").text())
            
        }
         caltransfer();
    });
    $(document).on("keyup", ".txt_transfer", function () {
        if (parseFloat(removeComma($(".txt_transfer").val())) > parseFloat(removeComma($(".taccount").text()))) {
            $(".txt_transfer").val($(".taccount").text())
        }
        caltransfer();
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

    
    $(document).on("change", ".chk_owner", function () {
        chk_owner($(this).is(":checked"), $(this).data("iban"));
    });
    function chk_owner(chk, iban) {
        var isowner = chk;
        if (isowner) {
            $(".div_customer").hide();
            //$(".div_moveowner").show();
            getOwnerBankWithoutSelect(iban);
        } else {
            //$(".div_moveowner").hide();
            $(".div_customer").show();
            resettddl_bank();
        }
        cleartargetcus();
    }

    function checkdeposit() {
        var rbool = false;
        if ($(".ddl_bank").val() != "" && $(".txt_deposit").val() != "") {
                rbool = true;
        }
        return rbool;
    }

    function checkwithdraw() {
        var rbool = false;
        if ($(".wddl_bank").val() != "" && $(".txt_withdraw").val() != "") {
            rbool = true;
        }
        return rbool;
    }
    function checktransfer() {
        var rbool = false;
        if ($(".fddl_bank").val() != "" && $(".txt_transfer").val() != "" && $(".tddl_bank").val() != "") {
            rbool = true;
        }
        return rbool;
    }

    function cleardeposit() {
        $(".ddl_bank").val("");
        $(".txt_deposit").val("");
        $(".daccount").text("");
        $(".dfee").text("");
        $(".dbalance").text("");
    }
    function clearwithdraw() {
        $(".wddl_bank").val("");
        $(".txt_withdraw").val("");
        $(".waccount").text("");
        $(".wbalance").text("");
    }
    function cleartransfer() {
        $(".fddl_bank").val("");
        $(".taccount").text("");
        $(".ttaccount").text("");
        $(".ddl_cus").val("");
        $(".tddl_bank").text("");
        $(".txt_transfer").val("");
        $(".tbalance").text("");
        $(".ttbalance").text("");
        //$(".chk_owner").prop("checked", false);
    }
    function clearfbank() {
        $(".fddl_bank").val("");
        $(".taccount").text("");
        $(".tbalance").text("");
    }
    function resettddl_bank() {
        $(".tddl_bank").empty();
    }
    function cleartargetcus() {
        $(".ddl_cus").val("");
        $(".tddl_bank").val("");
        $(".ttaccount").text("");
        $(".ttbalance").text("");
    }
    function cleartbank() {
        $(".tddl_bank").val("");
        $(".ttaccount").text("");
        $(".ttbalance").text("");
    }
    function caldeposit() {
        if ($(".txt_deposit").val() != "" && $(".daccount").text() != "") {
            var amt = parseFloat(removeComma($(".daccount").text()));
            var deposit = parseFloat(removeComma($(".txt_deposit").val()));
            var fee = deposit * 0.001;
            $(".dfee").text(currencyFormat(fee));
            $(".dbalance").text(currencyFormat((amt + deposit) - fee));
        } else {
            if ($(".txt_deposit").val() == "" && $(".daccount").text() != "") {
                var amt = parseFloat(removeComma($(".daccount").text()));
                $(".dfee").text("");
                $(".dbalance").text(currencyFormat(amt));
            } else if ($(".txt_deposit").val() != "" && $(".daccount").text() == "") {
                $(".dfee").text("");
                $(".dbalance").text("");
            } else {
                $(".dfee").text("");
                $(".dbalance").text("");
            }
        }
        
       
    }
    function calwithdraw() {
        if ($(".txt_withdraw").val() != "" && $(".waccount").text() != "") {
            var amt = parseFloat(removeComma($(".waccount").text()));
            var withdraw = parseFloat(removeComma($(".txt_withdraw").val()));
            $(".wbalance").text(currencyFormat(amt - withdraw));
        } else {
            if ($(".txt_withdraw").val() == "" && $(".waccount").text() != "") {
                var amt = parseFloat(removeComma($(".waccount").text()));
                $(".wbalance").text(currencyFormat(amt));
            } else if ($(".txt_withdraw").val() != "" && $(".waccount").text() == "") {
                $(".wbalance").text("");
            } else {
                $(".wbalance").text("");
            }
        }
    }
    function caltransfer() {
        if ($(".txt_transfer").val() != "" && $(".taccount").text() != "") {
            var amt = parseFloat(removeComma($(".taccount").text()));
            var tamt = parseFloat(removeComma($(".ttaccount").text()));
            var transfer = parseFloat(removeComma($(".txt_transfer").val()));
            var fee = transfer * 0.001;
            $(".tbalance").text(currencyFormat((amt - transfer)));
            $(".ttbalance").text(currencyFormat((tamt + transfer) - fee));
            
        } else {
            if ($(".txt_transfer").val() == "" && $(".taccount").text() != "") {
                var amt = parseFloat(removeComma($(".taccount").text()));
                $(".tbalance").text(currencyFormat(amt));
            } else if ($(".txt_transfer").val() != "" && $(".taccount").text() == "") {
                $(".tbalance").text("");
            } else {
                $(".tbalance").text("");
            }

            if ($(".txt_transfer").val() == "" && $(".ttaccount").text() != "") {
                var amt = parseFloat(removeComma($(".ttaccount").text()));
                $(".ttbalance").text(currencyFormat(amt));
                if (amt == NaN) {
                    $(".ttbalance").text("");
                }
            } else if ($(".txt_transfer").val() != "" && $(".ttaccount").text() == "") {
                $(".ttbalance").text("");
            } else {
                $(".ttbalance").text("");
            }

        }


    }
    function bindCustomer(data) {
        if (data.length > 0) {
            var str = "";
            for (var i = 0; i < data.length; i++) {
                str = str + "<tr>";
                str = str + "<td>" + data[i].iban_no +"</td>";
                str = str + "<td>" + data[i].fullname + "</td>";
                str = str + "<td><input type='button' class='btn btn-link btn_deposit' data-iban='" + data[i].iban_no +"' value='Deposit'/></td>";
                str = str + "<td><input type='button' class='btn btn-link btn_withdraw' data-iban='" + data[i].iban_no +"' value='Withdraw'/></td>";
                str = str + "<td><input type='button' class='btn btn-link btn_transfer' data-iban='" + data[i].iban_no +"' value='Transfer'/></td>";
                str = str + "</tr>";
            }
            $(".tbl_bank tbody").append(str);
        }
    }
    function getCustomer() {
        $.ajax({
            url: root + controller + 'GetAllAccounts',
            type: 'GET',
            dataType: 'json',
            data: {  },
            async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                bindCustomer(data.accounts);
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
    function bindBanks(data) {
        $(".ddl_bank").empty();
        $(".ddl_bank").append($("<option></option>").val('').html('--Select Bank--'));
        $(".wddl_bank").empty();
        $(".wddl_bank").append($("<option></option>").val('').html('--Select Bank--'));
        $(".fddl_bank").empty();
        $(".fddl_bank").append($("<option></option>").val('').html('--Select Bank--'));
        if (data.length > 0) {
            if (data.length > 1) {
                $(".div_moveowner").show();
            } else {
                $(".div_moveowner").hide();
            }
            for (var i = 0; i < data.length; i++) {
                $(".ddl_bank").append($("<option data-amt='" + data[i].bank_balanceAmt + "'></option>").val(data[i].bank_id).html(data[i].bank_name + ' ' + data[i].bank_account_name + '/' + data[i].bank_account));
                $(".wddl_bank").append($("<option data-amt='" + data[i].bank_balanceAmt + "'></option>").val(data[i].bank_id).html(data[i].bank_name + ' ' + data[i].bank_account_name + '/' + data[i].bank_account));
                $(".fddl_bank").append($("<option data-amt='" + data[i].bank_balanceAmt + "'></option>").val(data[i].bank_id).html(data[i].bank_name + ' ' + data[i].bank_account_name + '/' + data[i].bank_account));
            }
        }
    }
    function bindTargetBanks(data) {
        $(".tddl_bank").empty();
        $(".tddl_bank").append($("<option></option>").val('').html('--Select Target Bank --'));
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                $(".tddl_bank").append($("<option data-amt='" + data[i].bank_balanceAmt + "'></option>").val(data[i].bank_id).html(data[i].bank_name + ' ' + data[i].bank_account_name + '/' + data[i].bank_account));
               }
        }
    }
    function bindOwnerBankWithoutSelect(data) {
        $(".tddl_bank").empty();
        $(".tddl_bank").append($("<option></option>").val('').html('--Select Bank--'));
        if (data.length > 0) {
            var fbank = $(".fddl_bank  option:selected").val();
            for (var i = 0; i < data.length; i++) {
                if (fbank != data[i].bank_id) {
                    $(".tddl_bank").append($("<option data-amt='" + data[i].bank_balanceAmt + "'></option>").val(data[i].bank_id).html(data[i].bank_name + ' ' + data[i].bank_account_name + '/' + data[i].bank_account));
                }
            }
        }
    }
    function bindCuss(data) {
        $(".ddl_cus").empty();
        $(".ddl_cus").append($("<option></option>").val('').html('--Select Target Account--'));
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                $(".ddl_cus").append($("<option></option>").val(data[i].iban_no).html(data[i].fullname));
           }
        }
    }
    function bindTXN(data) {
        $(".tbl_txn tbody").empty();
        if (data.length > 0) {
            var str = "";
            for (var i = 0; i < data.length; i++) {
                str = str + "<tr>";
                str = str + "<td>" + data[i].created_date + "</td>";
                str = str + "<td>" + data[i].iban_no + "</td>";
                str = str + "<td>" + data[i].bank_name + " " + data[i].bank_account_name + "/" + data[i].bank_account + "</td>";
                str = str + "<td>" + data[i].functional_type + "</td>";
                str = str + "<td>" + data[i].financial_type + "</td>";
                str = str + "<td>" + currencyFormat(data[i].old_balance) + "</td>";
                str = str + "<td>" + currencyFormat(data[i].amt) + "</td>";
                str = str + "<td>" + currencyFormat(data[i].feeamt) + "</td>";
                str = str + "<td>" + currencyFormat(data[i].new_balance) + "</td>";
                str = str + "</tr>";
            }
            $(".tbl_txn tbody").append(str);
        }
    }
    function getBank(iban) {
        $.ajax({
            url: root + controller + 'GetBanks',
            type: 'GET',
            dataType: 'json',
            data: { iban_no: iban},
            async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                bindBanks(data.banks);
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
        $.ajax({
            url: root + controller + 'GetCusWithoutIBAN',
            type: 'GET',
            dataType: 'json',
            data: { iban_no: iban },
            async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                bindCuss(data.accounts);
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
    function getTargetBank(iban) {
        $.ajax({
            url: root + controller + 'GetBanks',
            type: 'GET',
            dataType: 'json',
            data: { iban_no: iban },
            async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                bindTargetBanks(data.banks);
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
    function getOwnerBankWithoutSelect(iban) {
        $.ajax({
            url: root + controller + 'GetBanks',
            type: 'GET',
            dataType: 'json',
            data: { iban_no: iban},
            async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                bindOwnerBankWithoutSelect(data.banks);
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
        $.ajax({
            url: root + controller + 'GetCusWithoutIBAN',
            type: 'GET',
            dataType: 'json',
            data: { iban_no: iban },
            async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                bindCuss(data.accounts);
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
    function getTXN() {
        $.ajax({
            url: root + controller + 'GetTXN',
            type: 'GET',
            dataType: 'json',
            data: { limit:10 },
            async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                bindTXN(data.txn);
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
    function save(actiontype) {
        var bank_id = 0;
        var amt = 0;
        var to_bank_id = 0;
        if (actiontype == "deposit") {
            bank_id = $(".ddl_bank ").val();
            amt = $(".txt_deposit").val();
        } else if(actiontype == "withdraw") {
            bank_id = $(".wddl_bank ").val();
            amt = $(".txt_withdraw").val();
        } else if (actiontype == "transfer") {
            bank_id = $(".fddl_bank ").val();
            amt = $(".txt_transfer").val();
            to_bank_id = $(".tddl_bank ").val();
        }
        var data = {
            bank_id: bank_id,
            amt: amt,
            actiontype: actiontype,
            to_bank_id: to_bank_id
        }

        $.ajax({
            url: root + controller + 'SaveBank',
            type: 'POST',
            data: data,
            async: true,
            success: function (data) {
                //Goto Index Page
                if (data.status) {
                    PopSuccess('save', actiontype + $(".txt_deposit").val() + ' success.');
                    cleardeposit();
                    clearwithdraw();
                    cleartransfer();
                    
                }
                getTXN();
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
        if (type == "deposit") {
            Swal.fire(
                'Please fill data before deposit!',
                word,
            )
        } else if (type == "withdraw") {
            Swal.fire(
                'Please fill data before withdraw!',
                word,
            )
        } else if (type == "transfer") {
            Swal.fire(
                'Please fill data before withdraw!',
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



//div_customer
//div_moveowner
//chk_owner