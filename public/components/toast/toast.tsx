import React, { Component } from 'react';
import { EuiGlobalToastList, EuiPortal } from '@elastic/eui';
import { getToasts } from '../../kibana-services';


export function addToast({color, title, text, time = 3000}){
  getToasts().add({title, text, toastLifeTimeMs: time, color})
}