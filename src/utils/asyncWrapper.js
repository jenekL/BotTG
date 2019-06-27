/**
 * Wrapper to catch async errors within a stage. Helps to avoid try catch blocks in there
 * @param fn - function to enter a stage
 */
const asyncWrapper = (fn) => {
    return async function(ctx, next) {
        try {
            return await fn(ctx);
        } catch (error) {
            //logger.error(ctx, 'asyncWrapper error, %O', error);
            ctx.reply('something wrong');
            return next();
        }
    };
};

module.exports = asyncWrapper;