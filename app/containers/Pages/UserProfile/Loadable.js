/**
 *
 * Asynchronously loads the component for TryContainer
 *
 */

import loadable from "../../../utils/loadable";

export default loadable(() => import("./index"));
