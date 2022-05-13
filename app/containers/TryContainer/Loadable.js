/**
 *
 * Asynchronously loads the component for TryContainer
 *
 */

import loadable from "loadable-components";

export default loadable(() => import("./index"));
