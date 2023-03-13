import {
    ToastsStart,
  } from 'kibana/public';

import { createGetterSetter } from '../../../src/plugins/kibana_utils/common';

export const [getToasts, setToasts] = createGetterSetter<ToastsStart>('Toasts');

