$(document).ready(function () {
    console.log("HI");

    $("#sns-button").click(function () {
        var input = $("#sns-url").val();
        console.log("Input is " + input);
        $.post("/api/requestMoney", {
            to: input
        }, function (data) {
            console.log("get data from server " + JSON.stringify(data));
        });
    });
});
