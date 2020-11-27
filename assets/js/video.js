/* Light YouTube Embeds by @labnol */
/* Web: http://labnol.org/?p=27941 */

if( document.readyState !== 'loading' ) {
  prep_video_card();
} else {
  document.addEventListener('DOMContentLoaded', function () {
    prep_video_card();
  });
}


function prep_video_card(){
	var div, n,
		c = document.getElementsByClassName("youtube-card");
	for (n = 0; n < c.length; n++) {
		div = document.createElement("div");
		div.setAttribute("data-id", c[n].dataset.id);
		div.innerHTML = youtube_card(c[n].dataset.id);
		c[n].appendChild(div);
	}
}

function youtube_card(id) {
	var thumb = '<img src="https://i.ytimg.com/vi/ID/mqdefault.jpg" class="an image from the video">',
		play = '<div class="play"></div>';
	return thumb.replace("ID", id) + play;
}


function labnolIframe() {
		var iframe = document.createElement("iframe");
		var embed = "https://www.youtube.com/embed/ID?autoplay=1";
		iframe.setAttribute("src", embed.replace("ID", this.dataset.id));
		iframe.setAttribute("frameborder", "0");
		iframe.setAttribute("allowfullscreen", "1");
		this.parentNode.replaceChild(iframe, this);
}
