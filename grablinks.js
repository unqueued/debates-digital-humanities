// version 2.2
// Updated jQuery to stable head
// removed padding changes on hover, too messy
// avoid Tweet This, ADN and Facebook Share links

// version 2.1
//
// Fixed jQuery injection

// version 2.0
//
// no repeated urls
// handle relative links and local hashes better
// better handling of title attributes
// add origin link at top of output
// don't force selection on click, allow copying individual parts
// add a close button
// truncate long titles at 50 chars
// Do a better job of incrementing/decrementing padding

(function () {
	function callback() {
		(function ($) {
			var jQuery = $;
			$("#loadingp").fadeOut("fast", function () {
				$(this).remove();
			});
			var selectLinks = function () {
				var doc = document,
					text = doc.getElementById("linkoutput"),
					range, selection;
				if (doc.body.createTextRange) {
					range = doc.body.createTextRange();
					range.moveToElementText(text);
					range.select();
				} else if (window.getSelection) {
					selection = window.getSelection();
					range = doc.createRange();
					range.selectNodeContents(text);
					selection.removeAllRanges();
					selection.addRange(range);
				}
			}, collection = [];
			$("div,table,article,section,aside").on("mouseover mouseout click", function (a) {
                                a.stopPropagation();
				a.type === "mouseover" ? $(this).css({
					outline: "1px solid rgb(194, 130, 148)"
				}).addClass("mkhovered") : $("div,table,article,section,aside").css({
					outline: "none"
				}).removeClass("mkhovered");
				if (a.type === "click") {
					a.preventDefault();
					$(".mkhovered").css({
						outline: "none"
					}).removeClass("mkhovered");
					var i, url, linkText, norepeat = [],
						linkage = $(this).find("a"),
						avoidUrls = ["twitter\\.com\\/intent","www\\.facebook\\.com\\/dialog","alpha\\.app\\.net\\/intent"];
					linkage.each(function (i, link) {
						var $link = $(link);
						var parser = document.createElement("a");
						parser.href = $link.attr("href");
						for (i in avoidUrls) {
							var re = new RegExp(avoidUrls[i]);
							if (re.test(parser.href)) {
								return false;
							}
						}
						if ($.inArray(parser.href, norepeat) === -1) {
							console.log(parser.href);
							norepeat.push(parser.href);
							if ($link.attr("title") && $link.attr("title").length > 3) {
								linkText = $link.attr("title");
							} else {
								if ($link.text() === undefined || $link.text().length < 4) {
									if (document.location.hostname === parser.hostname && parser.hash !== "") {
										linkText = parser.hash;
									} else {
										linkText = parser.href;
									}
								} else {
									linkText = $link.text();
								}
							}
							collection.push(["- [" + linkText.replace(/[\n\r\s]+/g, " ").replace(/(^\s*|\s*$)/g, "").slice(0, 50).replace(/[\[\]\|]+/g, "") + "](" + parser.href + ")"]);
						}
					});
					$("<div>").css({
						position: "fixed",
						top: "0",
						left: "0",
						right: "0",
						bottom: "0",
						overflow: "auto",
						backgroundColor: "#efefef",
						color: "#333",
						zIndex: "99999",
						fontFamily: "menlo, courier, monospace"
					}).append($("<pre id=linkoutput>").css({
						padding: "20px",
						margin: "40px",
						textAlign: "left"
					}).text("Collected from: [" + document.title.replace(/[\r\n]+/, "") + "](" + document.location.href + ")\n\n\n" + collection.join("\n"))).append($("<a href=#>Click here to close</a>").css({
						display: "block",
						padding: "10px",
						color: "#fff",
						fontSize: "16px",
						background: "rgba(194, 56, 96, 1)",
						margin: "0 auto",
						width: "220px",
						textAlign: "center",
						borderRadius: "10px",
						fontFamily: "Helvetica, Arial, sans-serif",
						fontWeight: "bold",
					}).click(function (ev) {
						$(this).closest("div").remove();
						$("div,table,article,section,aside").unbind();
					})).appendTo("body");
					selectLinks();
					return false;
				}
			})
		})(jQuery.noConflict(true))
	}
	var s = document.createElement("script");
	s.src = "https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
	if (s.addEventListener) {
		s.addEventListener("load", callback, false)
	} else if (s.readyState) {
		s.onreadystatechange = callback
	}
	document.body.appendChild(s);
})()
