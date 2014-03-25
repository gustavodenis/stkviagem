// Wait for Apache Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() { }
var buonaAcquaApp = function () { }

buonaAcquaApp.prototype = function () {

    var erro = '',
    run = function () {

        var that = this;
        $('#home').on('pagebeforecreate', $.proxy(_initHome, that));
        $('#addressPage').on('pageshow', $.proxy(_initaddressPage, that));
        $('#cartPage').on('pageshow', $.proxy(_initcartPage, that));

        $("#myProducts .btnCompra").on("click", function () {
            var cart = "";
            if (window.localStorage.getItem("cartUser") === null) {
                cart = $(this).attr("idProduct");
                window.localStorage.setItem("cartUser", cart);
            }
            else {
                cart = window.localStorage.getItem("cartUser");
                cart += ";" + $(this).attr("idProduct");
                window.localStorage.setItem("cartUser", cart);
            }
            $('#btnViewCart').html('Carrinho de Compras (' + cart.split(";").length + ' itens!)')
        });

        $('#btnSaveContext').on("click", function () {
            erro = '';
            if ($('#firstname').val() == '')
                erro += '- Primeiro Nome\n';
            if ($('#lastname').val() == '')
                erro += '- Último Nome\n';
            if ($('#employer').val() == '')
                erro += '- Empresa\n';
            if ($('#email').val() == '')
                erro += '- Email';

            if (erro.length > 0) {
                alert('Erros encontrados: ' + erro);
            }
            else {

                fauxAjax(function () {
                    $.post("http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/odata/User",
                        { firstname: $('#firstname').val(), lastname: $('#lastname').val(), employer: $('#employer').val(), email: $('#email').val() })
                    .done(function (data) {
                        var usrdata = { idUser: data.idUser, firstname: data.firstname, lastname: data.lastname, email: data.email, employer: data.employer };
                        window.localStorage.setItem("userInfo", JSON.stringify(usrdata));
                        _loadHome(data);

                        $(this).hide();
                        _login = true;

                        $.mobile.changePage('#home', { transition: 'flip' });
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        alert("Request failed: " + textStatus + "," + errorThrown);
                    });
                }, 'autenticando...', this);
            }
        });

        $('#btnClean').on("click", function () {
            window.localStorage.clear();
            alert("Itens excluídos com sucesso!");
        });
    },

     _initHome = function () {
         if (window.localStorage.getItem("cartUser") === null) {
             $('#btnViewCart').html('Carrinho de Compras');
         }
         else {
             $('#btnViewCart').html('Carrinho de Compras (' + window.localStorage.getItem("cartUser").split(";").length + ' itens!)')
         }
     },

     _initaddressPage = function () {
     },

    _initcartPage = function () {

    },

    fauxAjax = function fauxAjax(func, text, thisObj) {
        $.mobile.loading('show', { theme: 'a', textVisible: true, text: text });
        window.setTimeout(function () {
            $.mobile.loading('hide');
            func();
        }, 2000);
    };

    return {
        run: run,
    };
}();