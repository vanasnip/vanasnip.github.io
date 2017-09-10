var app = angular.module('myApp', ["ngRoute"]);

app.config(function($routeProvider){
  $routeProvider
    .when("/home", {
      templateUrl: "home.html",
      controller: "myCtrl"
    })
    .when("/keytest/:theKey/:leStart/:quess", {
      templateUrl: "keytest.html",
      controller: "myCtrl"
    })
    .when("/results/:leScore/:time", {
      templateUrl: "results.html",
      controller: "myCtrl"
    })
    .otherwise ({redirectTo:"/home"});

});

app.controller('myCtrl', function($scope, $location, $routeParams, $timeout) {
    
    $scope.noteNames = ["a","b","c","d","e","f","g"];
    $scope.accidentals = [{sym:"♯", state:false}, {sym:"♭", state:false}]
    $scope.degrees = [
      {
        degree: "I",
        degKey: 0,
      },
      {
        degree: "II",
        degKey: 1
      },
      {
        degree: "III",
        degKey: 2
      },
      {
        degree: "IV",
        degKey: 3
      },
      {
        degree: "V",
        degKey: 4
      },
      {
        degree: "VI",
        degKey: 5
      },
      {
        degree: "VII",
        degKey: 6
      }
      
    ];
    $scope.keys = [
      {
        keyName: "C",
        notes: ["c","d","e","f","g","a","b"],
        index: 0
      },
      {
        keyName: "G",
        notes: ["g","a","b","c","d","e","f♯"],
        index: 1
      },
      {
        keyName: "D",
        notes: ["d","e","f♯","g","a","b","c♯"],
        index: 2
        //D, E, F♯, G, A, B, C♯
      },
      {
        keyName: "A",
        notes: ["a","b","c♯","d","e","f♯","g♯"],
        index: 3
        //A, B, C♯, D, E, F♯, G♯
      },
      {
        keyName: "E",
        notes: ["e","f♯","g♯","a","b","c♯","d♯"],
        index: 4
        //E, F♯, G♯, A, B, C♯, D♯
      },
      {
        keyName: "B",
        notes: ["b","c♯","d♯","e","f♯","g♯","a♯"],
        index: 5
        //B, C♯, D♯, E, F♯, G♯, A♯
        //C♭, D♭, E♭, F♭, G♭, A♭, B♭
      },
      {
        keyName: "C♭",
        notes: ["c♭","d♭","e♭","f♭","g♭","a♭","b♭"],
        index: 6
        //C♭, D♭, E♭, F♭, G♭, A♭, B♭
      },
      {
        keyName: "F♯",
        notes: ["f♯","g♯","a♯","b","c♯","d♯","e♯"],
        index: 7
        //F♯, G♯, A♯, B, C♯, D♯, E♯
      },
      {
        keyName: "G♭",
        notes: ["g♭","a♭","b♭","c♭","d♭","e♭","f"],
        index: 8
      },
      {
        keyName: "D♭",
        notes: ["d♭","e♭","f","g♭","a♭","b♭","c"],
        index: 9
      },
      {
        keyName: "A♭",
        notes: ["a♭","b♭","c","d♭","e♭","f","g"],
        index: 10
      },
      {
        keyName: "E♭",
        notes: ["e♭","f","g","a♭","b♭","c","d"],
        index: 11
      },
      {
        keyName: "B♭",
        notes: ["b♭","c","d","e♭","f","g","a"],
        index: 12
      },
      {
        keyName: "F",
        notes: ["f","g","a","b♭","c","d","e"],
        index: 13
      }
      
    ];
     $scope.theKey = $routeParams.theKey;
     $scope.keyArr = $routeParams.keyArr;
     $scope.leScore = $routeParams.leScore;
     $scope.leStart = $routeParams.leStart;
     $scope.quess = $routeParams.quess;
     $scope.myKeys = $scope.keys[0];
     $scope.selectedKey = "?";
     $scope.keyArray;
     var start;
     var elapsed = '0.0';
     $scope.time = $routeParams.time;

     $scope.keyTest = function(){
      if($scope.selectedKey != "?"){
        $scope.leStart = new Date().getTime()
        $location.path("/keytest/" + $scope.selectedKey +  "/" + $scope.leStart + "/" + $scope.enquiries);
        
        
      }
     }

     $scope.goHome = function(){      
        $location.path("/home");      
     }

     $scope.myResults = function(score){
      var time = new Date().getTime() - $scope.leStart;
      
      elapsed = Math.floor(time / 100) / 10;
      if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
      $scope.time = elapsed;
      console.log(elapsed);
      
      $location.path("/results/" + score + "/" + $scope.time);
      
     }

     

     $scope.selectKey = function(leKey){
      $scope.selectedKey = leKey.keyName;
      console.log($scope.enquiries);
        return $scope.selectedKey;

     }

     $scope.noQuestion = [10,20,50,100];

     $scope.enquiries = $scope.noQuestion[0];
     $scope.score = 0;
     $scope.correct = [true, 0];
     $scope.incorrect = 0;
     $scope.romanNumDeg = "";
     $scope.dispDegree = "";
     $scope.answer = "";
     $scope.acci = [false, ""];


     


     $scope.accihap = function(mod){
      $scope.acci = [true, mod];
     };



     $scope.searchKey = function(key){
      $scope.answer = "";
      //console.log(key);
      var newArray = [];
      var text = "";
      var myKeyObj = [];
      

      for (var i = 0; i < $scope.keys.length; i++) {
        
        if(key.toLowerCase() === $scope.keys[i].notes[0]){
          myKeyObj = [$scope.keys[i]];
          //console.log($scope.keys[i].notes)
          //console.log(myKeyObj);
          return $scope.questions(myKeyObj);
        }
      }
      
      
     }
     var incri;

     var randomNumber = function(){
        var leNumero = Math.floor((Math.random() * 7));
        while(leNumero === incri){
          leNumero = Math.floor((Math.random() * 7));
        }
        incri = leNumero;
        return leNumero;
     } 

     var randomise = function(){
      var randomDegree = $scope.degrees[randomNumber()];
      return randomDegree;

      //{degreeLab: II, ans: "d"}
     }

     var getQNAObj = function(obj){ 
          var myDeg = randomise();        
          var QNAObj = {
            ques: myDeg.degree,
            answ: obj[0].notes[myDeg.degKey]
          };
          return QNAObj;
        }

        
        //scalePosition:

     
     var delayMe = function(time){  
   
      setTimeout(function() {}, time);
     }
     $scope.theQuests;
     $scope.resolveMe = false;
     $scope.quality = "normal";

     $scope.questions = function(obj){   
        //console.log('got in');
        $scope.theQuests =  getQNAObj(obj);
        //console.log($scope.theQuests);        
        $scope.romanNumDeg = $scope.theQuests.ques;          
     }

     $scope.respondings = function(note){
      if ($scope.acci[0]){
        note = note + $scope.acci[1].sym;
        $scope.acci[0] = false;
      };
      if(note === $scope.theQuests.answ){
        $scope.score++;
        $scope.correct[1]++;
        $scope.correct[0] = true;
        $scope.answer = "correct";
        $scope.quality = "correct"
        console.log($scope.score);
        $timeout(function(){
          $scope.quality = "normal";
          $scope.searchKey($scope.theKey);
          console.log($scope.correct[1] == $scope.quess);
          if($scope.correct[1] == $scope.quess){   
            $scope.myResults($scope.score);
          }
        }, 500);
        
      } else if(note != $scope.theQuests.answ){
        $scope.incorrect++;
        if($scope.correct[0]){
          $scope.score--;
          $scope.correct[0] = false;
        }
        $scope.quality = "wrong"
        $scope.answer = "not quite, try again";
      }
     }




});



