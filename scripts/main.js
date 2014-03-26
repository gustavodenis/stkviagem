// Wait for Apache Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() { }

function GetName(prod)
{
    switch (prod) {
        case "1":
            return "Bonafont 20 Litros";
        case "2":
            return "Bonafont 10 Litros";
        case "3":
            return "Pilar 20 Litros";
        case "4":
            return "Pilar 10 Litros";
    }
}

function GetPrice(prod)
{
    switch (prod) {
        case "1":
            return 10;
        case "2":
            return 8;
        case "3":
            return 7;
        case "4":
            return 5;
    }
}

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
            if ($('#txtCEP').val() == '')
                erro += '- CEP\n';
            if ($('#txtStreet').val() == '')
                erro += '- Rua\n';
            if ($('#txtNumber').val() == '')
                erro += '- Número\n';
            if ($('#txtNeighboor').val() == '')
                erro += '- Bairro';
            if ($('#txtCity').val() == '')
                erro += '- Cidade';
            if ($('#state').val() == '')
                erro += '- Estado';
            if ($('#txtContact').val() == '')
                erro += '- Contato';

            if (erro.length > 0) {
                alert('Erros encontrados: ' + erro);
            }
            else {

                fauxAjax(function () {
                    $.post("http://www.gdtek.net/buonaAcqua/Purchase",
                        { cep: $('#txtCEP').val(), street: $('#txtStreet').val(), number: $('#txtNumber').val(), complement: $('#txtComplement').val(), neigh: $('#txtNeighboor').val(), city: $('#txtCity').val(), state: $('#state').val(), contact: $('#txtContact').val() })
                    .done(function (data) {
                        var userdatatemp = { cep: $('#txtCEP').val(), street: $('#txtStreet').val(), number: $('#txtNumber').val(), complement: $('#txtComplement').val(), neigh: $('#txtNeighboor').val(), city: $('#txtCity').val(), state: $('#state').val(), contact: $('#txtContact').val() };
                        window.localStorage.setItem("dataUser", JSON.stringify(userdatatemp));

                        alert('Compra efetuada com sucesso!')
                        $.mobile.changePage('#home', { transition: 'flip' });
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        alert("Request failed: " + textStatus + "," + errorThrown);
                    });
                }, 'finalizando compra...', this);
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
         var tempdata = window.localStorage.getItem("dataUser");
         var dataJson = JSON.parse(window.localStorage.getItem("dataUser"));
         if (tempdata != null) {
             $('#txtCEP').val(dataJson.cep);
             $('#txtStreet').val(dataJson.street);
             $('#txtNumber').val(dataJson.number);
             $('#txtComplement').val(dataJson.complement);
             $('#txtNeighboor').val(dataJson.neigh);
             $('#txtCity').val(dataJson.city);
             $('#state').val(dataJson.state);
             $('#txtContact').val(dataJson.contact);
         }
     },

    _initcartPage = function () {
        var cart = window.localStorage.getItem("cartUser");
        if (cart != null) {
            var lista = ""
            var total = 0;
            for (prod in cart.split(";")) {
                lista += '<div class="ui-block-a">' + GetName(cart.split(";")[prod]) + '</div>';
                lista += '<div class="ui-block-b">R$' + GetPrice(cart.split(";")[prod]).toFixed(2) + '</div>';

                total += GetPrice(cart.split(";")[prod]);
            }
            $('#cartPage #listCartUser').empty();
            $('#cartPage #listCartUser').html(lista);
            $('#cartPage #totalPrice').html("R$" + total.toFixed(2));
        }
        else {
            $('#cartPage #listCartUser').empty();
            $('#cartPage #listCartUser').append("Nenhum registro encontrado!");
        }
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