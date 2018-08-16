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
    closeAllMessage();
    $.post("/api/requestMoneyBySNS", {
        url: input,
        captcha: captchaResult
    }, function (data) {
        console.log("get data from server " + JSON.stringify(data));
        if (data.success) {
            showSuccessMessage(data.message);
        } else {
            showErrorMessage(data.message);
        }
        grecaptcha.reset();
    });
}

function showErrorMessage(text) {
    $("#error-alert > span").text(text);
    $("#error-alert").show();
}

function showSuccessMessage(text) {
    $("#success-alert > span").text(text);
    $("#success-alert").show();
}

function closeAllMessage() {
    $("#error-alert").hide();
    $("#success-alert").hide();
}
