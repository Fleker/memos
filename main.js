// Kernel

function boot_state(txt) {
    console.log(txt);
    $('#boot_status').innerHTML = txt;
}

function delay(ms) {
    var time = new Date().getTime();
    while (new Date().getTime() - time < ms) {}
}

(function() {
     var init_process = new Promise(function(fulfill, reject) {
        // Schedule idle task
        var process_table = [];
        // As JS passes by reference, we can create the ptable here and pass it into the process manager
        process_init(process_table);
        function task_scheduler() {
            // Iterate through every process and execute it.
            // Simple round robin implementation. No priority.
            for (i in process_table) {
                var p = process_table[i];
                process_exec(p);
            }
            // Now set up another system call in a second - This is the null process
            setTimeout(task_scheduler, PROCESS_TIMING_QUANTUM);
        }

         function idle() {
             // Don't do anything
         }

         process_add("System Idle Process", idle);
         setTimeout(task_scheduler, PROCESS_TIMING_QUANTUM);
         fulfill();
    });

    var init_dream_journal = new Promise(function(fulfill, reject) {
        fulfill();
    })

    var cmd_shutdown = function(args) {
        if (args[1] == "-r") {
            window.location.reload();
            return "Rebooting...";
        } else if (args[1] == "-s") {
            // Can't close window itself, redirect to help
            window.location.href = "README.md";
            return;
        } else {
            return "-r : Reboot<br>-s : Shutdown";
        }
    }

    boot_state("Loading...");

    cli_register("shutdown", cmd_shutdown);

    init_process.then(function() {
        boot_state("Restarting tasks...");
        init_dream_journal.then(function() {
            setTimeout(function() {
                $('#splashscreen').style.display = 'none';
                $('#entry').focus();
            }, 2000);
        });
    });
})();
