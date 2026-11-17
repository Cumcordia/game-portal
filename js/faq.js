$(function () {
  "use strict";

  $(".faq-question").on("click", function () {
    const $btn = $(this);
    const $item = $btn.closest(".faq-item");
    const $answer = $item.find(".faq-answer");
    const $indicator = $btn.find(".faq-indicator");
    const isExpanded = $btn.attr("aria-expanded") === "true";
    const nextExpanded = !isExpanded;

    $btn.attr("aria-expanded", String(nextExpanded));
    $item.toggleClass("is-open", nextExpanded);
    $indicator.text(nextExpanded ? "\u2212" : "+");
    $answer.stop(true, true).slideToggle(250);
  });
});
