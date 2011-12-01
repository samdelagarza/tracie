define([], function() {
    return {
        speak: function(tts) {
            return $.getJSON("http://vaas.acapela-group.com/webservices/1-32-01-JSON/synthesizer.php?jsoncallback=?",
                {
                    prot_vers: 2, cl_login: "EVAL_VAAS", cl_app: "EVAL_8701487", cl_pwd: "j5sv012r",
                    req_voice:"rachel22k",
                    req_text:tts
                });
        }
    };
});