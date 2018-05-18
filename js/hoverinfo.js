

export class HoverInfo {
  constructor(containerSelector, html, width) {
    console.log(containerSelector)
    console.log(d3.select(containerSelector).node())
    const that = this;
    d3.select(containerSelector)
      .append("div")
      .html("<i class=\"far fa-lightbulb\"></i>")
      .on("mouseenter", function(){ that.mouseEnter(); })
      .on("mouseleave", function(){ that.mouseLeave(); });

    this.hideTimeout = 400;
    this.width = width;
    this.infoDiv = d3.select("body")
      .append("div")
      .attr("class", "infobox")
      .style("width", width+"px")
      .style("position", "absolute")
      .style("display", "none")
      .html(html)
      .on("mouseenter", function(){ that.mouseEnter(); })
      .on("mouseleave", function(){ that.mouseLeave(); });

  }

  mouseEnter(){
    if(this.infoDiv.style("display") === "none") {
      const that = this;
      this.infoDiv
        .style("display", "block")
        .style("top", function(){
          const mouseY = event.clientY;
          return (mouseY + 10) + "px";
        })
        .style("left", function(){
          const mouseX = event.clientX;
          const windowWidth = $(window).width();
          if(mouseX + that.width > windowWidth){
            return (mouseX - 10 - that.width) + "px";
          } else {
            return (mouseX + 10) + "px";
          }
        })

    }
    this.hideTimeStamp = undefined;


  }

  mouseLeave(){
    this.hideTimeStamp = Date.now();
    const that = this;
    setTimeout(function() {that.tryToHide();}, this.hideTimeout);
  }

  tryToHide(){
    if(this.hideTimeStamp === undefined){
      return;
    }
    const timeSinceLastHideReq = Date.now() - this.hideTimeStamp;
    if (timeSinceLastHideReq >= this.hideTimeout){
      this.infoDiv.style("display", "none")
    }

  }
}
