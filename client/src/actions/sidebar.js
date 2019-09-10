import { TOGGLE_SIDEBAR } from './types';

export const toggleSidebar = sidebarState => dispatch =>
  dispatch({ type: TOGGLE_SIDEBAR, payload: sidebarState });