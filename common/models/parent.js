module.exports = function(Parent) {

// model operation hook
  Parent.observe('before save', function(ctx, next) {
    if (ctx.instance) {
      console.log('About to save a parent instance:', ctx.instance.image_url);
    } else {
      console.log('About to update parents that match the query %j:', ctx.where);
    }
    next();
  });
};
