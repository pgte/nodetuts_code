var kue  = require('kue')
  , jobs = kue.createQueue();

var sequence = 0;

setInterval(
    function() {
      sequence += 1;
      (function(sequence) {
        var job = jobs.create('email', {
            title: 'Hello #' + sequence
          , to: 'pedro.teixeira@gmail.com'
          , body: 'Hello from Node Tuts!'
        }).attempts(5).priority('high').delay(10000).save();

        job.on('complete', function() {
          console.log('job ' + sequence + ' completed!')
        });

        job.on('failed', function() {
          console.log('job ' + sequence + ' failed!')
        });
        
        job.on('progress', function(percentComplete) {
          console.log('job ' + sequence + ' is ' + percentComplete + '% complete');
        });
    
      })(sequence);
    }
  , 1000
);
