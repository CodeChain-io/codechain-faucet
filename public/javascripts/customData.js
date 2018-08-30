$(document).ready(function() {
    $(document).on("click", "[data-faucet-hide]", function(e) {
        e.preventDefault();
        var $this = $(this);
        $this.closest("." + $this.attr("data-faucet-hide")).hide();
    });
});
