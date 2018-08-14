$(document).ready(function () {
    console.log("HI");
});

function onSNSButtonClick() {
    var input = $("#sns-url").val();
    console.log("Input is " + input);
    $.post("/api/requestMoneyBySNS", {
        url: input
    }, function (data) {
        console.log("get data from server " + JSON.stringify(data));
        alert(JSON.stringify(data));
    });
}
