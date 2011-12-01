define([
    'tracie',
    './core/speech'
], function(tracie, speech) {
    return {
        init: function() {
            $(function() {
                var $response = $('div.responseContainer'),
                    listening = new Audio('audio/earcon_listening.wav'),
                    done_listening = new Audio('audio/earcon_done_listening.wav'),
                    parse = function(e) {
                        if ($(e.target).val().length < 1) {
                            return;
                        }
                        var said = $(e.target).val(),
                            response = tracie.parse(said),
                            audible = false,
                            $resp = $("<div class='response'> <span class='quote'>“</span>" + said + "<span class='quote'>”</span></div>");

                        if (localStorage['speech']) {
                            var s = JSON.parse(localStorage['speech']);
                            audible = s.enabled;
                        }

                        if (audible) {
                            listening.play();
                        }

                        $response.prepend($resp);

                        $resp.fadeIn();

                        if (audible) {
                            if(response === 'none'){
                                return;
                            }
                            var promise = speech.speak(response);

                            promise.done(function(data) {
                                    done_listening.play();

                                    var $res = $("<div class='tracie response'>" + response + "</div>");
                                    $response.prepend($res);
                                    $res.fadeIn();
                                    $("#demo1player").html("<audio autoplay='autoplay' src='" + data.snd_url + "' />");
                                }
                            );
                        } else {
                            if(response === 'none'){
                                return;
                            }
                            setTimeout(function() {
                                var $res = $("<div class='tracie response'>" + response + "</div>");
                                $response.prepend($res);
                                $res.fadeIn();
                            }, 250);
                        }

                    };

                $('#speech').on('webkitspeechchange', parse);
                $('#speech').on('blur', parse);
            });
        }
    };
});