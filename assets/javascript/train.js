$(document).ready(function () {

    //Initialize Firebase
    var config = {
        apiKey: "AIzaSyAcWHsjtnbfH5Yqu3Fkpbt8GjhvCKHsmKA",
        authDomain: "train-scheduler-4e036.firebaseapp.com",
        databaseURL: "https://train-scheduler-4e036.firebaseio.com",
        projectId: "train-scheduler-4e036",
        storageBucket: "train-scheduler-4e036.appspot.com",
        messagingSenderId: "151473520771"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    ////Capture Button Click
    $("#submit-btn").click(function (event) {
        console.log("click")
        event.preventDefault();

        //Grabbing values from text boxes
        var trainName = $("#name").val().trim();
        var trainDestination = $("#destination").val().trim();
        var trainFirstTime = $("#firstTime").val().trim();
        var trainFrequency = $("#frequency").val().trim();

        //local temporary object for holding data 
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            firstTime: trainFirstTime,
            frequency: trainFrequency
        };

        database.ref().push(newTrain);
    });

    // 3. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function (childSnapshot) {

        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var trainFirstTime = childSnapshot.val().firstTime;
        var trainFrequency = childSnapshot.val().frequency;

            //train firts time format
            var trainTimeFormat = moment(trainFirstTime, "hh:mm a").subtract(1, "years");

            //difference between the times 
            var diffTime = moment().diff(moment(trainTimeFormat), "minutes");

            //time apart 
            var tReminder = diffTime % trainFrequency;

            // minutes until train 
            var minutes = trainFrequency - tReminder;

            // next train 
            var nextTrain = moment().add(minutes, "minutes");
        
            var newTr = $("<tr>").append(
                $("<td>").text(trainName),
                $("<td>").text(trainDestination),
                $("<td>").text(trainFrequency),
                $("<td>").text(moment(nextTrain).format("hh:mm a")),
                $("<td>").text(minutes)
            );

            $(".table > tbody").append(newTr);
       
    }, function (errorObject) {
        console.log(errorObject.code);

    });



});