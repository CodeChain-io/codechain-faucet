$(document).ready(function () {
    $("#sns-button").click(() => {
        $("#sns-button").prop('disabled', true);
        grecaptcha.execute();
    });
});

function onCaptchaSuccess(captchaResult) {
    var input = $("#sns-url").val();
    closeAllMessage();
    $.post("/api/requestMoneyBySNS", {
        url: input,
        captcha: captchaResult
    }, function (data) {
        $("#sns-button").prop('disabled', false);
        if (data.success) {
            showSuccessMessage(data.message);
        } else {
            showErrorMessage(data.message);
        }
        grecaptcha.reset();
    });
}

function showErrorMessage(text) {
    $("#sns-url").popover({
        container: ".input-popover",
        content: text,
        placement: "top",
        trigger: "manual"
    });
    $("#sns-url").popover("show");
}

function showSuccessMessage(text) {
    console.log("Success is not implementec yet " + text);
}

function closeAllMessage() {
    $("#sns-url").popover("dispose");
}
