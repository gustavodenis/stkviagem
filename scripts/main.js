// Wait for Apache Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() { }

function strpad00(s) {
    s = s + '';
    if (s.length === 1) s = '0' + s;
        return s;
}

function GetTodayDate() {
    var tdate = new Date();
    var dd = tdate.getDate(); //yields day
    var MM = tdate.getMonth(); //yields month
    var yyyy = tdate.getFullYear(); //yields year
    var xxx = dd + "/" + strpad00((MM + 1)) + "/" + yyyy;

    return xxx;
}

var stkViagemApp = function () { }

stkViagemApp.prototype = function () {

    var erro = '';
    var _login = false,

    run = function () {

        var that = this;
        $('#home').on('pagebeforecreate', $.proxy(_initHome, that));
        $('#addTravelPage').on('pageshow', $.proxy(_initaddTravelPage, that));
        $('#infoTravelPage').on('pageshow', $.proxy(_initinfoTravelPage, that));
        $('#listTravelPage').on('pageshow', $.proxy(_initlistTravelPage, that));

        if (window.localStorage.getItem("userInfo") != null) {
            _login = true;
            $.mobile.changePage('#home', { transition: 'flip' });
        }

        $('#btnFinish').click(function () {
            alert('Despesa Finalizada com sucesso!');
            $.mobile.changePage('#infoResumePage', { transition: 'flip' });
        });

        $('#btnAprove').click(function () {
            alert('Despesa Aprovada com sucesso!');
            $.mobile.changePage('#home', { transition: 'flip' });
        });

        $('#btnReject').click(function () {
            alert('Despesa Reprovada com sucesso!');
            $.mobile.changePage('#home', { transition: 'flip' });
        });
    },
     _initHome = function () {
         if (!_login) {
             $.mobile.changePage("#logon", { transition: "flip" });
         }
     },

    _initaddTravelPage = function () {
        $('#dtIni').val(GetTodayDate());
        $('#dtFim').val(GetTodayDate());
        $('#hrIni').val('08:00');
        $('#hrFim').val('18:00');
    },

    _initinfoTravelPage = function () {

    },

    _initlistTravelPage = function () {

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