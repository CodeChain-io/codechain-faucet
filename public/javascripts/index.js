$(document).ready(function () {
    console.log("HI");

    $("#sns-button").click(() => {
        console.log("Call captcha");
        grecaptcha.execute();
    });
});

function onCaptchaSuccess(captchaResult) {
    var input = $("#sns-url").val();
    console.log("Input is " + input);
    $.post("/api/requestMoneyBySNS", {
        url: input,
        captcha: captchaResult
    }, function (data) {
        console.log("get data from server " + JSON.stringify(data));
        alert(JSON.stringify(data));
        grecaptcha.reset();
    });
}
