/**
 * Created with JetBrains WebStorm.
 * User: Emmanuel Meinike
 * Date: 04/10/13
 * Time: 17:36
 * To change this template use File | Settings | File Templates.
 */

var homeInterval;
var myQuestionsInterval;

var refreshRate = 3000;
var domain ="http://livoq.com";

function LoginController($scope,$location,$rootScope,$http){
    if(homeInterval){
        clearInterval(homeInterval);
    }
    if(myQuestionsInterval){
        clearInterval(myQuestionsInterval);
    }
    document.getElementById('navibar').style.display= "none";

    $rootScope.showNavBar=true;

    $scope.loginmail= "";
    $scope.loginpassword="";
    $scope.loginremember = true;
    $scope.showactivation = false;
    $scope.loginactivationcode = "";

    $scope.alerts=[];

    if(localStorage.livoqEmail){
        $scope.loginmail= localStorage.livoqEmail;
    }

    if(localStorage.livoqRememberEmail){
        $scope.loginremember = localStorage.livoqRememberEmail;
    }

    if(sessionStorage.livoqNeedActivation){
        $scope.showactivation = sessionStorage.livoqNeedActivation;
    }

    $scope.addAlert = function(msg) {
        $scope.closeAlert(0);
        $scope.alerts.push({type: 'error',msg: msg});

    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.loginSuccess = function(data, status, headers, config){


        if(status === 200){

            if($scope.loginremember){
                localStorage.livoqEmail = $scope.loginmail;
                localStorage.livoqRememberEmail = $scope.loginremember;
            }

            sessionStorage.livoqIsPremium = data.premium;
            sessionStorage.livoqCurrentPoints =data.points;
            sessionStorage.loggedIn=true;
            sessionStorage.livoqPassword=  $scope.tempPassword;
            $location.path('/home');

            $rootScope.$broadcast('updateNavbar', true);
        }
    }

    $scope.loginFailure = function(data, status, headers, config){
        $scope.addAlert(data);

        if(status === 457){
            $scope.showactivation = true;
        }

    }

    $scope.login = function(){

        var pw = CryptoJS.SHA256($scope.loginpassword).toString();
        var data;
        $scope.tempPassword = pw;



        if($scope.showactivation){
            data = 'mail='+$scope.loginmail+'&pw='+pw+'&code='+$scope.loginactivationcode;

            $http({
                url: 'https://livoq.herokuapp.com/confirm',
                method: "POST",
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
                //headers : {'Content-Type':'application/json'},
                data: data
            }).success(function (data, status, headers, config) {


                    if(status ===200){
                        sessionStorage.loggedIn=true;
                        sessionStorage.livoqPassword= pw;

                        if($scope.loginremember){
                            localStorage.livoqEmail = $scope.loginmail;
                            localStorage.livoqRememberEmail = $scope.loginremember;
                        }
                        $scope.showactivation = false;
                        $scope.login();

                        delete sessionStorage.livoqNeedActivation

                        $location.path('/home');
                    }

                }).error(function (data, status, headers, config) {
                    $scope.addAlert(data);

                });

        }
        else{
            $http({
                url: 'https://livoq.herokuapp.com/status',
                method: "GET",
                headers : {'x-livoq-mail':$scope.loginmail,'x-livoq-pw':pw}
            }).success($scope.loginSuccess).error($scope.loginFailure);
        }
    }

    $scope.requestNewCode= function(){
        var data = serialize({mail:$scope.loginmail});

        $http({
            url: 'https://livoq.herokuapp.com/getcode?'+data,
            method: "GET"
        }).success(function (data, status, headers, config) {

                if(status === 200){
                    $scope.addAlert("Code was sent");

                }


            }).error(function (data, status, headers, config) {
                $scope.addAlert(data);

            });
    }

    $scope.redirect= function(index){
        if(index===1){
            $location.path('/register');
        }else if(index ===2){
            $location.path('/passreset');
        }
    }
}

function RegisterController($scope,$http,$location,$rootScope){
    if(homeInterval){
        clearInterval(homeInterval);
    }
    if(myQuestionsInterval){
        clearInterval(myQuestionsInterval);
    }
    document.getElementById('navibar').style.display= "none";


    $rootScope.showNavBar=true;
    $scope.registermail ="";
    $scope.registerpassword="";
    $scope.registerbirthyear =parseInt((new Date()).getFullYear());
    $scope.registergender ="m";

    $scope.alerts=[];

    $scope.addAlert = function(msg) {
        $scope.closeAlert(0);
        $scope.alerts.push({type: 'error',msg: msg});

    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.countries = [{"name":"Afghanistan","code":"AF"},{"name":"Ã…land Islands","code":"AX"},{"name":"Albania","code":"AL"},{"name":"Algeria","code":"DZ"},{"name":"American Samoa","code":"AS"},{"name":"Andorra","code":"AD"},{"name":"Angola","code":"AO"},{"name":"Anguilla","code":"AI"},{"name":"Antarctica","code":"AQ"},{"name":"Antigua and Barbuda","code":"AG"},{"name":"Argentina","code":"AR"},{"name":"Armenia","code":"AM"},{"name":"Aruba","code":"AW"},{"name":"Australia","code":"AU"},{"name":"Austria","code":"AT"},{"name":"Azerbaijan","code":"AZ"},{"name":"Bahamas","code":"BS"},{"name":"Bahrain","code":"BH"},{"name":"Bangladesh","code":"BD"},{"name":"Barbados","code":"BB"},{"name":"Belarus","code":"BY"},{"name":"Belgium","code":"BE"},{"name":"Belize","code":"BZ"},{"name":"Benin","code":"BJ"},{"name":"Bermuda","code":"BM"},{"name":"Bhutan","code":"BT"},{"name":"Bolivia, Plurinational State of","code":"BO"},{"name":"Bonaire, Sint Eustatius and Saba","code":"BQ"},{"name":"Bosnia and Herzegovina","code":"BA"},{"name":"Botswana","code":"BW"},{"name":"Bouvet Island","code":"BV"},{"name":"Brazil","code":"BR"},{"name":"British Indian Ocean Territory","code":"IO"},{"name":"Brunei Darussalam","code":"BN"},{"name":"Bulgaria","code":"BG"},{"name":"Burkina Faso","code":"BF"},{"name":"Burundi","code":"BI"},{"name":"Cambodia","code":"KH"},{"name":"Cameroon","code":"CM"},{"name":"Canada","code":"CA"},{"name":"Cape Verde","code":"CV"},{"name":"Cayman Islands","code":"KY"},{"name":"Central African Republic","code":"CF"},{"name":"Chad","code":"TD"},{"name":"Chile","code":"CL"},{"name":"China","code":"CN"},{"name":"Christmas Island","code":"CX"},{"name":"Cocos (Keeling) Islands","code":"CC"},{"name":"Colombia","code":"CO"},{"name":"Comoros","code":"KM"},{"name":"Congo","code":"CG"},{"name":"Congo, the Democratic Republic of the","code":"CD"},{"name":"Cook Islands","code":"CK"},{"name":"Costa Rica","code":"CR"},{"name":"CÃ´te d'Ivoire","code":"CI"},{"name":"Croatia","code":"HR"},{"name":"Cuba","code":"CU"},{"name":"CuraÃ§ao","code":"CW"},{"name":"Cyprus","code":"CY"},{"name":"Czech Republic","code":"CZ"},{"name":"Denmark","code":"DK"},{"name":"Djibouti","code":"DJ"},{"name":"Dominica","code":"DM"},{"name":"Dominican Republic","code":"DO"},{"name":"Ecuador","code":"EC"},{"name":"Egypt","code":"EG"},{"name":"El Salvador","code":"SV"},{"name":"Equatorial Guinea","code":"GQ"},{"name":"Eritrea","code":"ER"},{"name":"Estonia","code":"EE"},{"name":"Ethiopia","code":"ET"},{"name":"Falkland Islands (Malvinas)","code":"FK"},{"name":"Faroe Islands","code":"FO"},{"name":"Fiji","code":"FJ"},{"name":"Finland","code":"FI"},{"name":"France","code":"FR"},{"name":"French Guiana","code":"GF"},{"name":"French Polynesia","code":"PF"},{"name":"French Southern Territories","code":"TF"},{"name":"Gabon","code":"GA"},{"name":"Gambia","code":"GM"},{"name":"Georgia","code":"GE"},{"name":"Germany","code":"DE"},{"name":"Ghana","code":"GH"},{"name":"Gibraltar","code":"GI"},{"name":"Greece","code":"GR"},{"name":"Greenland","code":"GL"},{"name":"Grenada","code":"GD"},{"name":"Guadeloupe","code":"GP"},{"name":"Guam","code":"GU"},{"name":"Guatemala","code":"GT"},{"name":"Guernsey","code":"GG"},{"name":"Guinea","code":"GN"},{"name":"Guinea-Bissau","code":"GW"},{"name":"Guyana","code":"GY"},{"name":"Haiti","code":"HT"},{"name":"Heard Island and McDonald Islands","code":"HM"},{"name":"Holy See (Vatican City State)","code":"VA"},{"name":"Honduras","code":"HN"},{"name":"Hong Kong","code":"HK"},{"name":"Hungary","code":"HU"},{"name":"Iceland","code":"IS"},{"name":"India","code":"IN"},{"name":"Indonesia","code":"ID"},{"name":"Iran, Islamic Republic of","code":"IR"},{"name":"Iraq","code":"IQ"},{"name":"Ireland","code":"IE"},{"name":"Isle of Man","code":"IM"},{"name":"Israel","code":"IL"},{"name":"Italy","code":"IT"},{"name":"Jamaica","code":"JM"},{"name":"Japan","code":"JP"},{"name":"Jersey","code":"JE"},{"name":"Jordan","code":"JO"},{"name":"Kazakhstan","code":"KZ"},{"name":"Kenya","code":"KE"},{"name":"Kiribati","code":"KI"},{"name":"Korea, Democratic People's Republic of","code":"KP"},{"name":"Korea, Republic of","code":"KR"},{"name":"Kuwait","code":"KW"},{"name":"Kyrgyzstan","code":"KG"},{"name":"Lao People's Democratic Republic","code":"LA"},{"name":"Latvia","code":"LV"},{"name":"Lebanon","code":"LB"},{"name":"Lesotho","code":"LS"},{"name":"Liberia","code":"LR"},{"name":"Libya","code":"LY"},{"name":"Liechtenstein","code":"LI"},{"name":"Lithuania","code":"LT"},{"name":"Luxembourg","code":"LU"},{"name":"Macao","code":"MO"},{"name":"Macedonia, the former Yugoslav Republic of","code":"MK"},{"name":"Madagascar","code":"MG"},{"name":"Malawi","code":"MW"},{"name":"Malaysia","code":"MY"},{"name":"Maldives","code":"MV"},{"name":"Mali","code":"ML"},{"name":"Malta","code":"MT"},{"name":"Marshall Islands","code":"MH"},{"name":"Martinique","code":"MQ"},{"name":"Mauritania","code":"MR"},{"name":"Mauritius","code":"MU"},{"name":"Mayotte","code":"YT"},{"name":"Mexico","code":"MX"},{"name":"Micronesia, Federated States of","code":"FM"},{"name":"Moldova, Republic of","code":"MD"},{"name":"Monaco","code":"MC"},{"name":"Mongolia","code":"MN"},{"name":"Montenegro","code":"ME"},{"name":"Montserrat","code":"MS"},{"name":"Morocco","code":"MA"},{"name":"Mozambique","code":"MZ"},{"name":"Myanmar","code":"MM"},{"name":"Namibia","code":"NA"},{"name":"Nauru","code":"NR"},{"name":"Nepal","code":"NP"},{"name":"Netherlands","code":"NL"},{"name":"New Caledonia","code":"NC"},{"name":"New Zealand","code":"NZ"},{"name":"Nicaragua","code":"NI"},{"name":"Niger","code":"NE"},{"name":"Nigeria","code":"NG"},{"name":"Niue","code":"NU"},{"name":"Norfolk Island","code":"NF"},{"name":"Northern Mariana Islands","code":"MP"},{"name":"Norway","code":"NO"},{"name":"Oman","code":"OM"},{"name":"Pakistan","code":"PK"},{"name":"Palau","code":"PW"},{"name":"Palestinian Territory, Occupied","code":"PS"},{"name":"Panama","code":"PA"},{"name":"Papua New Guinea","code":"PG"},{"name":"Paraguay","code":"PY"},{"name":"Peru","code":"PE"},{"name":"Philippines","code":"PH"},{"name":"Pitcairn","code":"PN"},{"name":"Poland","code":"PL"},{"name":"Portugal","code":"PT"},{"name":"Puerto Rico","code":"PR"},{"name":"Qatar","code":"QA"},{"name":"RÃ©union","code":"RE"},{"name":"Romania","code":"RO"},{"name":"Russian Federation","code":"RU"},{"name":"Rwanda","code":"RW"},{"name":"Saint BarthÃ©lemy","code":"BL"},{"name":"Saint Helena, Ascension and Tristan da Cunha","code":"SH"},{"name":"Saint Kitts and Nevis","code":"KN"},{"name":"Saint Lucia","code":"LC"},{"name":"Saint Martin (French part)","code":"MF"},{"name":"Saint Pierre and Miquelon","code":"PM"},{"name":"Saint Vincent and the Grenadines","code":"VC"},{"name":"Samoa","code":"WS"},{"name":"San Marino","code":"SM"},{"name":"Sao Tome and Principe","code":"ST"},{"name":"Saudi Arabia","code":"SA"},{"name":"Senegal","code":"SN"},{"name":"Serbia","code":"RS"},{"name":"Seychelles","code":"SC"},{"name":"Sierra Leone","code":"SL"},{"name":"Singapore","code":"SG"},{"name":"Sint Maarten (Dutch part)","code":"SX"},{"name":"Slovakia","code":"SK"},{"name":"Slovenia","code":"SI"},{"name":"Solomon Islands","code":"SB"},{"name":"Somalia","code":"SO"},{"name":"South Africa","code":"ZA"},{"name":"South Georgia and the South Sandwich Islands","code":"GS"},{"name":"South Sudan","code":"SS"},{"name":"Spain","code":"ES"},{"name":"Sri Lanka","code":"LK"},{"name":"Sudan","code":"SD"},{"name":"Suriname","code":"SR"},{"name":"Svalbard and Jan Mayen","code":"SJ"},{"name":"Swaziland","code":"SZ"},{"name":"Sweden","code":"SE"},{"name":"Switzerland","code":"CH"},{"name":"Syrian Arab Republic","code":"SY"},{"name":"Taiwan, Province of China","code":"TW"},{"name":"Tajikistan","code":"TJ"},{"name":"Tanzania, United Republic of","code":"TZ"},{"name":"Thailand","code":"TH"},{"name":"Timor-Leste","code":"TL"},{"name":"Togo","code":"TG"},{"name":"Tokelau","code":"TK"},{"name":"Tonga","code":"TO"},{"name":"Trinidad and Tobago","code":"TT"},{"name":"Tunisia","code":"TN"},{"name":"Turkey","code":"TR"},{"name":"Turkmenistan","code":"TM"},{"name":"Turks and Caicos Islands","code":"TC"},{"name":"Tuvalu","code":"TV"},{"name":"Uganda","code":"UG"},{"name":"Ukraine","code":"UA"},{"name":"United Arab Emirates","code":"AE"},{"name":"United Kingdom","code":"GB"},{"name":"United States","code":"US"},{"name":"United States Minor Outlying Islands","code":"UM"},{"name":"Uruguay","code":"UY"},{"name":"Uzbekistan","code":"UZ"},{"name":"Vanuatu","code":"VU"},{"name":"Venezuela, Bolivarian Republic of","code":"VE"},{"name":"Viet Nam","code":"VN"},{"name":"Virgin Islands, British","code":"VG"},{"name":"Virgin Islands, U.S.","code":"VI"},{"name":"Wallis and Futuna","code":"WF"},{"name":"Western Sahara","code":"EH"},{"name":"Yemen","code":"YE"},{"name":"Zambia","code":"ZM"},{"name":"Zimbabwe","code":"ZW"}];

    $scope.registercountry = $scope.countries[0];


    $scope.register = function(){


        var pw = CryptoJS.SHA256($scope.registerpassword).toString();
        var data = {mail: $scope.registermail, pw: pw, yearofbirth: $scope.registerbirthyear, gender: $scope.registergender, country: $scope.registercountry.code};
        //var data = 'mail='+$scope.registermail+'&pw='+pw+'&yearofbirth='+$scope.registerbirthyear+'&gender='+$scope.registergender+'&country='+$scope.registercountry;

        //data = $.param(data);

        $http({
            url: 'https://livoq.herokuapp.com/register',
            method: "POST",
            //headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
            //headers : {'Content-Type':'application/json'},
            data: data
        }).success(function (data, status, headers, config) {


                if(status ===200){
                    sessionStorage.livoqNeedActivation = true;
                    localStorage.livoqEmail = $scope.registermail;
                    $location.path('/login');
                }

        }).error(function (data, status, headers, config) {
                $scope.addAlert(data);

        });



    }

    $scope.redirect = function(index){
        if(index===1){
            $location.path('/login');

        }
    }
}

function AskController($scope,$rootScope,$http,$location){
    if(homeInterval){
        clearInterval(homeInterval);
    }
    if(myQuestionsInterval){
        clearInterval(myQuestionsInterval);
    }
    document.getElementById('navibar').style.display= "block";

    $rootScope.showNavBar=false;

    $rootScope.activeTab="ask";

    $scope.getLanguage = function(){
        var userLang = navigator.language || navigator.userLanguage;
        if(userLang.length ===2){
            return userLang;
        }else{
            return userLang.substring(0,2);
        }
    }

    $scope.getLanguageIndex = function(languages){
        var languageCode = $scope.getLanguage();

        for(var i= 0; i< languages.length;i++){
            if(languageCode === languages[i].code){
                return i;
            }
        }
        return 0;
    }


    $scope.languages = [
        {"code":"en","name":"English"},
        {"code":"de","name":"German"},
        {"code":"es","name":"Spanish; Castilian"},
        {"code":"fr","name":"French"},
        {"code":"it","name":"Italian"},
        {"code":"pt","name":"Portuguese"},
        {"code":"ru","name":"Russian"}]


    $scope.yesnos={
        "en":{"y":"Yes","n":"No"},
        "de":{"y":"Ja","n":"Nein"},
        "es":{"y":"Si","n":"No"},
        "fr":{"y":"Oui","n":"Non"},
        "it":{"y":"Si","n":"No"},
        "pt":{"y":"Sim","n":"Não"},
        "ru":{"y":"да","n":"нет"}
    }

    $scope.setLocalYes = function(){
        return $scope.yesnos[ $scope.questionLanquage.code]['y'];

    }
    $scope.setLocalNo = function(){
        return $scope.yesnos[ $scope.questionLanquage.code]['n'];
    }

    $scope.alerts=[];
    $scope.ispremium = true;

    if(sessionStorage.livoqIsPremium > 0){
        $scope.ispremium =false;
    }


    $scope.addAlert = function(msg,type) {
        $scope.closeAlert(0);

        $scope.alerts.push({type: type,msg: msg});

    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.questionText ='';
    $scope.questionThirdAnswerBox =false;
    $scope.questionCustomAnswerBox =true;
    $scope.questionVoteLimit =10;
    $scope.questionLanquage =$scope.languages[$scope.getLanguageIndex($scope.languages)];
    $scope.questionAnswerOne =$scope.setLocalYes();
    $scope.questionAnswerTwo =$scope.setLocalNo();


    $scope.questionLength =0;
    $scope.voteBaseCost = 0;

    $scope.answer1Length =0;
    $scope.answer2Length =0;



    $scope.counter = function(){
        if($scope.questionText){
            $scope.questionLength =$scope.questionText.length;
        }else{
            $scope.questionLength =0;
        }

    }

    $scope.voteCounter = function(){
        if($scope.questionVoteLimit){
            $scope.voteCost =$scope.voteBaseCost+"P base fee + "+$scope.questionVoteLimit+"P for your votes";

        }

    }

    $scope.counterAnswer = function(index){
        if(index === 1 &&$scope.questionAnswerOne){
            $scope.answer1Length =$scope.questionAnswerOne.length;
        }else{
            $scope.answer1Length =0;
        }
        if(index === 2 &&$scope.questionAnswerTwo){
            $scope.answer2Length =$scope.questionAnswerTwo.length;
        }else{
            $scope.answer2Length =0;
        }

    }

    $scope.getCurrentBaseCost = function(){
        $http({
            url: 'https://livoq.herokuapp.com/getcost',
            method: "GET"
        }).success(function (data, status, headers, config) {

                if(status===200){
                    $scope.voteBaseCost=data.questioncost;
                    $scope.voteCounter();
                }

            }).error(function (data, status, headers, config) {

            });
    }

    $scope.ask = function(question){

        var canSend = true;
        var data = 'question='+ encodeURIComponent($scope.questionText)+
                    '&isskipable='+ encodeURIComponent($scope.questionThirdAnswerBox)+
                    '&customanswers='+ encodeURIComponent($scope.questionCustomAnswerBox)+
                    '&votelimit='+ encodeURIComponent($scope.questionVoteLimit.toString())+
                    '&languagecode='+ encodeURIComponent($scope.questionLanquage.code);


        if($scope.questionCustomAnswerBox){
            if($scope.questionAnswerOne ===''){
                $scope.addAlert("You must provide answer 1",'error');
                canSend=false;
            }
            if($scope.questionAnswerTwo ===''){
                $scope.addAlert("You must provide answer 2",'error');
                canSend=false;
            }
        }

        if($scope.questionCustomAnswerBox && canSend){
            data +='&answerone='+encodeURIComponent($scope.questionAnswerOne)+
            '&answertwo='+encodeURIComponent($scope.questionAnswerTwo);
        }


        if(canSend){
            $http({
                url: 'https://livoq.herokuapp.com/ask',
                method: "POST",
                headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword},
                data: data
            }).success(function (data, status, headers, config) {


                    if(status ===200){
                        $scope.addAlert("Question asked succesfully",'success');
                        $scope.clearFields();
                        $location.path('/home');
                    }

                }).error(function (data, status, headers, config) {
                    $scope.addAlert(data,'error');

                });
        }

    }

    $scope.clearFields = function(){
        $scope.questionText ='';
        $scope.questionAnswerOne ='';
        $scope.questionAnswerTwo ='';
        $scope.questionVoteLimit =10;
    }

    $scope.languageChanged = function(){

        $scope.questionAnswerOne =$scope.setLocalYes();
        $scope.questionAnswerTwo =$scope.setLocalNo();
    }
    $scope.getCurrentBaseCost();



    $scope.voteCounter();

}

function serialize(obj){
    var str = [];
    for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
}

function AnswerController($scope,$rootScope,$http){
    if(homeInterval){
        clearInterval(homeInterval);
    }
    if(myQuestionsInterval){
        clearInterval(myQuestionsInterval);
    }
    document.getElementById('navibar').style.display= "block";

    $rootScope.showNavBar=false;
    $rootScope.activeTab="answer";
    //$scope.$emit('setTab', {tab: "answer"});


    $scope.button1 ="";
    $scope.button2 ="";

    $scope.hideLoading= false;
    $scope.showQuestion = false;
    $scope.showEmptyView = false;
    $scope.showAd = false;

    $scope.languageCodes =[];

    $scope.items = [
        "Wrong Langauge",
        "Offensive Content",
        "Offensive Language"
    ];

    if(localStorage.livoqLanguages){
        var langArray = JSON.parse(localStorage.livoqLanguages);
        for(var i =0;i< langArray.length;i++){
            $scope.languageCodes.push(langArray[i].code);
        }

    }else{

        $scope.languageCodes =['en','de'];
        localStorage.livoqLanguages =  JSON.stringify([{"code":"en","name":"English"},{"code":"de","name":"German"}]);
    }
    var data = serialize({languagecodes:$scope.languageCodes});

    $scope.waitInit = function(){
        window.setTimeout($scope.init,100);
    }

    $scope.init = function(){
        $scope.hideLoading= false;
        $scope.showEmptyView = false;

        $http({
            url: 'https://livoq.herokuapp.com/question?'+data,
            method: "GET",
            headers : {'x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword}
        }).success(function (data, status, headers, config) {

                console.log(data)

                if(status === 200){
                    $scope.hideLoading= true;
                    $scope.showQuestion = true;
                    $scope.showEmptyView = false;
                    $scope.showAd = false;
                    $scope.receivedquestion = data;

                    if(data.customas){
                        $scope.button1 =data.answerone;
                        $scope.button2 =data.answertwo;
                    }else{
                        $scope.button1 ="Yes";
                        $scope.button2 ="No";
                    }
                }

            }).error(function (data, status, headers, config) {

                if(status === 518){
                    $scope.receivedquestion = [];
                    $scope.hideLoading= true;
                    $scope.showEmptyView = true;
                    $scope.showQuestion = false;
                    $scope.showAd = false;
                }
            });

    }

    $scope.answerQuestion= function(id,answer){
        var data = {questionid:id, answernumber:answer};

        $http({
            url: 'https://livoq.herokuapp.com/answer',
            method: "POST",
            headers : {'x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword},
            data : data
        }).success(function (data, status, headers, config) {


                if(status ===  200){
                    //$scope.init();
                    $scope.hideLoading= true;
                    $scope.showEmptyView = false;
                    $scope.showQuestion = false;
                    $scope.showAd = true;
                    if(sessionStorage.livoqIsPremium){
                        if(sessionStorage.livoqIsPremium > Date.now()/1000){
                            $scope.showAd = false;
                            $scope.init();
                        }else {
                            setTimeout($scope.showNextQuestion,2000);
                        }
                    }else{
                        setTimeout($scope.showNextQuestion,2000);
                    }


                }

            }).error(function (data, status, headers, config) {
                if(status === 473){
                    if(sessionStorage.livoqIsPremium){
                        if(sessionStorage.livoqIsPremium > Date.now()/1000){
                            $scope.showAd = false;
                            $scope.init();
                        }else {
                            setTimeout($scope.showNextQuestion,2000);
                        }
                    }else{
                        setTimeout($scope.showNextQuestion,2000);
                    }
                }
            });
    }

    $scope.showNextQuestion = function(){
        $scope.showAd = false;
        $scope.init();
    }

    $scope.reloadView = function(){
        $scope.init();
    }

    $scope.reportQuestion = function(questionid,reason){
        var data ={questionid:questionid,reason:reason};

        $http({
            url: 'https://livoq.herokuapp.com/report',
            method: "POST",
            headers : {'x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword},
            data: data
        }).success(function (data, status, headers, config) {


                if(status === 200){
                    //$scope.init();
                    $scope.hideLoading= true;
                    $scope.showEmptyView = false;
                    $scope.showQuestion = false;
                    $scope.showAd = true;
                    if(sessionStorage.livoqIsPremium){
                        if(sessionStorage.livoqIsPremium > Date.now()/1000){
                            $scope.showAd = false;
                            $scope.init();
                        }else {
                            setTimeout($scope.showNextQuestion,2000);
                        }
                    }else{
                        setTimeout($scope.showNextQuestion,2000);
                    }
                }

            }).error(function (data, status, headers, config) {


            });
    }

    //$scope.init();
    $scope.waitInit();


}

function MyQuestionsController($scope,$rootScope,$http,$filter,$location,$modal){
    if(homeInterval){
        clearInterval(homeInterval);
    }
    if(myQuestionsInterval){
        clearInterval(myQuestionsInterval);
    }
    document.getElementById('navibar').style.display= "block";


    $rootScope.showNavBar=false;
    $rootScope.activeTab="myquestions";

    $scope.alreadyLoading = true;

    $scope.showEmptyView=false;
    $scope.showDataView = false;
    $scope.hideLoading = false;
    $scope.resultslimit = 10;
    $scope.results = [];
    $scope.resultdetails="";
    $scope.currentIndex =0;

    $scope.showThird = false;
    $scope.answer1 ="Yes";
    $scope.answer2 ="No";
    $scope.answer3 ="Don't know";



    $scope.getResults = function(timestamp,favorites){

        var limit = $scope.resultslimit;

        var data ={limit:limit,timestamp:timestamp,favorites:favorites};
        data = serialize(data);

        $http({
            url: 'https://livoq.herokuapp.com/result?'+data,
            method: "GET",
            headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword}
        }).success(function (data, status, headers, config) {

                if(status === 200){
                    $scope.showDataView = true;
                    $scope.hideLoading = true;
                    for(var i=0;i< data.length;i++){
                        GetDetailedRequests($http,$scope,serialize({questionid: data[i]._id,complete:'true'}),$filter);
                    }

                    if(favorites && data.length >=10){
                        console.log("more favs")
                        $scope.getResults(data[data.length-1].createdtimestamp, true);
                    }else if(favorites && data.length < 10){
                        console.log("normal")
                        $scope.getResults(timestamp, false);
                    }else{
                        console.log("load again");
                        $scope.alreadyLoading = false;
                    }


                }

            }).error(function (data, status, headers, config) {
                $scope.alreadyLoading = false;
                if(status === 20){
                    if($scope.results.length === 0){
                        if(!$scope.showDataView){
                            $scope.showEmptyView=true;
                            $scope.hideLoading = true;
                        }

                    }


                }else{
                    if(!$scope.showDataView){
                        $scope.showEmptyView=true;
                        $scope.hideLoading = true;
                    }
                }

            });


    }

    $scope.showDetails = function(index){
        $scope.currentIndex= index;

        if(myQuestionsInterval){
            clearInterval(myQuestionsInterval);
        }

        myQuestionsInterval = window.setInterval($scope.refreshDetails,refreshRate);


        $scope.resultdetails =$scope.results[index];

        var results =[];
        /*
        results[0] = Math.floor(Math.random()*100000);
        results[1] = Math.floor(Math.random()*100000);
        results[2] = Math.floor(Math.random()*5000);
        */
        results[0] =  $scope.resultdetails.voteone;
        results[1] = $scope.resultdetails.votesum- $scope.resultdetails.voteone;
        results[2] = 0;


        if($scope.resultdetails.isthree){
            $scope.showThird = true;
        }

        if($scope.resultdetails.customas){
            $scope.answer1 =$scope.resultdetails.answerone;
            $scope.answer2 =$scope.resultdetails.answertwo;
        }else{
            $scope.answer1 ="Yes";
            $scope.answer2 ="No";
        }


        //$scope.progressBarPercentage =Math.floor(Math.random() *101);
        $scope.progressBarPercentage = Math.floor(($scope.resultdetails.votesum / $scope.resultdetails.votelimit)*100);
        if($scope.progressBarPercentage > 100){
            $scope.progressBarPercentage =100;
        }
        $scope.progressBarStyle = {width: $scope.progressBarPercentage+"%"};

        if( $scope.progressBarPercentage < 100){
            $scope.animateStripes = "animate_stripes";
        }else{
            $scope.animateStripes = "";
        }

       SetCanvasValues(results);
    }

    $scope.stopQuestion = function(index,finished){
        var data ={questionid: index};

        if(!finished){
            $http({
                url: 'https://livoq.herokuapp.com/stopquestion',
                method: "POST",
                headers : {'x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword},
                data: data
            }).success(function (data, status, headers, config) {
                    if(status === 200){
                        $scope.results[$scope.currentIndex].isfinish = true;
                    }

                }).error(function (data, status, headers, config) {
                });
        }

    }

    $scope.deleteQuestion = function(index,finished){
        var data ={questionid: index};

        if(finished){
            $http({
                url: 'https://livoq.herokuapp.com/deletequestion',
                method: "POST",
                headers : {'x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword},
                data: data
            }).success(function (data, status, headers, config) {

                    if(status === 200){
                        $scope.results.splice($scope.currentIndex,1);
                        if($scope.results.length ===0){
                            $scope.showEmptyView=true;
                            $scope.showDataView=false;
                        }else{
                            if($scope.currentIndex ===0){
                                $scope.showDetails($scope.currentIndex);
                            }else{
                                $scope.showDetails($scope.currentIndex-1);
                            }

                        }


                    }

                }).error(function (data, status, headers, config) {

                });
        }

    }

    $scope.toggleFavorite = function(index, isfavorite){

        var setFavorite ="";
        if(isfavorite){
            var setFavorite ="false";
        }else{
            var setFavorite ="true";
        }
        var data = {questionid: index,setfavorite:!isfavorite};

        $http({
                url: 'https://livoq.herokuapp.com/favoritequestion',
                method: "POST",
                //headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword},
                headers : {'x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword},
                data: data
            }).success(function (data, status, headers, config) {


                if(status === 200){
                    $scope.results[$scope.currentIndex].isfavorite = !isfavorite;
                }

            }).error(function (data, status, headers, config) {


            });
    }

    $scope.init = function(){

        var results =[];
        results[0] = 0;
        results[1] = 0;
        results[2] = 0;

        InitCanvas(results,"barCanvas","pieCanvas");

        var timestamp = Date.now()/1000;
        $scope.results = [];
        $scope.getResults(timestamp,true);

    }

    $scope.redirect = function(index){
        if(index ===1){
            $location.path('/ask');
        }else{
            $location.path('/answer');
        }
    }

    $scope.loadMore = function(){
        var timestamp = $scope.results[$scope.results.length-1].createdtimestamp;
        $scope.getResults(timestamp,false);
    }

    $scope.refreshDetails= function(){

        var data = serialize({questionid: $scope.results[$scope.currentIndex]._id,complete:'true'})
        $http({
            url: 'https://livoq.herokuapp.com/result?'+data,
            method: "GET",
            headers : {'x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword}
        }).success(function (data, status, headers, config) {

                if(status === 200){
                    var date = new Date((data.createdtimestamp*1000))
                    data.parsedDate = (date.getDate()+"."+(date.getMonth()<10?'0':'') + date.getMonth()+"."+date.getFullYear()+"  "+date.getUTCHours()+":"+(date.getMinutes()<10?'0':'') + date.getMinutes());

                    $scope.results[$scope.currentIndex] = data;

                    var results =[];
                    results[0] =  $scope.results[$scope.currentIndex].voteone;
                    results[1] = $scope.results[$scope.currentIndex].votesum - $scope.results[$scope.currentIndex].voteone ;
                    results[2] = 0;
                    SetCanvasValues(results);

                    $scope.progressBarPercentage = Math.floor(( $scope.results[$scope.currentIndex].votesum /  $scope.results[$scope.currentIndex].votelimit)*100);
                    if($scope.progressBarPercentage > 100){
                        $scope.progressBarPercentage =100;
                    }

                    $scope.progressBarStyle = {width: $scope.progressBarPercentage+"%"};
                    if( $scope.progressBarPercentage < 100){
                        $scope.animateStripes = "animate_stripes";
                    }else{
                        $scope.animateStripes = "";
                    }

                }

            }).error(function (data, status, headers, config) {

            });
    }


    $scope.item = {};


    $scope.showShareDialog = function(index, publiccode){
        $scope.item.sharelink = domain+"/#/public?id="+index+"&p="+publiccode;
        $scope.item.encodeLink =  domain+"/%23/public?id="+index+"%26p="+publiccode;
            //encodeURI($scope.item.sharelink);

        var modalShareDialog =$modal.open({
            templateUrl: 'sharedialog.html',
            controller: ShareDialogController,
            resolve: {
                item: function () {
                    return $scope.item;
                }

            }

        });

        modalShareDialog.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });


    }

    $scope.init();
}

var ShareDialogController = function($scope, $modalInstance, item){
    $scope.item = item;


    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

function GetDetailedRequests($http,$scope,data,$filter){


    $http({
        url: 'https://livoq.herokuapp.com/result?'+data,
        method: "GET",
        headers : {'x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword}
    }).success(function (data, status, headers, config) {
            if(status === 200){
                console.log(data)
                var date = new Date((data.createdtimestamp*1000))
                data.parsedDate = (date.getDate()+"."+(date.getMonth()<10?'0':'') + date.getMonth()+"."+date.getFullYear()+"  "+date.getUTCHours()+":"+(date.getMinutes()<10?'0':'') + date.getMinutes());
                $scope.results.push(data);
                $scope.results=$filter('orderBy')($scope.results,['!isfavorite','!createdtimestamp']);


                if($scope.results.length ==1){
                    $scope.showDetails(0);

                }
            }

        }).error(function (data, status, headers, config) {
        });
}

function PasswordResetController($scope,$rootScope,$http,$location){
    if(homeInterval){
        clearInterval(homeInterval);
    }
    if(myQuestionsInterval){
        clearInterval(myQuestionsInterval);
    }
    document.getElementById('navibar').style.display= "none";


    $rootScope.showNavBar=true;
    $scope.resetmail ="";

    $scope.resetPasswordAlerts =[];
    $scope.showActivationCode=false;

    $scope.activationCode="";
    $scope.newPassword="";

    $scope.addAlert = function(msg,type) {
        $scope.closeAlert(0);
        $scope.resetPasswordAlerts.push({type: type,msg: msg});
    }

    $scope.closeAlert = function(index) {
        $scope.resetPasswordAlerts.splice(index, 1);

    }

    $scope.resetPassword = function(){

        if(!$scope.showActivationCode){
            var data ={mail:$scope.resetmail};

            $http({
                url: 'https://livoq.herokuapp.com/passreset',
                method: "POST",
                data: data
            }).success(function (data, status, headers, config) {

                    if(status === 200){
                        $scope.showActivationCode = true;
                        $scope.addAlert('Password reset code sent to '+$scope.resetmail,'success');
                    }

                }).error(function (data, status, headers, config) {
                    $scope.addAlert(data,'error');
                });
        }else{


            if(!($scope.activationCode === "") || !($scope.newPassword==="")){
                var pw = CryptoJS.SHA256($scope.newPassword).toString();
                var data = {mail:$scope.resetmail,code:$scope.activationCode,pw:pw}

                $http({
                    url: 'https://livoq.herokuapp.com/confirm',
                    method: "POST",
                    data: data
                }).success(function (data, status, headers, config) {

                        if(status===200){
                            $scope.addAlert('Password changed successfully','success');
                            $scope.showActivationCode = false;
                            $location.path('/login');

                        }

                    }).error(function (data, status, headers, config) {
                        $scope.addAlert(data,'error',1);
                    });
            }else{
                $scope.addAlert('Please enter code and/or new password','error');
            }
        }

    }

    $scope.redirect = function(index){
        if(index===1){
            $location.path('/login');

        }
    }

}

function SettingsController($scope,$rootScope,$http,$location){
    if(homeInterval){
        clearInterval(homeInterval);
    }
    if(myQuestionsInterval){
        clearInterval(myQuestionsInterval);
    }
    document.getElementById('navibar').style.display= "block";

    $rootScope.activeTab="settings";
    $rootScope.showNavBar=false;

    $scope.newMailAlerts =[];
    $scope.newPasswordAlerts =[];

    $scope.addAlert = function(msg,type,area) {
        $scope.closeAlert(0,area);
        if(area ===1){
            $scope.newMailAlerts.push({type: type,msg: msg});
        }else{
            $scope.newPasswordAlerts.push({type: type,msg: msg});
        }


    }

    $scope.closeAlert = function(index,area) {
        if(area ===1){
            $scope.newMailAlerts.splice(index, 1);
        }else{
            $scope.newPasswordAlerts.splice(index, 1);
        }
    }


    $scope.disableLanguages= false;
    $scope.currentLanguages = [];

    if(localStorage.livoqLanguages){
        var langArray = JSON.parse(localStorage.livoqLanguages);
        $scope.currentLanguages = langArray;

        if(langArray.length===3){
            $scope.disableLanguages= true;
        }
    }

    //$scope.availableLanguages = [{"code":"ab","name":"Abkhaz"},{"code":"aa","name":"Afar"},{"code":"af","name":"Afrikaans"},{"code":"ak","name":"Akan"},{"code":"sq","name":"Albanian"},{"code":"am","name":"Amharic"},{"code":"ar","name":"Arabic"},{"code":"an","name":"Aragonese"},{"code":"hy","name":"Armenian"},{"code":"as","name":"Assamese"},{"code":"av","name":"Avaric"},{"code":"ae","name":"Avestan"},{"code":"ay","name":"Aymara"},{"code":"az","name":"Azerbaijani"},{"code":"bm","name":"Bambara"},{"code":"ba","name":"Bashkir"},{"code":"eu","name":"Basque"},{"code":"be","name":"Belarusian"},{"code":"bn","name":"Bengali"},{"code":"bh","name":"Bihari"},{"code":"bi","name":"Bislama"},{"code":"bs","name":"Bosnian"},{"code":"br","name":"Breton"},{"code":"bg","name":"Bulgarian"},{"code":"my","name":"Burmese"},{"code":"ca","name":"Catalan; Valencian"},{"code":"ch","name":"Chamorro"},{"code":"ce","name":"Chechen"},{"code":"ny","name":"Chichewa; Chewa; Nyanja"},{"code":"zh","name":"Chinese"},{"code":"cv","name":"Chuvash"},{"code":"kw","name":"Cornish"},{"code":"co","name":"Corsican"},{"code":"cr","name":"Cree"},{"code":"hr","name":"Croatian"},{"code":"cs","name":"Czech"},{"code":"da","name":"Danish"},{"code":"dv","name":"Divehi; Dhivehi; Maldivian;"},{"code":"nl","name":"Dutch"},{"code":"en","name":"English"},{"code":"eo","name":"Esperanto"},{"code":"et","name":"Estonian"},{"code":"ee","name":"Ewe"},{"code":"fo","name":"Faroese"},{"code":"fj","name":"Fijian"},{"code":"fi","name":"Finnish"},{"code":"fr","name":"French"},{"code":"ff","name":"Fula; Fulah; Pulaar; Pular"},{"code":"gl","name":"Galician"},{"code":"ka","name":"Georgian"},{"code":"de","name":"German"},{"code":"el","name":"Greek, Modern"},{"code":"gn","name":"GuaranÃ­"},{"code":"gu","name":"Gujarati"},{"code":"ht","name":"Haitian; Haitian Creole"},{"code":"ha","name":"Hausa"},{"code":"he","name":"Hebrew (modern)"},{"code":"hz","name":"Herero"},{"code":"hi","name":"Hindi"},{"code":"ho","name":"Hiri Motu"},{"code":"hu","name":"Hungarian"},{"code":"ia","name":"Interlingua"},{"code":"id","name":"Indonesian"},{"code":"ie","name":"Interlingue"},{"code":"ga","name":"Irish"},{"code":"ig","name":"Igbo"},{"code":"ik","name":"Inupiaq"},{"code":"io","name":"Ido"},{"code":"is","name":"Icelandic"},{"code":"it","name":"Italian"},{"code":"iu","name":"Inuktitut"},{"code":"ja","name":"Japanese"},{"code":"jv","name":"Javanese"},{"code":"kl","name":"Kalaallisut, Greenlandic"},{"code":"kn","name":"Kannada"},{"code":"kr","name":"Kanuri"},{"code":"ks","name":"Kashmiri"},{"code":"kk","name":"Kazakh"},{"code":"km","name":"Khmer"},{"code":"ki","name":"Kikuyu, Gikuyu"},{"code":"rw","name":"Kinyarwanda"},{"code":"ky","name":"Kirghiz, Kyrgyz"},{"code":"kv","name":"Komi"},{"code":"kg","name":"Kongo"},{"code":"ko","name":"Korean"},{"code":"ku","name":"Kurdish"},{"code":"kj","name":"Kwanyama, Kuanyama"},{"code":"la","name":"Latin"},{"code":"lb","name":"Luxembourgish, Letzeburgesch"},{"code":"lg","name":"Luganda"},{"code":"li","name":"Limburgish, Limburgan, Limburger"},{"code":"ln","name":"Lingala"},{"code":"lo","name":"Lao"},{"code":"lt","name":"Lithuanian"},{"code":"lu","name":"Luba-Katanga"},{"code":"lv","name":"Latvian"},{"code":"gv","name":"Manx"},{"code":"mk","name":"Macedonian"},{"code":"mg","name":"Malagasy"},{"code":"ms","name":"Malay"},{"code":"ml","name":"Malayalam"},{"code":"mt","name":"Maltese"},{"code":"mi","name":"MÄori"},{"code":"mr","name":"Marathi (MarÄá¹­hÄ«)"},{"code":"mh","name":"Marshallese"},{"code":"mn","name":"Mongolian"},{"code":"na","name":"Nauru"},{"code":"nv","name":"Navajo, Navaho"},{"code":"nb","name":"Norwegian BokmÃ¥l"},{"code":"nd","name":"North Ndebele"},{"code":"ne","name":"Nepali"},{"code":"ng","name":"Ndonga"},{"code":"nn","name":"Norwegian Nynorsk"},{"code":"no","name":"Norwegian"},{"code":"ii","name":"Nuosu"},{"code":"nr","name":"South Ndebele"},{"code":"oc","name":"Occitan"},{"code":"oj","name":"Ojibwe, Ojibwa"},{"code":"om","name":"Oromo"},{"code":"or","name":"Oriya"},{"code":"os","name":"Ossetian, Ossetic"},{"code":"pa","name":"Panjabi, Punjabi"},{"code":"pi","name":"PÄli"},{"code":"fa","name":"Persian"},{"code":"pl","name":"Polish"},{"code":"ps","name":"Pashto, Pushto"},{"code":"pt","name":"Portuguese"},{"code":"qu","name":"Quechua"},{"code":"rm","name":"Romansh"},{"code":"rn","name":"Kirundi"},{"code":"ro","name":"Romanian, Moldavian, Moldovan"},{"code":"ru","name":"Russian"},{"code":"sa","name":"Sanskrit (Saá¹ská¹›ta)"},{"code":"sc","name":"Sardinian"},{"code":"sd","name":"Sindhi"},{"code":"se","name":"Northern Sami"},{"code":"sm","name":"Samoan"},{"code":"sg","name":"Sango"},{"code":"sr","name":"Serbian"},{"code":"gd","name":"Scottish Gaelic; Gaelic"},{"code":"sn","name":"Shona"},{"code":"si","name":"Sinhala, Sinhalese"},{"code":"sk","name":"Slovak"},{"code":"sl","name":"Slovene"},{"code":"so","name":"Somali"},{"code":"st","name":"Southern Sotho"},{"code":"es","name":"Spanish; Castilian"},{"code":"su","name":"Sundanese"},{"code":"sw","name":"Swahili"},{"code":"ss","name":"Swati"},{"code":"sv","name":"Swedish"},{"code":"ta","name":"Tamil"},{"code":"te","name":"Telugu"},{"code":"tg","name":"Tajik"},{"code":"th","name":"Thai"},{"code":"ti","name":"Tigrinya"},{"code":"bo","name":"Tibetan Standard, Tibetan, Central"},{"code":"tk","name":"Turkmen"},{"code":"tl","name":"Tagalog"},{"code":"tn","name":"Tswana"},{"code":"to","name":"Tonga (Tonga Islands)"},{"code":"tr","name":"Turkish"},{"code":"ts","name":"Tsonga"},{"code":"tt","name":"Tatar"},{"code":"tw","name":"Twi"},{"code":"ty","name":"Tahitian"},{"code":"ug","name":"Uighur, Uyghur"},{"code":"uk","name":"Ukrainian"},{"code":"ur","name":"Urdu"},{"code":"uz","name":"Uzbek"},{"code":"ve","name":"Venda"},{"code":"vi","name":"Vietnamese"},{"code":"vo","name":"VolapÃ¼k"},{"code":"wa","name":"Walloon"},{"code":"cy","name":"Welsh"},{"code":"wo","name":"Wolof"},{"code":"fy","name":"Western Frisian"},{"code":"xh","name":"Xhosa"},{"code":"yi","name":"Yiddish"},{"code":"yo","name":"Yoruba"},{"code":"za","name":"Zhuang, Chuang"}];

    $scope.availableLanguages = [{"code":"de","name":"German"},
        {"code":"en","name":"English"},
        {"code":"es","name":"Spanish; Castilian"},
        {"code":"fr","name":"French"},
        {"code":"it","name":"Italian"},
        {"code":"pt","name":"Portuguese"},
        {"code":"ru","name":"Russian"}]


    $scope.selectedLanguage= $scope.availableLanguages[0];


    $scope.currentEmail = localStorage.livoqEmail;

    $scope.addLanguage= function(){

        if(!$scope.languageAlreadyChosen($scope.selectedLanguage)){
            var langArray =[];
            if(localStorage.livoqLanguages){
                langArray = JSON.parse(localStorage.livoqLanguages);
            }
            langArray.push($scope.selectedLanguage);
            localStorage.livoqLanguages = JSON.stringify(langArray);
            $scope.currentLanguages=langArray;

            //$scope.removeLanguage($scope.selectedLanguage.value);
            $scope.selectedLanguage= $scope.availableLanguages[0];
            $scope.checkIfNeedToDisable();
        }



    }

    $scope.removeLanguage = function(v){

        for(var i=0;i< $scope.availableLanguages.length;i++){
            if($scope.availableLanguages[i].value ===v){
                $scope.availableLanguages.splice(i,1);
            }
        }

        if($scope.availableLanguages.length==1){
            $scope.disableLanguages= true;
        }
    }

    $scope.unselectLanguage = function(index){
        $scope.currentLanguages.splice(index,1);
        localStorage.livoqLanguages = JSON.stringify( $scope.currentLanguages);
        $scope.checkIfNeedToDisable();
    }

    $scope.checkIfNeedToDisable= function(){
        if($scope.currentLanguages.length === 3){
            $scope.disableLanguages= true;
        }else{
            $scope.disableLanguages= false;
        }
    }

    $scope.languageAlreadyChosen = function(language){
        for(var i=0;i< $scope.currentLanguages.length;i++){
            if($scope.currentLanguages[i].code === language.code){
                return true;
            }
        }
    }

    $scope.newEmail ="";
    $scope.activationCode ="";
    $scope.showActivation = false;

    $scope.changeEmail = function(){
        if(!$scope.showActivation){
            var data = {mail:$scope.newEmail}
            $http({
                url: 'https://livoq.herokuapp.com/changemail',
                method: "POST",
                data: data,
                headers : {'x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword}
            }).success(function (data, status, headers, config) {

                    if(status===200){
                        $scope.addAlert('Confirm code sent to'+$scope.newEmail,'success',1);
                        $scope.showActivation = true;
                    }

                }).error(function (data, status, headers, config) {

                    $scope.addAlert(data,'success',1);
                });
        }else{
            if($scope.activationCode==""){
                $scope.addAlert('Please enter your confirm code','error',1);
            }else{
                var data = {mail:localStorage.livoqEmail,code:$scope.activationCode}

                $http({
                    url: 'https://livoq.herokuapp.com/confirm',
                    method: "POST",
                    data: data
                }).success(function (data, status, headers, config) {

                        if(status===200){
                            $scope.addAlert('Email changed to '+$scope.newEmail+". Redirecting to login",'success');
                            $scope.showActivation = false;
                            localStorage.livoqEmail =$scope.newEmail;
                            window.setTimeout($location.path('/login'),1000);

                        }

                    }).error(function (data, status, headers, config) {

                        $scope.addAlert(data,'error',1);
                    });
            }
            }


    }

    $scope.currentPassword = "";
    $scope.newPassword ="";

    $scope.changePassword = function(){
        var pw = CryptoJS.SHA256($scope.currentPassword).toString();
        var newpw = CryptoJS.SHA256($scope.newPassword).toString();

        if(sessionStorage.livoqPassword === pw){
            var data ={newpw:newpw};

            $http({
                url: 'https://livoq.herokuapp.com/changepw',
                method: "POST",
                data:data,
                headers : {'x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword}
            }).success(function (data, status, headers, config) {

                    if(status===200){
                        $scope.addAlert('Password changed successfully','success',2);
                        sessionStorage.livoqPassword =newpw;
                        $scope.currentPassword ="";
                        $scope.newPassword="";

                    }

                }).error(function (data, status, headers, config) {

                    $scope.addAlert(data,'error',2);

                });
        }else{
            $scope.addAlert('Current password is wrong','error',2);
        }



    }
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function HomeController($scope,$rootScope,$http){
    if(myQuestionsInterval){
        clearInterval(myQuestionsInterval);
    }

    document.getElementById('navibar').style.display= "block";
    //obj.style.display= "inline";

    $rootScope.activeTab="home";
    $rootScope.showNavBar=false;



    $scope.statistics={};
    $scope.rawData ={};
    $scope.rawDataDaily ={};

    $scope.statistics.pointsin = " points are in the System";
    $scope.statistics.pointsout = " points are out of the System";
    $scope.statistics.questionsask = " questions have been asked";
    $scope.statistics.questionsfinished = " questions are finished";
    $scope.statistics.votes = " votes have been given";
    $scope.statistics.currentPoints ="You have "+sessionStorage.livoqCurrentPoints+" LivoQ points";
    $scope.statistics.premiumDetails ="";
    $scope.statistics.premiumStatus ="";


    $scope.rawData.pointsin = pad(0,8);
    $scope.rawData.pointsout = pad(0,8);
    $scope.rawData.questionsask = pad(0,8);
    $scope.rawData.questionsfinished = pad(0,8);
    $scope.rawData.votes = pad(0,8);
    $scope.rawData.currentPoints = pad(0,8);
    $scope.rawData.currentPoints = pad(0,8);
    $scope.rawData.premiumStatus = pad(0,8);

    $scope.rawDataDaily.pointsin = pad(0,8);
    $scope.rawDataDaily.pointsout = pad(0,8);
    $scope.rawDataDaily.questionsask = pad(0,8);
    $scope.rawDataDaily.questionsfinished = pad(0,8);
    $scope.rawDataDaily.votes = pad(0,8);



    $scope.init=function(){
        $scope.loadStats(true);
        $scope.loadStats(false);
        $scope.getStatus();

    }

    $scope.loadStats= function(overall){
        var data = serialize({overall:overall});
        $http({
            url: 'https://livoq.herokuapp.com/getstat?'+data,
            method: "GET",
            headers : {'x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword}
        }).success(function (data, status, headers, config) {

                if(status===200){
                    if(overall){
                        $scope.rawData.pointsin = pad(data.pointsin,8);
                        $scope.rawData.pointsout = pad(data.pointsout,8);
                        $scope.rawData.questionsask = pad(data.questionsask,8);
                        $scope.rawData.questionsfinished = pad(data.questionsfinished,8);
                        $scope.rawData.votes = pad(data.votes,8);
                    }else{
                        $scope.rawDataDaily.pointsin = pad(data.pointsin,8);
                        $scope.rawDataDaily.pointsout = pad(data.pointsout,8);
                        $scope.rawDataDaily.questionsask = pad(data.questionsask,8);
                        $scope.rawDataDaily.questionsfinished = pad(data.questionsfinished,8);
                        $scope.rawDataDaily.votes = pad(data.votes,8);
                    }

                }

            }).error(function (data, status, headers, config) {

            });
    }

    $scope.getStatus = function(){
        $http({
            url: 'https://livoq.herokuapp.com/status',
            method: "GET",
            headers : {'x-livoq-mail':localStorage.livoqEmail,'x-livoq-pw':sessionStorage.livoqPassword}
        }).success(function (data, status, headers, config) {

                if(status === 200){
                    sessionStorage.livoqCurrentPoints = data.points;
                    sessionStorage.livoqIsPremium = data.premium;
                    $scope.rawData.currentPoints = pad(data.points,8);
                    $scope.rawData.premiumStatus = pad(data.premium,8);

                    if(data.premium > (Date.now()/1000)){
                        var date = new Date(data.premium *1000);
                        $scope.statistics.premiumStatus = "PREMIUM";
                        $scope.statistics.premiumDetails = "Expires "+(date.getDate()+"."+((date.getMonth()+1)<10?'0':'') + (date.getMonth()+1)+"."+date.getFullYear()+"  "+date.getUTCHours()+":"+(date.getMinutes()<10?'0':'') + date.getMinutes());
                    }else{
                        $scope.statistics.premiumStatus = "NOT premium";
                        $scope.statistics.premiumDetails = "Get premium now";
                    }
                }

        }).error(function (data, status, headers, config) {

        });
    }

    $scope.init();

    homeInterval=self.setInterval($scope.init,refreshRate);


}

function PublicController($scope,$http,$rootScope,$location){
    if(homeInterval){
        clearInterval(homeInterval);
    }
    if(myQuestionsInterval){
        clearInterval(myQuestionsInterval);
    }


    $rootScope.showNavBar=true;

    $scope.showPublicEmpty = false;
    $scope.showPublicView = false;
    $scope.hideLoadingPublic = false;
    $scope.resultdetails;

    $scope.animateStripes ="";
    $scope.progressBarPercentage =0;
    $scope.showThird = false;
    $scope.answer1 ="Yes";
    $scope.answer2 ="No";
    $scope.answer3 ="Don't know";

    $scope.redirect = function(index){
        $location.$$search ={};
        if(index === 1){
            $location.path('/login');

        }else{
            $location.path('/register');
        }
    }

    if(!$location.search()['id'] || !$location.search()['p'] ){
        $scope.showPublicEmpty = true;
        $scope.showPublicView = false;
        $scope.hideLoadingPublic = true;
    }else{

        var results =[];
        results[0] = 0;
        results[1] = 0;
        results[2] = 0;

        InitCanvas(results,"barCanvasPublic","pieCanvasPublic");

        var questionID =$location.search()['id'];
        var publicCode =$location.search()['p'];
        var data = serialize({questionid: questionID,publiccode:publicCode,complete:'true'});

        $http({
            url: 'https://livoq.herokuapp.com/result?'+data,
            method: "GET"
        }).success(function (data, status, headers, config) {
                if(status === 200){
                    var date = new Date((data.createdtimestamp*1000))
                    data.parsedDate = (date.getDate()+"."+(date.getMonth()<10?'0':'') + date.getMonth()+"."+date.getFullYear()+"  "+date.getUTCHours()+":"+(date.getMinutes()<10?'0':'') + date.getMinutes());
                    $scope.resultdetails = data;

                    var results =[];

                    results[0] =  $scope.resultdetails.voteone;
                    results[1] = $scope.resultdetails.votesum-$scope.resultdetails.voteone;
                    results[2] = 0;


                    SetCanvasValues(results);
                    if($scope.resultdetails.isthree){
                        $scope.showThird = true;
                    }

                    if($scope.resultdetails.customas){
                        $scope.answer1 =$scope.resultdetails.answerone;
                        $scope.answer2 =$scope.resultdetails.answertwo;
                    }else{
                        $scope.answer1 ="Yes";
                        $scope.answer2 ="No";
                    }


                    $scope.progressBarPercentage = Math.floor(($scope.resultdetails.votesum / $scope.resultdetails.votelimit)*100);
                    if($scope.progressBarPercentage > 100){
                        $scope.progressBarPercentage =100;
                    }
                    $scope.progressBarStyle = {width: $scope.progressBarPercentage+"%"};

                    if( $scope.progressBarPercentage < 100){
                        $scope.animateStripes = "animate_stripes";
                    }else{
                        $scope.animateStripes = "";
                    }

                    console.log(data);
                    $scope.showPublicEmpty = false;
                    $scope.showPublicView = true;
                    $scope.hideLoadingPublic = true;
                }

            }).error(function (data, status, headers, config) {
                $scope.showPublicEmpty = true;
                $scope.showPublicView = false;
                $scope.hideLoadingPublic = true;
            });
    }






}

function FeedbackController($scope,$rootScope,$location){
    if(homeInterval){
        clearInterval(homeInterval);
    }
    if(myQuestionsInterval){
        clearInterval(myQuestionsInterval);
    }


    $rootScope.activeTab="feedback";
    $rootScope.showNavBar=false;
}

function NavBarController($scope,$location){

    $scope.livoqUser = localStorage.livoqEmail;
    $scope.premiumStatus ='Not Premium';

    if(sessionStorage.livoqIsPremium > 0){
        $scope.premiumStatus ='Premium';
    }

    $scope.$on('updateNavbar', function(event, mass) {
        $scope.livoqUser = localStorage.livoqEmail;

        if(sessionStorage.livoqIsPremium > 0){
            $scope.premiumStatus ='Premium';
        }

    });

    $scope.logout = function(){
        delete sessionStorage.livoqPassword;
        delete sessionStorage.livoqCurrentPoints;
        delete sessionStorage.livoqIsPremium;
        delete sessionStorage.livoqNeedActivation;
        delete sessionStorage.loggedIn;
        delete localStorage.livoqEmail;
        delete localStorage.livoqRememberEmail
        delete localStorage.livoqLanguages;
        $location.path('/login');
    }

    $scope.openSettings = function(){
        $location.path('/settings');
    }


}