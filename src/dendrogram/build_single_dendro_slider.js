var change_groups = require('./change_groups');
// var position_dendro_slider = require('./position_dendro_slider');

module.exports = function build_single_dendro_slider(regl, params, inst_axis){


  var slider_length = 100;
  var rect_height = slider_length + 20;
  var rect_width = 20;

  var drag = d3.behavior.drag()
      .on('drag', dragging)
      .on('dragend', function(){
        params.is_slider_drag = false;
      });

  var slider_group = d3.select(params.root + ' .'+ inst_axis +'_dendro_slider_svg')
      .append('g')
      .classed( inst_axis + '_slider_group', true)
      .attr('transform', function(){
        var inst_translation;
        inst_translation = 'translate(' + rect_width/2 + ', '+ rect_height/10 +')';
        return inst_translation;
      })

  slider_group
    .append('rect')
    .classed(inst_axis+'_slider_background', true)
    .attr('height', rect_height+'px')
    .attr('width', rect_width+'px')
    .attr('fill', 'red')
    .attr('transform', function(){
      var translate_string = 'translate(-10, -5)';
      return translate_string;
    })
    .style('opacity', 0);

  slider_group
    .append('line')
    .style('stroke-width', slider_length/7+'px')
    .style('stroke', 'black')
    .style('stroke-linecap', 'round')
    .style('opacity', 0.0)
    .attr('y1', 0)
    .attr('y2', function(){
      return slider_length-2;
    })
    .on('click', click_dendro_slider);

  var offset_triangle = -slider_length/40;
  slider_group
    .append('path')
    .style('fill', 'black')
    .attr('transform', 'translate('+offset_triangle+', 0)')
    .attr('d', function() {

      // up triangle
      var start_x = 0 ;
      var start_y = 0;

      var mid_x = 0;
      var mid_y = slider_length;

      var final_x = slider_length/10;
      var final_y = 0;

      var output_string = 'M' + start_x + ',' + start_y + ' L' +
      mid_x + ', ' + mid_y + ' L' +
      final_x + ','+ final_y +' Z';

      return output_string;
    })
    .style('opacity', 0.35)
    .on('click', click_dendro_slider);


  var default_opacity = 0.35;
  var high_opacity = 0.6;
  slider_group
    .append('circle')
    .classed(inst_axis+'_group_circle', true)
    .attr('r', slider_length * 0.08)
    .attr('transform', function(){
      return 'translate(0, '+slider_length/2+')';
    })
    .style('fill', 'blue')
    .style('opacity', default_opacity)
    .on('mouseover', function(){
      d3.select(this).style('opacity', high_opacity);
    })
    .on('mouseout', function(){
      d3.select(this).style('opacity', default_opacity);
    })
    .call(drag);

  function dragging() {

    params.is_slider_drag = true;

    // d[0] = d3.event.x;
    var slider_pos = d3.event.y;

    if (slider_pos < 0){
      slider_pos = 0;
    }

    if (slider_pos > slider_length){
      slider_pos = slider_length;
    }

    if (this.nextSibling) {
      this.parentNode.appendChild(this);
    }

    slider_pos = d3.round(slider_pos, -1);

    var slider_value = 10 - slider_pos/10;

    d3.select(this).attr('transform', 'translate(0, ' + slider_pos + ')');

    change_groups(regl, params, inst_axis, slider_value);

  }

  function click_dendro_slider(){

    var clicked_line_position = d3.mouse(this);

    var rel_pos = d3.round(clicked_line_position[1], -1);

    d3.select(params.root+ ' .'+inst_axis+'_group_circle')
      .attr('transform', 'translate(0, '+ rel_pos + ')');

    var slider_value = 10 - rel_pos/10;

    change_groups(regl, params, inst_axis, slider_value);

  }
};