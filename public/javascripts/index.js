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
    $("#sns-url").addClass("error");
    $("#sns-url").popover({
        container: ".input-popover",
        content: text,
        placement: "top",
        trigger: "manual"
    });
    $("#sns-url").popover("show");
}

function showSuccessMessage(text) {
    $("#sns-url").prop("disabled", true);
    $("#sns-url").val("");
    $("#sns-url").attr("placeholder", "Successful!");
    $("#sns-url").addClass("success");
    $("#sns-button").text("Check the transaction on the Explorer");
    $("#sns-button").off("click");
    $("#sns-button").prop("href", text).prop("target", "_blank");
}

function closeAllMessage() {
    $("#sns-url").popover("dispose");
    $("#sns-url").removeClass("error");
}
