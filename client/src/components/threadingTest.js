import React from 'react'

export default function threadingTest() {
  const spawn = require('threads').spawn;
  const thread = spawn(function (input, done) {
    // Everything we do here will be run in parallel in another execution context.
    // Remember that this function will be executed in the thread's context,
    // so you cannot reference any value of the surrounding code.
    console.log('Doing some work')
    console.log(input, done)
    done({ string: input.string, integer: parseInt(input.string) });
  });

  thread
    .send({ string: '456' })
    // The handlers come here: (none of them is mandatory)
    .on('message', function (response) {
      console.log('456 * 2 = ', response.integer * 2);
      thread.kill();
    })
    .on('error', function (error) {
      console.error('Worker errored:', error);
    })
    .on('exit', function () {
      console.log('Worker has been terminated.');
    });
  return (
    <div>
      <h1> Threading Test</h1>
    </div>
  )
}
