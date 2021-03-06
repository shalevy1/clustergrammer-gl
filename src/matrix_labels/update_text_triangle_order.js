module.exports = function update_text_triangle_order(params, inst_axis){

  // Here we are updating the positions of the existing text triangles that
  // we have already pre-calculated. This needs to be better harmonized with
  // the update_text_offsets function that works directly on the network_data

  var inst_order = params.order.inst[inst_axis];
  var new_order = params.order.new[inst_axis];

  var inst_text_triangles = params.text_triangles.draw[inst_axis];
  var num_labels = params.labels['num_' + inst_axis];

  var inst_dim;
  if (inst_axis === 'col'){
    inst_dim = 'x';
  } else {
    inst_dim = 'y';
  }

  var order_id;
  var order_state;
  var offsets = {};

  var axis_arr = params.canvas_pos[inst_dim + '_arr'];

  _.each(inst_text_triangles, function(inst_label, inst_id){

    // calculate inst and new offsets
    _.each(['inst', 'new'], function(inst_state){

      if (inst_state === 'inst'){
        order_state = inst_order
      } else {
         order_state = new_order
      }

      if (inst_axis === 'col'){
        order_id = params.network[inst_axis + '_nodes'][inst_id][order_state];
        offsets[inst_state] = axis_arr[ (num_labels - 1) - order_id ] + 0.5/num_labels;
      } else {
        order_id = num_labels - 1 - params.network[inst_axis + '_nodes'][inst_id][order_state];
        offsets[inst_state] = axis_arr[ order_id ] + 0.5/num_labels;
      }
    });

    inst_label.inst_offset = [0, offsets.inst];
    inst_label.new_offset = [0, offsets.new];

  });


  return inst_text_triangles;

}