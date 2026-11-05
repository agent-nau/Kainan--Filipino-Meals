// Lets Node resolve extensionless relative imports (as Metro does) so the pure logic can be tested without Expo.
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (e) {
    if (e.code === 'ERR_MODULE_NOT_FOUND' && /^\.\.?\//.test(specifier) && !/\.[a-z]+$/i.test(specifier)) {
      return nextResolve(specifier + '.js', context);
    }
    throw e;
  }
}
