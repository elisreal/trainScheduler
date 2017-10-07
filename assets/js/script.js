// 1. load firebase database
// 2. the table will load old data from the database
// 3. fill out the form
// 4. click the submit button
// 5. on.click the data in the form will push to the firebase
// 6. The firebase data will be pushed to the DOM


$(document).ready(function() {
//connect to my firebase
var config = {
    apiKey: "AIzaSyBlwUSJ6kEKZCv2NU91-XJa2JENYqlcSac",
    authDomain: "trainproject-69883.firebaseapp.com",
    databaseURL: "https://trainproject-69883.firebaseio.com",
    projectId: "trainproject-69883",
    storageBucket: "trainproject-69883.appspot.com",
    messagingSenderId: "216605387561"
  };

  firebase.initializeApp(config);
  
  var database = firebase.database();
  console.log("Firebase");

  

  //Button click function
  $("#submitBtn").on("click", function(event) {
    console.log("Push it real good");
    event.preventDefault();

  //collect info from form
    var trainName = $('#train_name').val();
    var destination = $('#destination').val();
    var firstTrain = $('#firstTrain').val();
    var frequency = $('#frequency').val();

  //collate info into new object in firebase
    var newTrain = {
      train: trainName,
      destination: destination,
      frequency: frequency,
      firstTrain: firstTrain
    }

  //push to database
    database.ref().push(newTrain);

    console.log(newTrain.train);
    console.log(newTrain.destination);
    console.log(newTrain.frequency);
    console.log(newTrain.firstTrain);

  });

  database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());
    
    var tfrequency = childSnapshot.val().frequency;
    var tname = childSnapshot.val().train;
    var tdest = childSnapshot.val().destination;

    var convertedDate = moment(childSnapshot.val().firstTrain, 'hh:mm').subtract(1, 'years');
    var trainTime = moment(convertedDate).format('HH:mm');
    var currentTime = moment();

    // // pushed back 1 year to make sure it comes before current time
    var firstTimeConverted = moment(trainTime,'hh:mm').subtract(1, 'years');
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % tfrequency;

    var tMinutesTillTrain = tfrequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, 'minutes').format('HH:mm');

    // //append DOM
    $("#schedule").append("<tr><td>" + tname + "</td><td>" + tdest + "</td><td>" + tfrequency + "</td><td>" + trainTime + "</td><td>" + tMinutesTillTrain + "</td></tr>");
    $( '#mainForm' ).each(function(){
      this.reset();
    });

  });

})