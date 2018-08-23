$(document).ready(function () {
    $("#sns-button").click(() => {
        $("#sns-button").prop('disabled', true);
        grecaptcha.execute();
    });
    $("#tweet-button").click(() => {
        var w = 600, h = 400;
        var l = screen.width/2 - w/2;
        var t = screen.height/2 - h/2;
        var url = "https://twitter.com/intent/tweet?text=I+love+CodeChain%0A%3CYour+Platform+Account+Address+Here%3E%0AHusky CodeChain Testnet&via=codechain_io&url=https%3A%2F%2Fhusky.codechain.io";
        var default_option = "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no";
        window.open(url, "popup", default_option + ", width=" + w + ",height=" + h + ",top=" + t + ",left=" + l); 
    });
});

function onCaptchaSuccess(captchaResult) {
    var input = $("#sns-url").val();
    closeAllMessage();
    $.post("/faucet/api/requestMoneyBySNS", {
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
    $(".refresh").show();
}

function closeAllMessage() {
    $("#sns-url").popover("dispose");
    $("#sns-url").removeClass("error");
}
